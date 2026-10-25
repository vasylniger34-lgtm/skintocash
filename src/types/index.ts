export type Currency = 'USD' | 'EUR' | 'UAH' | 'CRYPTO';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // vs USD
  prefix: string;
  suffix: string;
}

export type RarityType = 'Contraband' | 'Covert' | 'Extraordinary' | 'Classified' | 'Restricted' | 'Mil-Spec';

export interface Sticker {
  name: string;
  image: string;
  price: number;
}

export interface CS2Skin {
  id: string;
  name: string;
  weapon: string;
  skinName: string;
  category: 'Knife' | 'Gloves' | 'Rifle' | 'Sniper' | 'Pistol' | 'SMG';
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
  wear: 'FN' | 'MW' | 'FT';
  float: number;
  amount: number;
  currency: string;
  method: string;
  methodIcon: string;
  timeAgo: string;
  image: string;
  rarityColor: string;
  txHash?: string;
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
