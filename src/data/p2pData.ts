import { MOCK_CS2_INVENTORY } from './skinsData';
import type { P2POrder, P2PPaymentOption, P2PTrader } from '../types/p2p';

export const P2P_PAYMENT_METHODS: P2PPaymentOption[] = [
  {
    id: 'monobank',
    name: 'Monobank (₴ UAH)',
    category: 'card_uah',
    icon: '🐱',
    badgeBg: 'bg-black/80',
    badgeText: 'text-white',
    badgeBorder: 'border-white/20',
  },
  {
    id: 'privatbank',
    name: 'ПриватБанк (₴ UAH)',
    category: 'card_uah',
    icon: '🟢',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    id: 'card_uah',
    name: 'Будь-яка картка UAH (Visa/MC)',
    category: 'card_uah',
    icon: '💳',
    badgeBg: 'bg-blue-950/60',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/30',
  },
  {
    id: 'usdt_trc20',
    name: 'USDT (TRC20 / TON)',
    category: 'crypto',
    icon: '₮',
    badgeBg: 'bg-teal-950/60',
    badgeText: 'text-teal-400',
    badgeBorder: 'border-teal-500/30',
  },
  {
    id: 'ton',
    name: 'TON Coin ($TON)',
    category: 'crypto',
    icon: '💎',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
  },
  {
    id: 'revolut',
    name: 'Revolut (€ EUR / $ USD)',
    category: 'fiat_eur',
    icon: '⚡',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-pink-400',
    badgeBorder: 'border-pink-500/30',
  },
  {
    id: 'visa_mc_eur',
    name: 'Visa / Mastercard (€ EUR)',
    category: 'fiat_eur',
    icon: '🇪🇺',
    badgeBg: 'bg-indigo-950/60',
    badgeText: 'text-indigo-400',
    badgeBorder: 'border-indigo-500/30',
  },
];

export const MOCK_TRADERS: Record<string, P2PTrader> = {
  s1mple_fan: {
    name: 'Alex [Kyiv-Trader]',
    avatar: 'https://avatars.akamai.steamstatic.com/c6c39f04130089e9d6d1353bf3d0da61d3f3f01c_full.jpg',
    steamId64: '76561198084291823',
    rating: 4.99,
    totalTrades: 482,
    successRate: 99.8,
    avgResponseMinutes: 1,
    isOnline: true,
    isVerified: true,
  },
  knife_collector: {
    name: 'Bohdan_CS2',
    avatar: 'https://avatars.akamai.steamstatic.com/974b77f9899eb7d12fef24cb6ceb5175988d8b1e_full.jpg',
    steamId64: '76561198129485721',
    rating: 4.96,
    totalTrades: 215,
    successRate: 99.2,
    avgResponseMinutes: 2,
    isOnline: true,
    isVerified: true,
  },
  crypto_trader: {
    name: 'Max_USDT_Fast',
    avatar: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    steamId64: '76561198301928471',
    rating: 5.0,
    totalTrades: 640,
    successRate: 100.0,
    avgResponseMinutes: 1,
    isOnline: true,
    isVerified: true,
  },
  skin_baron_ua: {
    name: 'Dmitry | P2P PRO',
    avatar: 'https://avatars.akamai.steamstatic.com/9e9fa3302bc56b3e4f728fa5d2cae867dbf96ea6_full.jpg',
    steamId64: '76561198229401928',
    rating: 4.94,
    totalTrades: 178,
    successRate: 98.9,
    avgResponseMinutes: 3,
    isOnline: false,
    isVerified: true,
  },
  vitaliy_pro: {
    name: 'Vitaliy_Lviv',
    avatar: 'https://avatars.akamai.steamstatic.com/393b4f6556e729a4358bbd52c1e85507ec7fefcf_full.jpg',
    steamId64: '76561198118274619',
    rating: 4.98,
    totalTrades: 341,
    successRate: 99.7,
    avgResponseMinutes: 2,
    isOnline: true,
    isVerified: true,
  },
};

