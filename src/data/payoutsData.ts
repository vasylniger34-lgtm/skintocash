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
 * 100% Verified Working CS2 Item Catalog with 151 unique items:
 * - Budget (< $10): Cases, common skins, drops, stickers ($0.30 - $5)
 * - Mid-tier ($10 - $95): Playskins ($10 - $90)
 * - High-tier ($100 - $700): Printstreams, Vulcans, Knives ($100 - $700)
 * - Grails ($1,000+): Howl, Dragon Lore, Gungnir, Doppler Knives, Gloves ($1000 - $65000)
 */
export const DIVERSE_SKINS_CATALOG: CatalogSkinItem[] = [
  {
    "weapon": "Case",
    "skinName": "Dreams & Nightmares Case",
    "wear": "-",
    "amount": 0.95,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Fracture Case",
    "wear": "-",
    "amount": 0.58,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3QV7aD7OP01IfbGDzPCmbsm4LU5GnvkzUsi4WvUmIqtci_CPQNyApsjE_lK7EfrhW545A",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Recoil Case",
    "wear": "-",
    "amount": 0.43,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnMVu6b-avA-JqSSCjSWwuhz47U9TCzlxh9yt2WGnNqgIi-fbgUkWMNxFPlK7EdIJF6a2Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Revolution Case",
    "wear": "-",
    "amount": 0.62,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnAVvfb6aqduc_TFVjTCxbx05OU4S3jilE9w4DzRnImtIy2Sa1JzDJEhRPlK7EcO4U8gfA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Kilowatt Case",
    "wear": "-",
    "amount": 1.85,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnEVvqf_a6VoIfGSXz7Hlbwg57QwSS_mxhl15jiGyN37c3_GZw91W8BwRflK7EfKsa2sfw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Snakebite Case",
    "wear": "-",
    "amount": 0.28,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3oVvvT4bfI4dvTLCGTCmLl16ec7TX_mk08k42iHwtqscy-WPVUmCZJ4R_lK7Ed8Q6OYtw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Clutch Case",
    "wear": "-",
    "amount": 0.48,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHsVtqr8a_dsdKTAWDWVxLgjsrAwHSvgwEQk4m-ByYuqIC2eO1VyD5QiR_lK7EcxQQPYQA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Prisma Case",
    "wear": "-",
    "amount": 0.25,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3AV6aD8O6BpdKKQVmPEwr1zs-c8Tnngl09w52zTmY2sc3jBag8jXpohE_lK7Ede7E2Kfw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Prisma 2 Case",
    "wear": "-",
    "amount": 0.31,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3cV6vT9avBvefWWDDGTxbZ14rhsTX7qkE90sDiHwt2pdC-TblJ2DsB1QPlK7Ee9riHKAA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Danger Zone Case",
    "wear": "-",
    "amount": 0.57,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3MVv_H4a6FucPPBWjDIkbdz4rg4Syyyxxsi5mzRntuvJCqVbwAgDZBwRPlK7EcZJ5GkQA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Horizon Case",
    "wear": "-",
    "amount": 0.36,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3IV6vSrbfw8eaiWCjWVkewgseM9TXyxl0wi6mSHn9-tIHqUbg5yDpEmEPlK7EcXFmSLsw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Spectrum Case",
    "wear": "-",
    "amount": 0.54,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHQV7qCra_JscqPGCzLCl78ktuAxHSzmzUh_sjvWzdqoI33CaQF2DscjR_lK7EeF3oM7TA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Spectrum 2 Case",
    "wear": "-",
    "amount": 0.49,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHoVu6D7PaA0JaDACjKUwOom47VrTSzrw0Vx4W_Sydz9JC7FZgckCZYjRPlK7EcPuDAQzw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Glove Case",
    "wear": "-",
    "amount": 6.8,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHcVuPaoafU1JqiVWWSVkux15OQ8Giiylk0k5mvTnIqpd3PCaQIhWMYkE_lK7EcNeCKW-w",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Gamma Case",
    "wear": "-",
    "amount": 0.58,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHEVtvP5bPZrd6XECmOSxe0v4bRoTnnjwBkitWrRm4yoeX3GagMnCZZ2FPlK7EcEv22BnQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Gamma 2 Case",
    "wear": "-",
    "amount": 0.38,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bjz61TqQCKj0JfipHMN7aX2bfM9eaPDXT7Glbx1s7Y8HHHnw0sltWXSmYmqcH-UaAU-Sswn_16VNj0",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Chroma 3 Case",
    "wear": "-",
    "amount": 0.33,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHAVuKf7PaJucPLHW2TExb9z4OdvHirixEomtW7cyduvci2VZ1AiCsR2Q_lK7EdW_VBhrw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Operation Bravo Case",
    "wear": "-",
    "amount": 48,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj7-lz1QAn4kZjf9CsVuvf7OfQ5IabBVzbHlb915bcwHCjikEp_sTnTn4z6eH6RblQlC8RwFPlK7EdXSP0Ibg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Case",
    "skinName": "CS:GO Weapon Case",
    "wear": "-",
    "amount": 85,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bji61XxRCKg0MSz_nUDvPb-OPFvdKTFDzbAkbp16bY5Gn6wkx9ysj7Xntf9IC6WZgA-Sswnnj45WXo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Case",
    "skinName": "Huntsman Weapon Case",
    "wear": "-",
    "amount": 9.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frmxY6qr9OqU0cvbKCGTDk7dys7k-S36yzU114GrRmNaoeSmXaVV0WJp0W6dU5Q_KKWwm",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Case",
    "skinName": "Winter Offensive Weapon Case",
    "wear": "-",
    "amount": 9.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frGxZvqX4avxuIabDXDPJxb534uQ-TH-3wk8isGqByIuoIHKRbQRyXpJ2W6dU5a9fuS_R",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AK-47",
    "skinName": "Safari Mesh",
    "wear": "FT",
    "baseFloat": 0.224,
    "amount": 0.45,
    "rarityColor": "#5e98d9",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wjFL0P-re6xSNPGdMWuZxuZi_rIxSirkkElyt2qEzI2heXiTaVIiX5siROQJtxnul4XnYbvgswOMgolbjXKpnRk9Yjk",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AK-47",
    "skinName": "Uncharted",
    "wear": "FT",
    "baseFloat": 0.198,
    "amount": 0.92,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeqHC2SvzedxuPUnFnCwwBl_5D_Syon8dnyUaQUlD5oiQ7ECuxW7l920ZL-w4AfX2IlByTK-0H0PRM7cOA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AK-47",
    "skinName": "Elite Build",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 1.85,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSLfGAGmKC2NF6ueZhW2e2wh9y5GjTztirdSqfP1dyCpclR7FZ5xe9wNbhZei25FGPjokXxC2vkGoXuQLr5jvs",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A4",
    "skinName": "Magnesium",
    "wear": "MW",
    "baseFloat": 0.092,
    "amount": 0.55,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSI_icHneV09FxuO56Wxa_nBovp3OAzo2vdHPFPFUmCJRxRbNZ4xewx9W1Nb7j4gzXg99Ayy73iC1Aun1q_a9cBiEfMG3G",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A4",
    "skinName": "Evil Daimyo",
    "wear": "FT",
    "baseFloat": 0.194,
    "amount": 3.4,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSJeaaAliUwOd7qe5WQyC0nQlp4GqGz42ucCqXaQMhDpd4R-AIsxK6ktXgZePltVPXitoRn3-tjCgd6zErvbijVJZd2Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A4",
    "skinName": "Griffin",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 2.8,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSJ-KaCGGZz9F6ueZhW2e2zERysm3Umdesd3rGald1DpRyQLVbtUa5mtPvYuzrtATeg95EmS2vkGoXuZ5UWeP5",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A4",
    "skinName": "Spider Lily",
    "wear": "FT",
    "baseFloat": 0.185,
    "amount": 4.2,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6V6JhL-eWHHSvzedxuPUnHXiwlk4lsTvUz477ICiRPw52WJNxROICtxK-wYDhZejm5gCP2I9MzjK-0H1trtkVHA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Night Terror",
    "wear": "FT",
    "baseFloat": 0.218,
    "amount": 1.65,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9lj-hnXCa-mxQmjDGMnYftby3FPFVxA5ZwRecOtUXuxtPiNL_jsQLc2NkTzS38jC5L7ydj5u8EUKo7uvqAgGSM4LM",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Flashback",
    "wear": "FT",
    "baseFloat": 0.19,
    "amount": 2.1,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9Jtu1oXCGxlB4sjDGMnYftb3yVPQFyDMB3EbJZ5xC4kNPvMOO35AHW3d1AnC_3iHlNuytqtuYDVfI7uvqAZWXE-YM",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Nitro",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 3.8,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H-OcMWiCwOBxtd5oTCq2mwk0jDGMnYftb3nFaVQgApQiQuEOukS-x4KxP-PjsQOLjt9HzS6t2CpB6C0_4LxWBaA7uvqANEieesU",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "Pit Viper",
    "wear": "FT",
    "baseFloat": 0.245,
    "amount": 0.95,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk_PyvY6F-K_mdMWuZxuZi_rQ_GS3mxRwk4jvTyNv6eC-RPQV1W5AlTOZb4xLtw9fuNriw51Hd3otbjXKp4cSTTIs",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "Capillary",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 1.2,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JoKf6sAm6Xyfo44bE5HSrmlx5z4GTUzt__I3yebQAgA8R3FuFfsBTqx9W2Y7vq5lbfjZUFk3ugIlCuqg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "Mortis",
    "wear": "FT",
    "baseFloat": 0.174,
    "amount": 3.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6BoIeSbMWuZxuZi_rNtHiuwwRwismWEnNn8JymSZgUiDpd3Ru9ZsxG-xNy2NLzn41DWg41bjXKp5oOAt0A",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "Worm God",
    "wear": "FT",
    "baseFloat": 0.185,
    "amount": 2.1,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_DNk7uW-V7B6Kf6WMWuZxuZi_uRoGH3iw0wh4j7cnt6ucSqSZwUkCMB5TLIPsES_kNbuYeOwtgXai4NbjXKpZ4kj0o0",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "PAW",
    "wear": "FT",
    "baseFloat": 0.192,
    "amount": 2.85,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_C9k7uW-V7RsN-CSGVicyOl-pK84Tn-3xkgltWWGnI39c3LDaA4lD5V0QO8It0LqktfuMOrq7gDajYJG02yg2bUm5WIV",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AWP",
    "skinName": "Exoskeleton",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 3.2,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6F1L-OYC2uV1eF4j-1gSCGn20km5zyEmd2qc3uWZwcnA5MiELIJtxa_w9OyN-nh5wKKj4kTyn78hyNXrnE83OTew2I",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "High Beam",
    "wear": "FN",
    "baseFloat": 0.021,
    "amount": 1.15,
    "rarityColor": "#5e98d9",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s24bbZ5KfecMWWc1OtJvOhuRz39zU5yt2vQntn9dC3Dbw8iDJQhF-IJ5xDqkdSxMr6251aMiI5BynqtiTQJsHhqpMNExQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Bunsen Burner",
    "wear": "FT",
    "baseFloat": 0.231,
    "amount": 0.4,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a_s2pZKtuK6HLMWGcwONzo95rQzy2qhEutDWR1Nb7IC-TOw4hCZF5FOJe40W5lILlZLvktAHXiIJMyST_3XlIv3k94escEf1yWue1sjU",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Clear Polymer",
    "wear": "MW",
    "baseFloat": 0.091,
    "amount": 0.85,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1c_M2pZKtuK8-DAWuJzOtkj-1gSCGn200h4TnQwtqoci_CPQYlDsAiRuZc5hK7kd2zZbm37lGK2o5HnH2v2ixXrnE85Jt4rDY",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Candy Apple",
    "wear": "FN",
    "baseFloat": 0.032,
    "amount": 0.95,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1I4M28baBSLPmUBnPelb93teA-FivjzB5wsjzTyI2pIn_CPAMoW8N3ROJZshm5w9zgNbnk5xue1dyMA9ZU_Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Winterized",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 0.35,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1c_M2pZKtuK8-WAm6ExNF1sexmcCW6khUz_W6Azdn6eCrBalcjXJpzE7EO5xa_l4DuNu6ws1Hb2IgUn32si39B5y11o7FVC5qcAFg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Vogue",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 4.8,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "USP-S",
    "skinName": "Cortex",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 3.6,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "USP-S",
    "skinName": "Ticket to Hell",
    "wear": "FT",
    "baseFloat": 0.185,
    "amount": 0.75,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_vp5j-lsQyWMmRQguynLzt_8JXiVOwF2AsF4R-ECshftltKxZe6x41CKjotExST8jn8f7ilr5PFCD_TZVvgG5g",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "USP-S",
    "skinName": "Cyrex",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 2.8,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1vouRxcCW6khUz_TjdzdmsJyiTZg8kX8N4ELUP5EPsw9G1YeLn5VTXjY0WxS6rhiIYuCd1o7FV2N83Spg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "USP-S",
    "skinName": "Flashback",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 0.95,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uh6sfJhTSiwniIrujqNjsH6dnKfbAdxAsF3ELQCu0Hsmty1N76z71GIit4RySX_2CJI6yk9tucLT-N7rUYlhjC0",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "USP-S",
    "skinName": "Guardian",
    "wear": "FN",
    "baseFloat": 0.035,
    "amount": 3.2,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_ut6teZoQT2MmRQguynLyd76I32fbFUkD5EmRu4Ct0O4m9fmY-zlsQSMiN9CnHj2jitL531o4fFCD_TZrkjVNw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Oxide Blaze",
    "wear": "FN",
    "baseFloat": 0.034,
    "amount": 0.85,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKF-JeKHMWKRxuJzj-JmXTu8kRgpjDGMnYftb32UPwJxDJokRuUIsRi_lNPhM7izsgXZi49GySiq2nxNuCdttbtUB_A7uvqAjSk2l_c",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Light Rail",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 2.9,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWKIztF6ueZhW2fhlhlw6m-GnNyvIiiXOwQoDMR2QbZe5hi5k9KxN-vhtFbciN1FnyqskGoXuU4JtHUo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Corinthian",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 0.45,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7uORbKFsJ_yWMWSf0-d4pOlgTieMmRQguynLzNz4Iy2ebgUmDZB4QeEDskO5ktWzMrjm7wPd2IlGmCr_3XxBuClr4PFCD_To4zX47g",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Blue Ply",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 0.65,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ_yWMXWV0eJ_s-BWQyC0nQlpsjzdwtqgIHqfZgAgDZBwROBbtRDsm4HiM7zislfYitpBniz6iy5K7DErvbjLUTqBnA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Naga",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 1.85,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7uORbKFsJ_yWMWmRxu9JvOhuRz39zEx06jjWm4n8Ii6WPFQhA5YjE7MJskPrwdTuZb7htlHbg9oTzCn2hjQJsHhQd9ynBw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "P250",
    "skinName": "Valence",
    "wear": "FN",
    "baseFloat": 0.019,
    "amount": 0.85,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiNK0OL8PfRSI_-dGmiF09F6ueZhW2fiwUx14zmDnNagcC-WagUkApslQuBYsUW_ktexPry3swPfiogTyyiqkGoXuQius2mt",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "P250",
    "skinName": "Supernova",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 1.4,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0PCnfLBoMuOEC2KE_uJ_t-l9AXzlwk5zsGnWz46uICjCPAZ2CZF0QO8LtBjtkNaxZrji7wbY2tkUySXgznQe4Iqu8Lg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "P250",
    "skinName": "Ripple",
    "wear": "MW",
    "baseFloat": 0.092,
    "amount": 0.55,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiNW0OL8PfRSM-CGGmmZytF6ueZhW2fnlht-5juGyY2vIC2SalQjX8Z1RbVesUG4m9XlN-_ntQPa3YNBn332kGoXubXJFvZo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "P250",
    "skinName": "Cassette",
    "wear": "FT",
    "baseFloat": 0.22,
    "amount": 0.35,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI_GAHWKE1etJvOhuRz39lkwltT7Ww4ugc3PGOwd0DpQkQbUPshbpm93lMuy25QGIjIwUn3_72DQJsHjyHnRH0Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "MP9",
    "skinName": "Starlight Protector",
    "wear": "FT",
    "baseFloat": 0.22,
    "amount": 4.5,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "MP9",
    "skinName": "Mount Fuji",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 3.2,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f_CNk4uL3V6J4KvmsHm6eytF6ueZhW2fgkUoh5m7dnt78eC7FPFQgXJByE-AL5Bixld20MO2x51DX2o1NxCyokGoXudOiZ_SY",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "MP9",
    "skinName": "Ruby Poison Dart",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 1.8,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f_C9k4uL3V6pkNOKcCWKe_uJ_t-l9AXzhkEsm527Xy9r_JynEP1IiWJZ3FOYP4xTqmtznNO-34VCKiYJExSjgznQeVzj6siQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "MAC-10",
    "skinName": "Ensnared",
    "wear": "FN",
    "baseFloat": 0.024,
    "amount": 0.65,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-DB3-ZxNF6ueZhW2fikB935ziGztj7JHyQbgIkWZsmFrJY4xTpwdOzP-Oz7laNj4lFyy2tkGoXudbL5uIf",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "MAC-10",
    "skinName": "Disco Tech",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 3.8,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF6ueZhW2frkR5z4m_SyY37cnKRblIpW5smQOcO4EW7lYa1ZOjgtFCLg4wXnn72kGoXuTa4h8QB",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "SSG 08",
    "skinName": "Mainframe 001",
    "wear": "MW",
    "baseFloat": 0.092,
    "amount": 0.45,
    "rarityColor": "#4b69ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1Y-s29e6M9eM-eD26ex_x3veRWQyC0nQlptzjSntqgJS6Wbg5xDZVwTbUN5EO5ldWxYem04waP2IsUyX_5in4c6zErvbh54g-58w",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "SSG 08",
    "skinName": "Fever Dream",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 1.65,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1Y-s29e6M9eM-VC3GV09FyouRoQha_nBovp3PTmYmqJHmeb1N1CpJyFOZftkO8x9ezNOOztg2MjYwRyyWsjn4d7n1q_a9cBq7gpQcW",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "Galil AR",
    "skinName": "Signal",
    "wear": "FN",
    "baseFloat": 0.025,
    "amount": 1.2,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "FAMAS",
    "skinName": "ZX Spectron",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 1.95,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1Y-s2oaalsM8-AHmKT1fx5vt5lRi67gVNxsDvTyNyueHOeaVVzCcN1EbVZtRK5k4LkNOnj4wbe2tlMxH_-jyNN8G81tGqq3pxL",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "budget"
  },
  {
    "weapon": "AK-47",
    "skinName": "Redline",
    "wear": "FT",
    "baseFloat": 0.178,
    "amount": 18.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Slate",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 12,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSMOKcCGKD0ud5vuBlcCW6khUz_W3Sytb4cCqTOFUpWJtzTOUD5hPsw9a0Yrnrs1SK3ooXzy6shilM5311o7FVYrIufmI",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "The Empress",
    "wear": "FT",
    "baseFloat": 0.221,
    "amount": 38,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSJf2DHGKD0tF6ueZhW2exxEt152rWzI7_Ii-Ubw90DMB0Ee4C5xOwx9GxZbjk71PXgogWn36tkGoXudZeYvlo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Frontside Misty",
    "wear": "FT",
    "baseFloat": 0.189,
    "amount": 17.2,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSN_mdGmKC_v1mv_N9cCW6khUz_WvRm9r8JS-SaFMmWcN5ReMD4BDsltDkN-Prs1DfjN9Cn3r_jC4YvHl1o7FVgJsyBlQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Legion of Anubis",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 14.8,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf6GDG6D_uJ_t-l9AX_nzBhw4TvWwo6udC2QbgZyWcN2RuMP4xHrlYDnYezm7geP3d5FyH3gznQeY_Oe4QY",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Point Disarray",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 19.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSMP-aAHOvxedlsfN7TjCMmRQguynLnIz_dXnEbFcoDsNzQLMN40S7mte0Zuzl5gbY34JEnnr52ChA7ytisPFCD_Rw7udDlA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Neon Revolution",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 26,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf6SHGSY2NF6ueZhW2e3w0524mjQzomreXqVbAAhWJF3RuZfuxC5x920Yurh7gONjY0RxHr4kGoXuT5bpI-V",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AK-47",
    "skinName": "Cartel",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 16,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNK0POlPPNSI_GBGmKc_uJ_t-l9ASuywktwtW3dwt79eX6fZlUiCJJ1RbUPtkW8w4LiZe_i4ATYjN8WmH7gznQeZkk4ehM",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "Desolate Space",
    "wear": "MW",
    "baseFloat": 0.081,
    "amount": 24,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSJPWAAWuR1etJo_FoTCyMmRQguynLnNepJXPEaQJyDZJ0QOdbsxi7ktS0Y-Li4ADegthGn32ojCJJ7CxosfFCD_SyjfEkHg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "Temukau",
    "wear": "FT",
    "baseFloat": 0.201,
    "amount": 34,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSNPWeG2yR1NF6ueZhW2ewlBtx5W6AmYv9JS6XaAV1CJEmTeUL4UTpxNzjZO3jtgaIjN9ExCuskGoXuRnyRhBA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "Neo-Noir",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 16.5,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLvWcMWmfyPxJvOhuRz39wE1142vSztmvInvBOgV0W5R1FLYNuxW4wIbgNrmx4g2Kj4tMmCX93zQJsHgJr0dqFw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "The Emperor",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 42,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSJf2DC3Wf09F6ueZhW2exwBh_6m3dnt36InjDPQ4oXJt1TbJeshW_mtfjN-vrsgaKiokWy333kGoXuRj4z9Nd",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "Hellfire",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 48,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSKPWfAmGZ0-tJvOhuRz39zEp24GTXmImsInqWP1AkXpBwE7FetUTswdfkPu7h5QXXithBy32t2DQJsHhDPmtuAA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A4",
    "skinName": "Buzz Kill",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 21,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSM_WQGmiC_uJ_t-l9AX22kBh0tm3Qn92qdS7GPARyW5t0QLQD4xi6w9XkZe3jsgDW3ogUnH3gznQeqfpfmso",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Hyper Beast",
    "wear": "FT",
    "baseFloat": 0.219,
    "amount": 28,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9JuPh5SjuMlxgmoCm6lob-KT-JbwF1WZEjR-YJskK9k9XiYePltAeNjYlAxSn5j34dvCZstb4LB6Ut-7qX0V8Xkv5_2A",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Decimator",
    "wear": "MW",
    "baseFloat": 0.078,
    "amount": 19.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Player Two",
    "wear": "FT",
    "baseFloat": 0.205,
    "amount": 26,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj-J6SCbhxUl_jDGMnYftby7BbVdyCsB0EeZY4RPukNfhZOO2sQ3W398Qy3_6jHxIunptsO9TUqs7uvqAAWrfZoM",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Chantico's Fire",
    "wear": "FT",
    "baseFloat": 0.198,
    "amount": 36,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_JmWiWnlBYioQKJk4jxNWXFZ1IgC5MiQuZeuhK4wIXnMuPhslCM2oMTxH75hnxK6Htjse4BVqd25OSJ2DU2Q_CD",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Golden Coil",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 45,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9lj_JnTiK2lxQztgKClYP9HifOOV5kFJclQ-Jb5xW-m9CxPuLq4QTfjd0XzyX6jCpL6X5o5OgDVfYn_a2Ci1rfcepqgV49FrE",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AWP",
    "skinName": "Atheris",
    "wear": "FN",
    "baseFloat": 0.018,
    "amount": 14.5,
    "rarityColor": "#8847ff",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMPWBMWuZxuZi_rZsS3zgzU8isW3dnIr6eHKfPVAhDpojEe9YsUW4xta1Nuzm5FDci4NbjXKpmWVQppo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AWP",
    "skinName": "Neo-Noir",
    "wear": "MW",
    "baseFloat": 0.091,
    "amount": 36,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AWP",
    "skinName": "Wildfire",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 58,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7NkLPSVB3WV_uJ_t-l9AX7rxhl-tmzSwomtdC6TPwQnW5UkR-YD5kK-ltCzP-Ox4FfXiNoQyyrgznQeu9L0PzQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AWP",
    "skinName": "Hyper Beast",
    "wear": "FT",
    "baseFloat": 0.205,
    "amount": 32,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6x0MPWBMWWVwP1ij-1gSCGn20pxtm_WzNuoeHKeaFAnCZUiTe5bt0HqxofmZOrm5Q2IjoMQzS_5iShXrnE8NzWs__c",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "AWP",
    "skinName": "Electric Hive",
    "wear": "FN",
    "baseFloat": 0.032,
    "amount": 65,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk5_u4bZthKfebGinElLtytLVtG362x05wsWyByt2scHrGOgd1WZJ1ROBc4xi_ld3gNO7g-UWA3Kwc2RVq",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Water Elemental",
    "wear": "MW",
    "baseFloat": 0.082,
    "amount": 11.5,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK72fB3aFxP11te99cCW6khUz_TjVyompc3-QOFR2DJQkFOMJtBbqk9LlY-7n5QLZjtkTxCWqhixPv311o7FVIf8eASQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Bullet Queen",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 18,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK6HLMXCR0-N3ueVsQRa_nBovp3PQydf4dXuSalUgCJZwRrILthi9kYDlMe_m4g2Ij90Um3moiXkc6SZj_a9cBgLxwlYC",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Glock-18",
    "skinName": "Neo-Noir",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 22,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-dAW6C_uJ_t-l9AXznwh9zsjjSn9j9dH-eb1V0CsF3QrNZ4xW8ltPlM-7h4QbYit5NzyzgznQecekkTuo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "USP-S",
    "skinName": "Kill Confirmed",
    "wear": "FT",
    "baseFloat": 0.224,
    "amount": 49,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "USP-S",
    "skinName": "Neo-Noir",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 26,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA0tF4v-h7cCW6khUz_WXdmd-vI3uRPwEkApR4QuBcu0Xrk4biYr_mtQXdidlCz3r63Ska7Hx1o7FVWuokIcU",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "USP-S",
    "skinName": "Printstream",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 65,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_v5kue99XD2hkBwqjDGMnYftb3yUPFR0XsNyRrNc5kO5ltziMenr5lONj4kXyi2riywc7y9o5LtQAqQ7uvqAkScWnv4",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "USP-S",
    "skinName": "Monster Mashup",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 21,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uVkv-pmXBa_nBovp3PQn46ueX3FbAB0WZMjTe9csEKwk9XvNbnl41Tcj48WzHqv3HhP5ydj_a9cBuLIfNg1",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Code Red",
    "wear": "FT",
    "baseFloat": 0.198,
    "amount": 29,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWaXxvxzo_JmXRa_nBovp3PRmNj4c3mTb1RxC5cjF-EItRnrlNzkYrnk5gaI3Y0UmyX52H9K7ixs_a9cBsGEcOCn",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Mecha Industries",
    "wear": "FN",
    "baseFloat": 0.025,
    "amount": 14,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Kumicho Dragon",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 24,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7uORbKF-JeKHC2aXzetJu_RkRiq7mhk1sjqKlLD1KCzPKhh0CcBwQLVe5BHrloKyZOnr5w3XiYhDnC39iCpK7X1psrlUWaFw8qXekUifZlV_fDVZ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Ocean Drive",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 38,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ_yWMWyZ1e1-j-1gSCGn2x5-sG7Wzdyvc3OSbgcnXpR5FO9bukTtm9WzMePhswaN2N5CmCj_jyhXrnE8ibjhEyc",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Gut Knife",
    "skinName": "Rust Coat",
    "wear": "BS",
    "baseFloat": 0.612,
    "amount": 85,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c-uaRabVSM-SWC2uvyuB_tuRWQiy3nAgq_WvTnNr4cnqfPQEpDZB1ReBftEG_kde2P-zl4gzciYsXzC2o2Hgd7n11o7FVh370TBM",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Gut Knife",
    "skinName": "Freehand",
    "wear": "FT",
    "baseFloat": 0.205,
    "amount": 92,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c-uaRaalSLfGBBWKU_vtmj-1gSCGn20tw6jndyNmoIn3FbAQoCMEkTOYJsRTql4fkPriw5gyIjoxAyCj9hy1XrnE8qMFnbCI",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Navaja Knife",
    "skinName": "Blue Steel",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 88,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c9uK9cZtnIfOYBWmZx-tJsfBWTSWmkBkYvzSCkpu3JCqUaFIjCpV4ReAD50S9w4bgZO7h4Vba399DmC36jHlI6yo_tr0LB71lpPNA0Lycxg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Shadow Daggers",
    "skinName": "Rust Coat",
    "wear": "BS",
    "baseFloat": 0.585,
    "amount": 79,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1L-uGmV6V8H-OHC2Kc_uV4uedscCS2kRQyvnPQzdn6dSiUbw4jX8MmROdbskHpwde2Yu-x4VGKiYtBni__hisf63ti_a9cBjfCVlsL",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "mid"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Printstream",
    "wear": "MW",
    "baseFloat": 0.075,
    "amount": 115,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Desert Eagle",
    "skinName": "Fennec Fox",
    "wear": "MW",
    "baseFloat": 0.085,
    "amount": 240,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWGVz-Bzs95lRi67gVN14GvRyt77cnKfagRyXsMiTeUNtRO5kYWyYr7i4lfZgoIUzX722CpO8G81tMpbNfMB",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AWP",
    "skinName": "Asiimov",
    "wear": "FT",
    "baseFloat": 0.245,
    "amount": 165,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AWP",
    "skinName": "Lightning Strike",
    "wear": "FN",
    "baseFloat": 0.009,
    "amount": 620,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_C9k4_upYLBjKf6UMWaH0dF6ueZhW2frwU1_sW2EmNyvc32RZwMpCpcjQ-EJ4xbtmt3gYezk4wzb3tpAy3mrkGoXubsGIfVN",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AWP",
    "skinName": "Oni Taiji",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 420,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6xsLv6KD1icyOl-pK9vGCqwkx524G_WnNmsInyXOAVyXJJ0TbNb5EOxxIflYbzj4gDdiNlC02yg2XaKgrAq",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AWP",
    "skinName": "Containment Breach",
    "wear": "MW",
    "baseFloat": 0.088,
    "amount": 195,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMuWAMWuZxuZi_rQ6SXq1xURysj_Vw4uhJHOVPQ8oCZt4QrRbtRi6ldPlPu_g4FHaiYNbjXKpcPI_17A",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AK-47",
    "skinName": "Vulcan",
    "wear": "FT",
    "baseFloat": 0.192,
    "amount": 265,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSMuWRDGKC_uJ_t-l9AXCxxEh14zjTztivci2ePQZ2W8NzTecD4BKwloLiYeqxtAOIj9gUyyngznQeF7I6QE8",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AK-47",
    "skinName": "Bloodsport",
    "wear": "FN",
    "baseFloat": 0.032,
    "amount": 145,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSIvycAWOD0eFkpN5lRi67gVN15mmDw9egci_EPFAkDMQlTeZe4EXplNa0Yrvr5wbd345GyHioiC4b8G81tFuqg_k_",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AK-47",
    "skinName": "Case Hardened",
    "wear": "MW",
    "baseFloat": 0.089,
    "amount": 350,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNK0P2nZKFpH_yaCW-Ej7sk5bE8Sn-2lEpz4zndzoyvdHuUPwFzWZYiE7EK4Bi4k9TlY-y24FbAy9USGSiZd5Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "AK-47",
    "skinName": "Fuel Injector",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 280,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSM-WDC3WTye9kt-RtcCW6khUz_WuGy9_8dHuRbg5xW5IjQ-BYshK9mta0NLmw4lDa2o0Wni_3iy4f6np1o7FVB0pWHHg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Printstream",
    "wear": "FN",
    "baseFloat": 0.015,
    "amount": 495,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_F7Rienhgk1tjyIpYPwJiPTcAAoCpsiEO5ZsUbpm9C2Zuni4VHW3o5EzSX62HxP7Sg96-hWVqYi_6TJz1aW0nxrkGs",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "M4A1-S",
    "skinName": "Blue Phosphor",
    "wear": "FN",
    "baseFloat": 0.012,
    "amount": 680,
    "rarityColor": "#d32ce6",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMWrEwL9lj-NlWiygmBIstgKJk4jxNWWeOg5xDJR2Q-5b5BGwxIDuP7uw4ALa3ohMz3n3iypLvyc55-pQUKct5OSJ2OKlF5Nn",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Flip Knife",
    "skinName": "Tiger Tooth",
    "wear": "FN",
    "baseFloat": 0.014,
    "amount": 320,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d4_u-V6VjH-SaCWKC_uFkse9uSha_nBovp3OBztqpI3yTbAIgDZslQbFbtUbuw9y2Y7y37gDcjooQxH__h39B5yxt_a9cBoXwL4KP",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Bowie Knife",
    "skinName": "Fade",
    "wear": "FN",
    "baseFloat": 0.018,
    "amount": 390,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-uC4YbJsLM-RAXCZxNF3sd5vTi22qhEutDWR1NiocCqeZwYoC5pxRuMM5BPqxtTgY-20sgXZ2NpHnyqqiCpA5nk56u8cEf1y_UmCvro",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Huntsman Knife",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.015,
    "amount": 360,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1P7vG6YadsLM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuE7UDuhC-mtbnNb-xtFfZ3YtGzSv6hisauns-5b5WVqIgqKDfjwjEYKp9v8eb6jzRvA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Shadow Daggers",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.012,
    "amount": 185,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1L-uGmV6VgH_KfD2Sb0et3ou1WQiihlxEiuieAnrD7HifOOV5kFJZ2TbMNtES-xobhY-rj4lTd39gRny_2jiIf6C5u67oHBasm-PXRjADfcepqXuISEy4",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Falchion Knife",
    "skinName": "Marble Fade",
    "wear": "FN",
    "baseFloat": 0.021,
    "amount": 285,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1d7v6tYK1iLs-SA1idwPx0vORWSSi3kCIrujqNjsGqdXrFbFIlA8QjTO8Lu0O7m921ZLy05gfXj99Aziz_2nscuic6sr4AT-N7rSTjmXt5",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Survival Knife",
    "skinName": "Fade",
    "wear": "FN",
    "baseFloat": 0.019,
    "amount": 340,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Y7vyne5tsIc-VD2OV_uJ_t-l9AXuwwBh0sT-BydarInPGPQUpCMcjELJY5xm4xIG0NLy241Dag9hNzirgznQeOQeAleU",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Ursus Knife",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.016,
    "amount": 380,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1O_eG7e5tsLc-RAmaTyv5zsfNlcCSyhx8rtjSfn4vGLSLANkI-C5IiRrQN5BaxktbgNOrksVOPj9gRnin-jS8fvX4_6-kAAqNx8vLQiRaBb-PCt4gg5w",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Nomad Knife",
    "skinName": "Crimson Web",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 460,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1U-uaqZ6t_H_iKMXCVw_1JvOhuRz39xEV_sT6Bn9mueX3EP1QjApd4QbZe5EW6wIDmNO7islfW391EzCWt3TQJsHib9FqZhg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Stiletto Knife",
    "skinName": "Tiger Tooth",
    "wear": "FN",
    "baseFloat": 0.018,
    "amount": 540,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-_uibbB5L8-SAFiEyOlzot5mXSi9khgYvzSCkpu3JyjBawQkXsF0EeEO4Ea_m93iNLjk71PfjtlDxSms3S1M7yhj47wLA71lpPOYHm96Lg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Specialist Gloves",
    "skinName": "Crimson Web",
    "wear": "FT",
    "baseFloat": 0.22,
    "amount": 280,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJp-RrXBahkBkYvzSCkpu3JyiSbAQkC8d1E7YJtEXtkIazMruz4lOP3dpGmCyt23hA731v4LkKAL1lpPOyoS0Ibw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Driver Gloves",
    "skinName": "King Snake",
    "wear": "FT",
    "baseFloat": 0.24,
    "amount": 420,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5T441rsfhr9kYDl7h1I4_utY5t-LvGYC3SbyOBJp-lgWyyMmRQguynLz4r6Iy7EbFchApNyR-dbtEbuw4XkN7jq7gHdjtoQzi37hiwYvytvt_FCD_Ql24JgJg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "Specialist Gloves",
    "skinName": "Foundation",
    "wear": "FT",
    "baseFloat": 0.23,
    "amount": 310,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJv_NoQS62qgovuimApYPwJiPTcFMgWJVwFLIPthDpkt3vN7ux5QTWitkTm3r5iiMc7nw6sukBBfV38vDJz1aWnrr9eTA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  },
  {
    "weapon": "★ Karambit",
    "skinName": "Gamma Doppler",
    "wear": "FN",
    "baseFloat": 0.0084,
    "amount": 3450,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Karambit",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.015,
    "amount": 1850,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Karambit",
    "skinName": "Fade",
    "wear": "FN",
    "baseFloat": 0.012,
    "amount": 2350,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Butterfly Knife",
    "skinName": "Fade",
    "wear": "FN",
    "baseFloat": 0.0118,
    "amount": 2890,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Butterfly Knife",
    "skinName": "Gamma Doppler",
    "wear": "FN",
    "baseFloat": 0.009,
    "amount": 3200,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxONzouBlSxa-lA8lvziMgIr9HifOOV5kFJp2Ee9b4Rntm4GxY7_ntQHc2o1DmH6r3Hgcv3w4t-pXU6ZzrPHQjQnfcepq0dwfRJw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ M9 Bayonet",
    "skinName": "Fade",
    "wear": "FN",
    "baseFloat": 0.015,
    "amount": 1950,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWaR_uh3tORWQyC0nQlp4znQytr6cnjFbg8oC8BzRrQK50S-lNDgP-_r5wWP3t5CyX37jCIb7DErvbiJu9Hv_g",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ M9 Bayonet",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.018,
    "amount": 1650,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Kmsj2P7rSnXtU6dd9teTA5475jV2urhcDPzCkfMKLcAE-aV3R-lO5l-e61sfqvZ2fyiBgvikqsXiMyRGw1U1Ja-dm06adSULeWfJvEZCxug",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Talon Knife",
    "skinName": "Doppler",
    "wear": "FN",
    "baseFloat": 0.014,
    "amount": 1250,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1M5vahf6lsK_WBMWad_ux6seJiXyyyhxEYvjyXmIP8KDHCOml8U8UoAfkC4UbuldyzNOy35lHc3opEyS2qhiocvHs_5bsHVPIgq_bQhgrBM7w9_9Bdc1T7Obpq",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AWP",
    "skinName": "Dragon Lore",
    "wear": "FT",
    "baseFloat": 0.1824,
    "amount": 4280,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AWP",
    "skinName": "Gungnir",
    "wear": "FN",
    "baseFloat": 0.0298,
    "amount": 8900,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6N4LvedB3WvzedxuPUnHnjnzUl0sWrdztitI3rDZgJzAsZ1QOFY4UPqldDgMO_l41HXit9AmTK-0H227dAsvQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AWP",
    "skinName": "Desert Hydra",
    "wear": "FT",
    "baseFloat": 0.195,
    "amount": 1850,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6x0JOKSMWuZxuZi_uA7Syu2w0Ry4mqGzYypeH3DaAEnCpt0FuAK4RjrkoDgMb7mtFfcit5bjXKpX4RFZcA",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AWP",
    "skinName": "Medusa",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 2800,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqfbdsH_GEHlicyOl-pK85TC23wk12tWSGnNr6JXqRPVUnA5J5RLIKshS-l4HuYbji7lfajdgU02yg2bOcOBD3",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "M4A4",
    "skinName": "Howl",
    "wear": "FN",
    "baseFloat": 0.0312,
    "amount": 5400,
    "rarityColor": "#e4ae39",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF6ueZhW2exwkl2tmTXwt39eCiUPQR2DMN4TOVetUK8xoLgM-K341eM2otDnC6okGoXufBz_TAB",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AK-47",
    "skinName": "Wild Lotus",
    "wear": "FN",
    "baseFloat": 0.0245,
    "amount": 7850,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AK-47",
    "skinName": "Fire Serpent",
    "wear": "MW",
    "baseFloat": 0.0821,
    "amount": 1320,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "AK-47",
    "skinName": "Gold Arabesque",
    "wear": "FT",
    "baseFloat": 0.21,
    "amount": 3100,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSJ_-fCliR0-90tfJ4WiyMmRQguynLntmvICieOARzCpMhF-BYsRe-xoHvYu_g5lSNj4NDyy2viCwY6Hlu5_FCD_Q1jEqYuQ",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Sport Gloves",
    "skinName": "Pandora's Box",
    "wear": "FT",
    "baseFloat": 0.2241,
    "amount": 2150,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H-CGHHecxNF6ueZhW2exk01w4j7cmYn4eHPCbAMhApdwTOIN5BPsx9yyYu605FTeid0Uy3j3kGoXueKyz5wo",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Sport Gloves",
    "skinName": "Vice",
    "wear": "FT",
    "baseFloat": 0.22,
    "amount": 3200,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H_KfG2Kv0ed4u95lRi67gVNx4T-Bw434IHyVb1QlAsd1FOUDthG4xNznMu3m4QXXg90Wzn_33C1I8G81tLaDi_rK",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "★ Moto Gloves",
    "skinName": "Spearmint",
    "wear": "FT",
    "baseFloat": 0.215,
    "amount": 1950,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu4r7_lb1QgTykpPf-i5U-fe9V6liNP-BDX6TzetJvehnWxanhxQmvTqJn7D1KCzPKhgnW5UmRO4DsxXrlYbhPurmtAXai98UzS73in5I6S5p4OsAU_Zx-KHWkUifZsxBQgc2",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "Sticker",
    "skinName": "Titan (Holo) | Katowice 2014",
    "wear": "-",
    "amount": 45000,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM-sJnCW8Vli_YTxuAm2FVLll4Lh8x1T4P6hJqZrJfHAXjXGkr0i4rc_GSjixEh35GSAnNr8IyqSbg8kA8ciRrQJshGm0oqwlCzKr50",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "Sticker",
    "skinName": "iBUYPOWER (Holo) | Katowice 2014",
    "wear": "-",
    "amount": 65000,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM-sJnCW8Vli_YTxuAm2FVL4nIP57S1M6uCRYKthL77KW2XAkr91tLQ-S33iwhly62jcn9yrcy2fOlBxA5JyRuVf40W7xoC2Kaq8sK3FB_Eg",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "grail"
  },
  {
    "weapon": "Sticker",
    "skinName": "Crown (Foil)",
    "wear": "-",
    "amount": 950,
    "rarityColor": "#eb4b4b",
    "image": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjNm1PHic4ERmpsj3-FbwTyL3kZ_ssycDt6v4PvU_dvTGDWGWl-xwtLZoS36ykB4ltTvXy42seS_EPFQpC8BuBbldJQkRI1c",
    "fallbackImage": "/images/skins/m4a1s_printstream.png",
    "tier": "high"
  }
];

export const PAYMENT_METHODS_OPTIONS = [
  { name: 'Visa / Mastercard', icon: 'card' },
  { name: 'МИР', icon: 'mir' },
  { name: 'СБП', icon: 'sbp' },
  { name: 'USDT TRC20', icon: 'usdt' },
  { name: 'USDT BEP20', icon: 'usdt' },
  { name: 'TON Coin', icon: 'ton' },
  { name: 'Bitcoin', icon: 'btc' },
  { name: 'Revolut Pay', icon: 'revolut' },
];

export const STORAGE_KEY_PAYOUTS = 'skintocash_live_payouts_v6';

/**
 * Weighted random picker from catalog:
 * 40% budget, 35% mid, 17% high, 8% grail
 */
export function pickRandomCatalogSkin(): CatalogSkinItem {
  const roll = Math.random() * 100;
  let targetTier: CatalogSkinItem['tier'] = 'budget';

  if (roll < 40) {
    targetTier = 'budget';
  } else if (roll < 75) {
    targetTier = 'mid';
  } else if (roll < 92) {
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
