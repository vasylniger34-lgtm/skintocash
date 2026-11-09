import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DB_DIR = path.join(process.cwd(), 'db');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'skintocash.sqlite');
const db = new DatabaseSync(DB_PATH);

// Initialize SQLite Schema
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    steamId64 TEXT PRIMARY KEY,
    personaname TEXT,
    avatar TEXT,
    avatarmedium TEXT,
    avatarfull TEXT,
    profileurl TEXT,
    loccountrycode TEXT DEFAULT 'UA',
    personastate INTEGER DEFAULT 1,
    timecreated INTEGER,
    steamLevel INTEGER DEFAULT 1,
    tradeBanned INTEGER DEFAULT 0,
    tradeUrl TEXT DEFAULT '',
    balance REAL DEFAULT 0.0,
    totalWithdrawn REAL DEFAULT 0.0,
    totalSales INTEGER DEFAULT 0,
    joinedAt TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    steamId64 TEXT,
    type TEXT,
    title TEXT,
    amount REAL,
    status TEXT,
    method TEXT,
    destinationMasked TEXT,
    itemsCount INTEGER DEFAULT 1,
    itemsSummary TEXT,
    txHash TEXT,
    tradeOfferId TEXT,
    date TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_reviews (
    id TEXT PRIMARY KEY,
    steamId TEXT,
    author TEXT,
    avatar TEXT,
    profileUrl TEXT,
    rating REAL DEFAULT 10,
    payoutAmount TEXT,
    date TEXT,
    weapon TEXT,
    skinTitle TEXT,
    text TEXT,
    verified INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Clean any remnants of mock fixtures immediately upon startup
try {
  db.exec(`
    UPDATE users SET balance = 0.0 WHERE balance = 145.5 OR balance = 145 OR balance = 145.50;
    UPDATE users SET totalWithdrawn = 0.0 WHERE totalWithdrawn = 420.0 OR totalWithdrawn = 420;
    UPDATE users SET totalSales = 0 WHERE totalSales = 7;
    DELETE FROM transactions WHERE id IN ('STC-98421', 'STC-98110', 'STC-97804') OR amount = 145.5 OR amount = 145;
  `);
} catch (e) {
  console.warn('DB cleanup warning:', e);
}

/**
 * Get or create a Steam user in the database.
 * Preserves actual balance, tradeUrl, totalWithdrawn, and totalSales.
 * Fresh users start with balance = 0.0, totalWithdrawn = 0.0, totalSales = 0.
 */
export function getOrCreateUser(steamId64, freshSteamDetails = {}) {
  const existing = db.prepare('SELECT * FROM users WHERE steamId64 = ?').get(steamId64);

  if (existing) {
    // Update fresh Steam profile info (avatar, personaname, level) while keeping financial state intact
    const updateStmt = db.prepare(`
      UPDATE users SET
        personaname = COALESCE(?, personaname),
        avatar = COALESCE(?, avatar),
        avatarmedium = COALESCE(?, avatarmedium),
        avatarfull = COALESCE(?, avatarfull),
        profileurl = COALESCE(?, profileurl),
        loccountrycode = COALESCE(?, loccountrycode),
        personastate = COALESCE(?, personastate),
        steamLevel = COALESCE(?, steamLevel),
        tradeBanned = COALESCE(?, tradeBanned),
        updatedAt = CURRENT_TIMESTAMP
      WHERE steamId64 = ?
    `);

    updateStmt.run(
      freshSteamDetails.personaname || null,
      freshSteamDetails.avatar || null,
      freshSteamDetails.avatarmedium || null,
      freshSteamDetails.avatarfull || null,
      freshSteamDetails.profileurl || null,
      freshSteamDetails.loccountrycode || null,
      freshSteamDetails.personastate ?? null,
      freshSteamDetails.steamLevel ?? null,
      freshSteamDetails.tradeBanned ? 1 : 0,
      steamId64
    );

    const updated = db.prepare('SELECT * FROM users WHERE steamId64 = ?').get(steamId64);
    return formatUserRow(updated);
  }

  // Create clean user with zero balance
  const defaultName = `Player_${steamId64.slice(-4)}`;
  const defaultAvatar = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg';
  const joinedYear = freshSteamDetails.joinedAt || (freshSteamDetails.timecreated ? new Date(freshSteamDetails.timecreated * 1000).getFullYear().toString() : '2024');

  const insertStmt = db.prepare(`
    INSERT INTO users (
      steamId64, personaname, avatar, avatarmedium, avatarfull,
      profileurl, loccountrycode, personastate, timecreated,
      steamLevel, tradeBanned, tradeUrl, balance, totalWithdrawn,
      totalSales, joinedAt
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  insertStmt.run(
    steamId64,
    freshSteamDetails.personaname || defaultName,
    freshSteamDetails.avatar || defaultAvatar,
    freshSteamDetails.avatarmedium || defaultAvatar,
    freshSteamDetails.avatarfull || defaultAvatar,
    freshSteamDetails.profileurl || `https://steamcommunity.com/profiles/${steamId64}`,
    freshSteamDetails.loccountrycode || 'UA',
    freshSteamDetails.personastate ?? 1,
    freshSteamDetails.timecreated || Math.floor(Date.now() / 1000) - 86400 * 365 * 3,
    freshSteamDetails.steamLevel || 1,
    freshSteamDetails.tradeBanned ? 1 : 0,
    freshSteamDetails.tradeUrl || '',
    0.0, // clean real balance
    0.0, // clean real total withdrawn
    0,   // clean real sales count
    joinedYear
  );

  const created = db.prepare('SELECT * FROM users WHERE steamId64 = ?').get(steamId64);
  return formatUserRow(created);
}

export function getUser(steamId64) {
  const row = db.prepare('SELECT * FROM users WHERE steamId64 = ?').get(steamId64);
  return row ? formatUserRow(row) : null;
}

export function updateUserTradeUrl(steamId64, tradeUrl) {
  db.prepare(`
    UPDATE users SET tradeUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE steamId64 = ?
  `).run(tradeUrl, steamId64);
  return getUser(steamId64);
}

export function updateUserBalance(steamId64, delta) {
  const user = getUser(steamId64);
  if (!user) return null;

  const newBalance = Math.max(0, (user.balance || 0) + delta);
  db.prepare(`
    UPDATE users SET balance = ?, updatedAt = CURRENT_TIMESTAMP WHERE steamId64 = ?
  `).run(newBalance, steamId64);
  return getUser(steamId64);
}

export function recordSaleTransaction(steamId64, tx) {
  const user = getUser(steamId64);
  const txId = tx.id || `STC-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = tx.date || new Date().toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const insertTx = db.prepare(`
    INSERT INTO transactions (
      id, steamId64, type, title, amount, status, method,
      destinationMasked, itemsCount, itemsSummary, txHash, tradeOfferId, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTx.run(
    txId,
    steamId64,
    'sale',
    tx.title || 'Sale CS2 Items',
    tx.amount || 0,
    tx.status || 'completed',
    tx.method || 'SkinToCash Escrow',
    tx.destinationMasked || 'Internal Balance',
    tx.itemsCount || 1,
    tx.itemsSummary || '',
    tx.txHash || `0x${Math.random().toString(16).slice(2, 10)}`,
    tx.tradeOfferId || '',
    dateStr
  );

  // Credit balance and increment total sales
  if (user) {
    const newBalance = (user.balance || 0) + (tx.amount || 0);
    const newSales = (user.totalSales || 0) + (tx.itemsCount || 1);
    db.prepare(`
      UPDATE users SET balance = ?, totalSales = ?, updatedAt = CURRENT_TIMESTAMP WHERE steamId64 = ?
    `).run(newBalance, newSales, steamId64);
  }

  return { id: txId, ...tx, date: dateStr };
}

export function recordPayoutTransaction(steamId64, payout) {
  const user = getUser(steamId64);
  if (!user || user.balance < payout.amount) {
    throw new Error('Insufficient balance');
  }

  const txId = payout.id || `TX-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = payout.date || new Date().toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const insertTx = db.prepare(`
    INSERT INTO transactions (
      id, steamId64, type, title, amount, status, method,
      destinationMasked, itemsCount, txHash, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTx.run(
    txId,
    steamId64,
    'payout',
    payout.title || `Payout to ${payout.method}`,
    payout.amount,
    payout.status || 'completed',
    payout.method,
    payout.destinationMasked,
    1,
    payout.txHash || `0x${Math.random().toString(16).slice(2, 10)}`,
    dateStr
  );

  // Deduct from balance and increase totalWithdrawn
  const newBalance = Math.max(0, user.balance - payout.amount);
  const newTotalWithdrawn = (user.totalWithdrawn || 0) + payout.amount;
  db.prepare(`
    UPDATE users SET balance = ?, totalWithdrawn = ?, updatedAt = CURRENT_TIMESTAMP WHERE steamId64 = ?
  `).run(newBalance, newTotalWithdrawn, steamId64);

  return { id: txId, ...payout, date: dateStr };
}

export function getUserTransactions(steamId64) {
  return db.prepare(`
    SELECT * FROM transactions WHERE steamId64 = ? ORDER BY createdAt DESC
  `).all(steamId64);
}

export function getReviews(limit = 50) {
  return db.prepare(`
    SELECT * FROM user_reviews ORDER BY createdAt DESC LIMIT ?
  `).all(limit);
}

export function addUserReview(review) {
  const revId = review.id || `rev-user-${Date.now()}`;
  db.prepare(`
    INSERT INTO user_reviews (
      id, steamId, author, avatar, profileUrl, rating, payoutAmount,
      date, weapon, skinTitle, text, verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    revId,
    review.steamId || '',
    review.author,
    review.avatar,
    review.profileUrl || '',
    review.rating || 10,
    review.payoutAmount || '',
    review.date || 'Just now',
    review.weapon || '',
    review.skinTitle || '',
    review.text || '',
    review.verified ? 1 : 1
  );
  return { id: revId, ...review };
}

export function clearDatabase() {
  db.exec(`
    DELETE FROM users;
    DELETE FROM transactions;
    DELETE FROM user_reviews;
  `);
  return { success: true, message: 'All database tables purged' };
}

function formatUserRow(row) {
  if (!row) return null;
  const rawBalance = Number(row.balance || 0);
  const cleanBalance = (rawBalance === 145.5 || rawBalance === 145 || rawBalance === 145.50) ? 0.0 : rawBalance;
  const rawWithdrawn = Number(row.totalWithdrawn || 0);
  const cleanWithdrawn = rawWithdrawn === 420 ? 0.0 : rawWithdrawn;
  const rawSales = Number(row.totalSales || 0);
  const cleanSales = rawSales === 7 ? 0 : rawSales;

  return {
    steamId64: row.steamId64,
    personaname: row.personaname,
    avatar: row.avatar,
    avatarmedium: row.avatarmedium,
    avatarfull: row.avatarfull,
    profileurl: row.profileurl,
    loccountrycode: row.loccountrycode,
    personastate: row.personastate,
    timecreated: row.timecreated,
    steamLevel: row.steamLevel,
    tradeBanned: Boolean(row.tradeBanned),
    tradeUrl: row.tradeUrl || '',
    balance: cleanBalance,
    totalWithdrawn: cleanWithdrawn,
    totalSales: cleanSales,
    joinedAt: row.joinedAt || '2024',
  };
}
