export type Currency = 'USD' | 'EUR' | 'UAH' | 'RUB' | 'CRYPTO';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // vs USD
  prefix: string;
  suffix: string;
}

export type RarityType = 'Contraband' | 'Covert' | 'Extraordinary' | 'Classified' | 'Restricted' | 'Mil-Spec' | 'Industrial' | 'Consumer';

export interface Sticker {
  name: string;
  image: string;
  price: number;
}

export type SkinCategory = 'Knife' | 'Gloves' | 'Rifle' | 'Sniper' | 'Pistol' | 'SMG' | 'Shotgun' | 'Machinegun' | 'Case' | 'Sticker' | 'Agent' | 'Other';

export interface CS2Skin {
  id: string;
  name: string;
  weapon: string;
  skinName: string;
  category: SkinCategory;
  wear: 'FN' | 'MW' | 'FT' | 'WW' | 'BS';
  wearName: string;
  float: number;
  rarity: RarityType;
  rarityColor: string;
  rarityBorder: string;
  rarityGlow: string;
  price: number; // Base USD price
  steamPrice: number;
  buffPrice: number;
  image: string;
  fallbackImage?: string;
  isStatTrak?: boolean;
  phase?: string;
  patternIndex?: number;
  stickers?: Sticker[];
  tradeLockDays?: number;
}

export interface LivePayout {
  id: string;
  skinName: string;
  weapon: string;
  wear: 'FN' | 'MW' | 'FT' | 'WW' | 'BS' | '-';
  float?: number;
  amount: number;
  currency: string;
  method: string;
  methodIcon: string;
  timeAgo: string;
  timestamp: number;
  image: string;
  fallbackImage?: string;
  rarityColor: string;
  txHash?: string;
  steamId64?: string;
  traderName?: string;
  traderAvatar?: string;
}

export interface PaymentOption {
  id: string;
  name: string;
  category: 'crypto' | 'card' | 'bank' | 'e-wallet';
  icon: string;
  badge: string;
  badgeType: 'instant' | 'free' | 'popular';
  fee: string;
  speed: string;
  minAmount: number;
  description: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  skinSold: string;
  payoutAmount: string;
  payoutMethod: string;
  verified: boolean;
}

export interface SteamUser {
  steamId64: string;
  personaname: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  profileurl: string;
  loccountrycode?: string;
  personastate?: number; // 0: Offline, 1: Online, 2: Busy, 3: Away, 4: Snooze, 5: Looking to trade, 6: Looking to play
  timecreated?: number;
  steamLevel?: number;
  tradeBanned?: boolean;
  tradeUrl?: string;
  balance?: number; // USD
  totalWithdrawn?: number;
  totalSales?: number;
  joinedAt?: string;
}

export interface UserTransaction {
  id: string;
  date: string;
  type: 'sale' | 'payout';
  title: string;
  amount: number; // USD
  status: 'completed' | 'processing' | 'failed';
  method: string;
  destinationMasked: string;
  itemsCount: number;
  itemsSummary?: string;
  txHash?: string;
  tradeOfferId?: string;
}

