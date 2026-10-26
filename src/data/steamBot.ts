import type { CS2Skin } from '../types';

export interface OfficialSteamBot {
  id: string;
  accountName: string;
  personaName: string;
  steamId64: string;
  partnerId: string;
  tradeToken: string;
  tradeUrl: string;
  avatar: string;
  profileUrl: string;
  country: string;
  level: number;
  memberSince: string;
  inventoryCount: number;
  isOnline: boolean;
  isVerifiedBot: boolean;
}

/**
 * Real, active working Steam Bot loaded from mafile (anelisabartmann55)
 * Region set to RU (Russian Federation).
 * Open public profile, verified avatar, and active trade URL.
 */
export const OFFICIAL_STEAM_BOT: OfficialSteamBot = {
  id: 'bot-skintocash-01',
  accountName: 'anelisabartmann55',
  personaName: 'SkinToCash.com | Official Bot #1',
  steamId64: '76561198694150587',
  partnerId: '733884859',
  tradeToken: 'xA2LPIG_',
  tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=733884859&token=xA2LPIG_',
  avatar: '/images/skintocash_bot_avatar.jpg',
  profileUrl: 'https://steamcommunity.com/id/skintocash_bot_01/',
  country: 'RU',
  level: 1,
  memberSince: '2026',
  inventoryCount: 1,
  isOnline: true,
  isVerifiedBot: true,
};

export interface DepositTradeSession {
  txId: string;
  securityCode: string;
  bot: OfficialSteamBot;
  tradeUrl: string;
  tradeMessage: string;
  skins: CS2Skin[];
  totalValue: number;
  destinationAddress: string;
  paymentMethodName: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * Generates an automated deposit & cashout trade session with unique verification codes.
 */
export function createDepositTradeSession(
  skins: CS2Skin[],
  totalValue: number,
  destinationAddress = '',
  paymentMethodName = 'Картка / Баланс'
): DepositTradeSession {
  // Generate pseudo-random transaction and security codes
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const txId = `TX-SKC-${randomSuffix}`;
  const securityCode = Math.floor(1000 + Math.random() * 9000).toString();

  const tradeMessage = `[SkinToCash.com] Депозит #${txId} | Код перевірки: ${securityCode} | Одержувач: ${destinationAddress || 'Баланс'} | УВАГА: Не приймайте обмін, якщо код у Steam Guard не збігається з ${securityCode}!`;

  return {
    txId,
    securityCode,
    bot: OFFICIAL_STEAM_BOT,
    tradeUrl: OFFICIAL_STEAM_BOT.tradeUrl,
    tradeMessage,
    skins,
    totalValue,
    destinationAddress,
    paymentMethodName,
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  };
}
