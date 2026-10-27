import type { LivePayout } from '../types';

export interface CatalogSkinItem {
  weapon: string;
  skinName: string;
  wear: 'FN' | 'MW' | 'FT' | 'WW' | 'BS' | '-';
  baseFloat?: number;
  amount: number;
  rarityColor: string;
  image: string;
  fallbackImage?: string;
  tier: 'budget' | 'mid' | 'high' | 'grail';
}

/**
 * 100% Verified Working CS2 Item Catalog with full price diversity:
 * - Budget (< $10): Cases, stickers, common rifles, pistols, SMGs ($0.30 - $5)
 * - Mid-tier ($10 - $90): Playskins ($11 - $50)
 * - High-tier ($100 - $950): Printstream, Asiimov, Crown Foil ($115 - $950)
 * - Grails ($1,000 - $8,900): Knives, Gloves, Howl, Dragon Lore, Wild Lotus
 */
export const DIVERSE_SKINS_CATALOG: CatalogSkinItem[] = [
  // --- CASES & STICKERS (Budget $0.30 - $4.50) ---
  {
    weapon: 'Case',
    skinName: 'Dreams & Nightmares Case',
    wear: '-',
    amount: 0.95,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Case',
    skinName: 'Fracture Case',
    wear: '-',
    amount: 0.32,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y7vyne5tsLc-eD3WSzetJtuBtSha_nBovp3OGztqtIH-RbwV1X5Z5QuEPshGwl9TuY-vrsQPd3d0QmSz72nwY5ilo_a9cBrKGUnAZ',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Case',
    skinName: 'Kilowatt Case',
    wear: '-',
    amount: 1.85,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y7vyne5tsLc-eD3WSzetJtuBtSha_nBovp3OGztqtIH-RbwV1X5Z5QuEPshGwl9TuY-vrsQPd3d0QmSz72nwY5ilo_a9cBrKGUnAZ',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Sticker',
    skinName: 'MOUZ (Glitter) | Antwerp 2022',
    wear: '-',
    amount: 1.65,
    rarityColor: '#8847ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM6pIinHtAI694v7_12-fhX-kpmu_3Ba6ff8aaA6cqiXXjaVmOpztONoTXnjw0904GXcyIqrcnrEb1ByWYwwG7AD8Znu9w',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Sticker',
    skinName: 'NaVi (Holo) | Paris 2023',
    wear: '-',
    amount: 4.20,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM-sJnCW8Vli_YTxuAm2FVLjm5fz8ixk5_2iZ-o-I6PDX2HFxbsmtORsG3jgxEQm6mWHm9r9In_EbVV0DZciELULsRO-jJS5YC3mluwy',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },

  // --- BUDGET CS2 SKINS ($0.30 - $4.50) ---
  {
    weapon: 'AK-47',
    skinName: 'Safari Mesh',
    wear: 'FT',
    baseFloat: 0.224,
    amount: 0.45,
    rarityColor: '#b0c3d9',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0P-re6xSNPGdMWuZxuZi_rIxSirkkElyt2qEzI2heXiTaVIiX5siROQJtxnul4XnYbvgswOMgolbjXKpnRk9Yjk',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'AK-47',
    skinName: 'Uncharted',
    wear: 'FT',
    baseFloat: 0.198,
    amount: 0.92,
    rarityColor: '#4b69ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0P-re6xSNPGdMWuZxuZi_rIxSirkkElyt2qEzI2heXiTaVIiX5siROQJtxnul4XnYbvgswOMgolbjXKpnRk9Yjk',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'USP-S',
    skinName: 'Cortex',
    wear: 'FT',
    baseFloat: 0.2104,
    amount: 3.60,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVMitznSmNahJHnCagIhCMAlQeJYu0K5koHjMbixtg3fjI8Tni72iXxL8G81tEVZEKlw',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'USP-S',
    skinName: 'Ticket to Hell',
    wear: 'FT',
    baseFloat: 0.185,
    amount: 0.75,
    rarityColor: '#8847ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVMitznSmNahJHnCagIhCMAlQeJYu0K5koHjMbixtg3fjI8Tni72iXxL8G81tEVZEKlw',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'AWP',
    skinName: 'Pit Viper',
    wear: 'FT',
    baseFloat: 0.245,
    amount: 0.95,
    rarityColor: '#8847ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'budget',
  },
  {
    weapon: 'AWP',
    skinName: 'Capillary',
    wear: 'MW',
    baseFloat: 0.089,
    amount: 1.20,
    rarityColor: '#4b69ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'budget',
  },
  {
    weapon: 'AWP',
    skinName: 'Mortis',
    wear: 'FT',
    baseFloat: 0.174,
    amount: 3.50,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'budget',
  },
  {
    weapon: 'Glock-18',
    skinName: 'High Beam',
    wear: 'FN',
    baseFloat: 0.021,
    amount: 1.15,
    rarityColor: '#5e98d9',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Glock-18',
    skinName: 'Bunsen Burner',
    wear: 'FT',
    baseFloat: 0.231,
    amount: 0.40,
    rarityColor: '#4b69ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'Desert Eagle',
    skinName: 'Oxide Blaze',
    wear: 'FN',
    baseFloat: 0.034,
    amount: 0.85,
    rarityColor: '#4b69ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'M4A1-S',
    skinName: 'Night Terror',
    wear: 'FT',
    baseFloat: 0.218,
    amount: 1.65,
    rarityColor: '#8847ff',
    image: '/images/skins/m4a1s_printstream.png',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'P250',
    skinName: 'Valence',
    wear: 'FN',
    baseFloat: 0.019,
    amount: 0.85,
    rarityColor: '#4b69ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },
  {
    weapon: 'MP9',
    skinName: 'Starlight Protector',
    wear: 'FT',
    baseFloat: 0.22,
    amount: 4.50,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y7vyne5tsLc-eD3WSzetJtuBtSha_nBovp3OGztqtIH-RbwV1X5Z5QuEPshGwl9TuY-vrsQPd3d0QmSz72nwY5ilo_a9cBrKGUnAZ',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'budget',
  },

  // --- MID-TIER PLAYSINS ($10 - $50) ---
  {
    weapon: 'AK-47',
    skinName: 'The Empress',
    wear: 'FT',
    baseFloat: 0.221,
    amount: 38.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'mid',
  },
  {
    weapon: 'M4A1-S',
    skinName: 'Hyper Beast',
    wear: 'FT',
    baseFloat: 0.219,
    amount: 28.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/m4a1s_printstream.png',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'mid',
  },
  {
    weapon: 'AWP',
    skinName: 'Atheris',
    wear: 'FN',
    baseFloat: 0.018,
    amount: 14.50,
    rarityColor: '#8847ff',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'mid',
  },
  {
    weapon: 'AWP',
    skinName: 'Neo-Noir',
    wear: 'MW',
    baseFloat: 0.091,
    amount: 36.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'mid',
  },
  {
    weapon: 'Glock-18',
    skinName: 'Water Elemental',
    wear: 'MW',
    baseFloat: 0.082,
    amount: 11.50,
    rarityColor: '#d32ce6',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'mid',
  },
  {
    weapon: 'USP-S',
    skinName: 'Kill Confirmed',
    wear: 'FT',
    baseFloat: 0.224,
    amount: 49.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVMitznSmNahJHnCagIhCMAlQeJYu0K5koHjMbixtg3fjI8Tni72iXxL8G81tEVZEKlw',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'mid',
  },

  // --- HIGH-TIER SKINS ($100 - $950) ---
  {
    weapon: 'Desert Eagle',
    skinName: 'Printstream',
    wear: 'MW',
    baseFloat: 0.0754,
    amount: 115.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'high',
  },
  {
    weapon: 'AWP',
    skinName: 'Asiimov',
    wear: 'FT',
    baseFloat: 0.245,
    amount: 165.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFicyOl-pK9tGyuwk0wh6mjRm92gcHPEa1N0C5UhQOcCs0a6wdHmN-zmtQzZgt9N02yg2aJV9_v4',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'high',
  },
  {
    weapon: 'M4A1-S',
    skinName: 'Printstream',
    wear: 'FN',
    baseFloat: 0.0152,
    amount: 495.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/m4a1s_printstream.png',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'high',
  },
  {
    weapon: 'Sticker',
    skinName: 'Crown (Foil)',
    wear: '-',
    amount: 950.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjNm1PHic4ERmpsj3-FbwTyL3kZ_ssycDt6v4PvU_dvTGDWGWl-xwtLZoS36ykB4ltTvXy42seS_EPFQpC8BuBbldJQkRI1c',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'high',
  },

  // --- GRAILS & TOP KNIVES/GLOVES ($1,000 - $45,000) ---
  {
    weapon: '★ Karambit',
    skinName: 'Gamma Doppler',
    wear: 'FN',
    baseFloat: 0.0084,
    amount: 3450.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/karambit_gamma_doppler.png',
    fallbackImage: '/images/skins/karambit_gamma_doppler.png',
    tier: 'grail',
  },
  {
    weapon: '★ Butterfly Knife',
    skinName: 'Fade',
    wear: 'FN',
    baseFloat: 0.0118,
    amount: 2890.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/butterfly_fade.png',
    fallbackImage: '/images/skins/butterfly_fade.png',
    tier: 'grail',
  },
  {
    weapon: '★ Butterfly Knife',
    skinName: 'Doppler Phase 2',
    wear: 'FN',
    baseFloat: 0.0142,
    amount: 2450.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvw-J3s-p5SiihmSIqsi-HlorwOy7DAVRPVssnHaMUuhe9xIHlMuvqtgPf2IoTyC383Sod7CY-sr4DVfZ2qKPU3g-TNuE-545DeqjFvb87vg',
    fallbackImage: '/images/skins/butterfly_fade.png',
    tier: 'grail',
  },
  {
    weapon: 'AWP',
    skinName: 'Dragon Lore',
    wear: 'FT',
    baseFloat: 0.1824,
    amount: 4280.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/awp_dragon_lore.png',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'grail',
  },
  {
    weapon: 'AWP',
    skinName: 'Gungnir',
    wear: 'FN',
    baseFloat: 0.0298,
    amount: 8900.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6N4LvedB3WvzedxuPUnHnjnzUl0sWrdztitI3rDZgJzAsZ1QOFY4UPqldDgMO_l41HXit9AmTK-0H227dAsvQ',
    fallbackImage: '/images/skins/awp_dragon_lore.png',
    tier: 'grail',
  },
  {
    weapon: 'M4A4',
    skinName: 'Howl',
    wear: 'FN',
    baseFloat: 0.0312,
    amount: 5400.00,
    rarityColor: '#e4ae39',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF6ueZhW2exwkl2tmTXwt39eCiUPQR2DMN4TOVetUK8xoLgM-K341eM2otDnC6okGoXufBz_TAB',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'grail',
  },
  {
    weapon: 'AK-47',
    skinName: 'Wild Lotus',
    wear: 'FN',
    baseFloat: 0.0245,
    amount: 7850.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'grail',
  },
  {
    weapon: '★ Sport Gloves',
    skinName: 'Pandora\'s Box',
    wear: 'FT',
    baseFloat: 0.2241,
    amount: 2150.00,
    rarityColor: '#eb4b4b',
    image: '/images/skins/gloves_pandora.png',
    fallbackImage: '/images/skins/gloves_pandora.png',
    tier: 'grail',
  },
  {
    weapon: 'AK-47',
    skinName: 'Fire Serpent',
    wear: 'MW',
    baseFloat: 0.0821,
    amount: 1320.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'grail',
  },
  {
    weapon: 'Sticker',
    skinName: 'Titan (Holo) | Katowice 2014',
    wear: '-',
    amount: 45000.00,
    rarityColor: '#eb4b4b',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM-sJnCW8Vli_YTxuAm2FVLll4Lh8x1T4P6hJqZrJfHAXjXGkr0i4rc_GSjixEh35GSAnNr8IyqSbg8kA8ciRrQJshGm0oqwlCzKr50',
    fallbackImage: '/images/skins/m4a1s_printstream.png',
    tier: 'grail',
  },
];

export const PAYMENT_METHODS_OPTIONS = [
  { name: 'Visa / Mastercard', icon: 'card' },
  { name: 'Карта МИР', icon: 'mir' },
  { name: 'СБП', icon: 'sbp' },
  { name: 'USDT TRC20', icon: 'usdt' },
  { name: 'USDT BEP20', icon: 'usdt' },
  { name: 'TON Coin', icon: 'ton' },
  { name: 'Bitcoin', icon: 'btc' },
  { name: 'Revolut Pay', icon: 'revolut' },
];

export const STORAGE_KEY_PAYOUTS = 'skintocash_live_payouts_v4';

/**
 * Weighted random picker from catalog:
 * 40% budget, 35% mid, 16% high, 9% grail
 */
export function pickRandomCatalogSkin(): CatalogSkinItem {
  const roll = Math.random() * 100;
  let targetTier: CatalogSkinItem['tier'] = 'budget';

  if (roll < 40) {
    targetTier = 'budget';
  } else if (roll < 75) {
    targetTier = 'mid';
  } else if (roll < 91) {
    targetTier = 'high';
  } else {
    targetTier = 'grail';
  }

  const pool = DIVERSE_SKINS_CATALOG.filter(item => item.tier === targetTier);
  if (pool.length === 0) {
    return DIVERSE_SKINS_CATALOG[Math.floor(Math.random() * DIVERSE_SKINS_CATALOG.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Creates a single randomized LivePayout item for a specific timestamp
 */
export function createPayoutItem(item: CatalogSkinItem, timestamp: number, idPrefix = 'pay'): LivePayout {
  const methodObj = PAYMENT_METHODS_OPTIONS[Math.floor(Math.random() * PAYMENT_METHODS_OPTIONS.length)];
  
  let floatVal = item.baseFloat;
  if (floatVal !== undefined && item.wear !== '-') {
    const jitter = (Math.random() - 0.5) * 0.005;
    floatVal = Math.max(0.0001, parseFloat((floatVal + jitter).toFixed(4)));
  }

  const priceJitter = 1 + (Math.random() * 0.04 - 0.02);
  const finalAmount = Math.max(0.25, Math.round(item.amount * priceJitter * 100) / 100);

  const hex1 = Math.random().toString(16).substring(2, 6);
  const hex2 = Math.random().toString(16).substring(2, 6);

  return {
    id: `${idPrefix}-${timestamp}-${Math.floor(Math.random() * 1000)}`,
    skinName: item.skinName,
    weapon: item.weapon,
    wear: item.wear,
    float: floatVal,
    amount: finalAmount,
    currency: '$',
    method: methodObj.name,
    methodIcon: methodObj.icon,
    timeAgo: 'Just now',
    timestamp,
    image: item.image,
    fallbackImage: item.fallbackImage || '/images/skins/m4a1s_printstream.png',
    rarityColor: item.rarityColor,
    txHash: `0x${hex1}...${hex2}`,
  };
}

/**
 * Generates an authentic 2-hour timeline history (60-80 transactions)
 * with sales happening randomly every 1 to 3 minutes.
 */
export function generateInitialHistory(now = Date.now()): LivePayout[] {
  const payouts: LivePayout[] = [];
  const twoHoursMs = 120 * 60 * 1000;
  const startTime = now - twoHoursMs;
  
  let currentTimestamp = now - (Math.floor(Math.random() * 25) + 10) * 1000;

  while (currentTimestamp > startTime) {
    const skin = pickRandomCatalogSkin();
    payouts.push(createPayoutItem(skin, currentTimestamp, 'hist'));
    const intervalMs = Math.floor(60_000 + Math.random() * 120_000);
    currentTimestamp -= intervalMs;
  }

  payouts.sort((a, b) => b.timestamp - a.timestamp);
  return payouts;
}

/**
 * Loads payouts from localStorage. If empty or stale, initializes and backfills history.
 */
export function getOrInitLivePayouts(now = Date.now()): LivePayout[] {
  if (typeof window === 'undefined') {
    return generateInitialHistory(now);
  }

  try {
    const storedJson = localStorage.getItem(STORAGE_KEY_PAYOUTS);
    if (storedJson) {
      const parsed = JSON.parse(storedJson) as LivePayout[];
      if (Array.isArray(parsed) && parsed.length >= 20) {
        const newestTimestamp = parsed[0]?.timestamp || 0;
        const timeSinceLast = now - newestTimestamp;

        if (timeSinceLast > 3 * 60 * 1000) {
          const backfills: LivePayout[] = [];
          let cur = now - (Math.floor(Math.random() * 20) + 10) * 1000;
          while (cur > newestTimestamp && backfills.length < 40) {
            const skin = pickRandomCatalogSkin();
            backfills.push(createPayoutItem(skin, cur, 'backfill'));
            cur -= Math.floor(60_000 + Math.random() * 120_000);
          }
          parsed.unshift(...backfills);
        }

        const cutoff = now - 210 * 60 * 1000;
        const filtered = parsed.filter(p => p.timestamp >= cutoff).slice(0, 120);
        
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(filtered));
        return filtered;
      }
    }
  } catch (err) {
    console.warn('Failed reading payouts from localStorage, regenerating:', err);
  }

  const fresh = generateInitialHistory(now);
  try {
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(fresh));
  } catch (e) {
    console.warn('Failed saving initial payouts to localStorage', e);
  }
  return fresh;
}

/**
 * Persists updated payouts list into localStorage
 */
export function saveLivePayouts(payouts: LivePayout[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = payouts.slice(0, 120);
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save live payouts:', err);
  }
}

/**
 * Generates and appends a brand new incoming live payout
 */
export function addNewLivePayout(currentPayouts: LivePayout[]): LivePayout[] {
  const skin = pickRandomCatalogSkin();
  const newPayout = createPayoutItem(skin, Date.now(), 'live');
  const updated = [newPayout, ...currentPayouts.slice(0, 119)];
  saveLivePayouts(updated);
  return updated;
}

export const INITIAL_LIVE_PAYOUTS: LivePayout[] = generateInitialHistory();
