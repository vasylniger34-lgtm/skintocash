import type { CS2Skin } from './index';

export type P2POrderType = 'sell' | 'buy';

export type P2PPaymentMethodId = 
  | 'monobank' 
  | 'privatbank' 
  | 'card_uah' 
  | 'usdt_trc20' 
  | 'ton' 
  | 'visa_mc_eur' 
  | 'revolut';

export interface P2PPaymentOption {
  id: P2PPaymentMethodId;
  name: string;
  category: 'card_uah' | 'crypto' | 'fiat_eur';
  icon: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface P2PTrader {
  name: string;
  avatar: string;
  steamId64: string;
  rating: number; // e.g. 4.97
  totalTrades: number; // e.g. 312
  successRate: number; // e.g. 99.7
  avgResponseMinutes: number; // e.g. 2
  isOnline: boolean;
  isVerified: boolean;
}

export interface P2POrder {
  id: string;
  type: P2POrderType; // 'sell' = user has skin, wants money; 'buy' = user has money, wants skin
  creator: P2PTrader;
  skins: CS2Skin[];
  priceUsd: number;
  paymentMethods: P2PPaymentMethodId[];
  paymentDetailsSummary: string;
  tradeHoldDays: number;
  steamMarketDiffPercent: number; // negative means cheaper than Steam Market, positive means above
  note?: string;
  createdAt: string;
  status: 'active' | 'in_deal' | 'completed' | 'cancelled';
}

export interface P2PDeal {
  id: string;
  order: P2POrder;
  buyerName: string;
  sellerName: string;
  amountUsd: number;
  selectedPaymentMethod: P2PPaymentOption;
  paymentDetails: string;
  currentStep: 1 | 2 | 3 | 4; // 1: Confirmation -> 2: Payment -> 3: Steam Trade -> 4: Complete
  stepStatusText: string;
  createdAt: string;
}