export const INITIAL_P2P_ORDERS: P2POrder[] = [
  // 1. SELL: Butterfly Knife | Fade
  {
    id: 'p2p-101',
    type: 'sell',
    creator: MOCK_TRADERS.s1mple_fan,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Butterfly')) || MOCK_CS2_INVENTORY[4]
    ],
    priceUsd: 2150.00,
    paymentMethods: ['monobank', 'privatbank', 'usdt_trc20'],
    paymentDetailsSummary: 'Monobank 4441 •••• •••• 9128 / USDT TRC20',
    tradeHoldDays: 0,
    steamMarketDiffPercent: -14.2,
    note: 'Швидка оплата на Моно/Приват, одразу підтверджую трейд у Steam Guard! Чистий 99% Fade.',
    createdAt: '12 хв тому',
    status: 'active',
  },

  // 2. BUY: Looking for AWP | Dragon Lore
  {
    id: 'p2p-102',
    type: 'buy',
    creator: MOCK_TRADERS.crypto_trader,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Dragon Lore')) || MOCK_CS2_INVENTORY[1]
    ],
    priceUsd: 4200.00,
    paymentMethods: ['usdt_trc20', 'monobank', 'privatbank'],
    paymentDetailsSummary: 'Переказ USDT TRC20 / Monobank миттєво',
    tradeHoldDays: 0,
    steamMarketDiffPercent: +4.8,
    note: 'Шукаю AWP Dragon Lore (FT або краще). Оплата миттєва, готовий кинути передоплату в Escrow.',
    createdAt: '24 хв тому',
    status: 'active',
  },

  // 3. SELL: Karambit | Gamma Doppler Emerald
  {
    id: 'p2p-103',
    type: 'sell',
    creator: MOCK_TRADERS.knife_collector,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Gamma Doppler')) || MOCK_CS2_INVENTORY[0]
    ],
    priceUsd: 3450.00,
    paymentMethods: ['monobank', 'usdt_trc20', 'revolut'],
    paymentDetailsSummary: 'Monobank / USDT TRC20 / Revolut EUR',
    tradeHoldDays: 0,
    steamMarketDiffPercent: -11.3,
    note: 'Рідкісний Emerald Phase, float 0.0084 (топ-20 світ)! Без блокувань, миттєва відправка.',
    createdAt: '45 хв тому',
    status: 'active',
  },

  // 4. BUY: Looking for M4A4 | Howl
  {
    id: 'p2p-104',
    type: 'buy',
    creator: MOCK_TRADERS.vitaliy_pro,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Howl')) || MOCK_CS2_INVENTORY[2]
    ],
    priceUsd: 3950.00,
    paymentMethods: ['monobank', 'privatbank', 'card_uah'],
    paymentDetailsSummary: 'Оплата на будь-яку картку України в ₴ за топ курсом',
    tradeHoldDays: 0,
    steamMarketDiffPercent: +6.2,
    note: 'Скуповую Howl у свою колекцію. Скидаю гроші на картку протягом 2 хвилин!',
    createdAt: '1 год тому',
    status: 'active',
  },

  // 5. SELL: Sport Gloves | Vice
  {
    id: 'p2p-105',
    type: 'sell',
    creator: MOCK_TRADERS.skin_baron_ua,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Vice')) || MOCK_CS2_INVENTORY[5]
    ],
    priceUsd: 1420.00,
    paymentMethods: ['monobank', 'privatbank', 'ton'],
    paymentDetailsSummary: 'Monobank / ПриватБанк / TON Wallet',
    tradeHoldDays: 0,
    steamMarketDiffPercent: -9.5,
    note: 'Рукавиці Vice FT з чистими кісточками. Трейд відкритий, перевірка в Steam за секунди.',
    createdAt: '2 год тому',
    status: 'active',
  },

  // 6. SELL: AK-47 | Case Hardened (Blue Gem)
  {
    id: 'p2p-106',
    type: 'sell',
    creator: MOCK_TRADERS.s1mple_fan,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Case Hardened')) || MOCK_CS2_INVENTORY[3]
    ],
    priceUsd: 1850.00,
    paymentMethods: ['monobank', 'usdt_trc20'],
    paymentDetailsSummary: 'Monobank / USDT TRC20',
    tradeHoldDays: 0,
    steamMarketDiffPercent: -15.0,
    note: 'Паттерн #661 Blue Gem з Titan Holo Katowice 2014! Найкраща ціна в P2P сегменті.',
    createdAt: '3 год тому',
    status: 'active',
  },

  // 7. BUY: Looking for Glock-18 | Fade
  {
    id: 'p2p-107',
    type: 'buy',
    creator: MOCK_TRADERS.crypto_trader,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Glock-18')) || MOCK_CS2_INVENTORY[9]
    ],
    priceUsd: 1320.00,
    paymentMethods: ['usdt_trc20', 'ton', 'monobank'],
    paymentDetailsSummary: 'USDT TRC20 / TON / Монобанк',
    tradeHoldDays: 0,
    steamMarketDiffPercent: +3.9,
    note: 'Шукаю Glock Fade від 95% Fade. Оплата криптою або на Монобанк без затримок.',
    createdAt: '4 год тому',
    status: 'active',
  },

  // 8. SELL: Desert Eagle | Blaze
  {
    id: 'p2p-108',
    type: 'sell',
    creator: MOCK_TRADERS.vitaliy_pro,
    skins: [
      MOCK_CS2_INVENTORY.find(s => s.name.includes('Blaze')) || MOCK_CS2_INVENTORY[6]
    ],
    priceUsd: 580.00,
    paymentMethods: ['monobank', 'privatbank', 'card_uah'],
    paymentDetailsSummary: 'Картка Monobank / Приват24',
    tradeHoldDays: 0,
    steamMarketDiffPercent: -8.0,
    note: 'Deagle Blaze Factory New, 0.01 float. Ідеальний полум\'яний малюнок без подряпин на задній частині.',
    createdAt: '5 год тому',
    status: 'active',
  },
];
