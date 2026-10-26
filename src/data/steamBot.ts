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
  level: number;
  memberSince: string;
  inventoryCount: number;
  isOnline: boolean;
  isVerifiedBot: boolean;
}

/**
 * Real, active working Steam Bot loaded from mafile (anelisabartmann55)
 * Verified active CS2 inventory, open public profile, and active trade URL.
 */
export const OFFICIAL_STEAM_BOT: OfficialSteamBot = {
  id: 'bot-skintocash-01',
  accountName: 'eloisakostuck',
  personaName: 'SkinToCash.com | Bot #1',
  steamId64: '76561199863517720',
  partnerId: '1903251992',
  tradeToken: 'f8SoxM7q',
  tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=1903251992&token=f8SoxM7q',
  avatar: 'https://avatars.fastly.steamstatic.com/ddbd804c7f15630115025199dd37c1877cfa430c_full.jpg',
  profileUrl: 'https://steamcommunity.com/id/skintocash_official_bot/',
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
