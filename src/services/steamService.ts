import type { CS2Skin, SkinCategory } from '../types';
import { MOCK_CS2_INVENTORY } from '../data/skinsData';

export interface SteamTradeUrlInfo {
  partnerId: string | null;
  token: string | null;
  steamId64: string | null;
  isValid: boolean;
}

export interface SteamInventoryResult {
  success: boolean;
  status: 'success' | 'private' | 'rate_limited' | 'error' | 'demo' | 'empty';
  items: CS2Skin[];
  totalCount: number;
  message?: string;
  steamId64?: string | null;
  player?: {
    personaname: string;
    avatar: string;
    profileurl?: string;
  } | null;
}

/**
 * Robustly parses Steam trade URLs, Partner IDs, and 64-bit SteamIDs.
 */
export function parseSteamTradeUrl(input: string): SteamTradeUrlInfo {
  if (!input || typeof input !== 'string') {
    return { partnerId: null, token: null, steamId64: null, isValid: false };
  }

  const clean = input.trim();

  // If user passed 'demo'
  if (clean.toLowerCase() === 'demo') {
    return { partnerId: '184920412', token: '9X4bK2sM', steamId64: '76561198145186140', isValid: true };
  }

  const partnerMatch = clean.match(/partner=(\d+)/i);
  const tokenMatch = clean.match(/token=([a-zA-Z0-9_-]+)/i);

  const partnerId = partnerMatch ? partnerMatch[1] : null;
  const token = tokenMatch ? tokenMatch[1] : null;

  // Direct SteamID64 check
  const steamIdMatch = clean.match(/(7656119\d{10})/);
  let steamId64 = steamIdMatch ? steamIdMatch[1] : null;

  const BASE_ID = 76561197960265728n;

  if (partnerId && !steamId64) {
    try {
      steamId64 = (BASE_ID + BigInt(partnerId)).toString();
    } catch {
      steamId64 = null;
    }
  }

  const isValid = Boolean((partnerId && token) || steamId64);

  return { partnerId, token, steamId64, isValid };
}

/**
 * Determines weapon category from Steam tags and market hash name
 */
function determineCategory(marketName: string, tags?: any[]): SkinCategory {
  const typeTag = tags?.find((t: any) => t.category === 'Type')?.localized_tag_name || '';
  const typeLower = typeTag.toLowerCase();
  const lower = marketName.toLowerCase();

  if (typeLower.includes('knife') || (lower.includes('★') && (lower.includes('knife') || lower.includes('karambit') || lower.includes('bayonet') || lower.includes('daggers') || lower.includes('butterfly') || lower.includes('talon') || lower.includes('stiletto') || lower.includes('skeleton') || lower.includes('nomad') || lower.includes('survival') || lower.includes('ursus') || lower.includes('paracord') || lower.includes('kukri') || lower.includes('bowie') || lower.includes('huntsman') || lower.includes('falchion')))) {
    return 'Knife';
  }
  if (typeLower.includes('gloves') || lower.includes('gloves') || lower.includes('wraps')) {
    return 'Gloves';
  }
  if (typeLower.includes('sniper') || lower.includes('awp') || lower.includes('ssg 08') || lower.includes('scar-20') || lower.includes('g3sg1')) {
    return 'Sniper';
  }
  if (typeLower.includes('rifle') || lower.includes('ak-47') || lower.includes('m4a1-s') || lower.includes('m4a4') || lower.includes('galil') || lower.includes('famas') || lower.includes('aug') || lower.includes('sg 553')) {
    return 'Rifle';
  }
  if (typeLower.includes('pistol') || lower.includes('usp-s') || lower.includes('glock-18') || lower.includes('desert eagle') || lower.includes('p250') || lower.includes('five-seven') || lower.includes('dual berettas') || lower.includes('cz75') || lower.includes('r8') || lower.includes('tec-9') || lower.includes('p2000')) {
    return 'Pistol';
  }
  if (typeLower.includes('smg') || lower.includes('mp9') || lower.includes('mac-10') || lower.includes('mp7') || lower.includes('mp5') || lower.includes('ump-45') || lower.includes('p90') || lower.includes('bizon')) {
    return 'SMG';
  }
  if (typeLower.includes('shotgun') || lower.includes('nova') || lower.includes('xm1014') || lower.includes('mag-7') || lower.includes('sawed-off')) {
    return 'Shotgun';
  }
  if (typeLower.includes('machinegun') || lower.includes('negev') || lower.includes('m249')) {
    return 'Machinegun';
  }
  if (typeLower.includes('case') || typeLower.includes('container') || lower.includes('case') || lower.includes('capsule') || lower.includes('package')) {
    return 'Case';
  }
  if (typeLower.includes('sticker') || lower.includes('sticker')) {
    return 'Sticker';
  }
  if (typeLower.includes('agent') || lower.includes('agent') || lower.includes('cmdr') || lower.includes('officer')) {
    return 'Agent';
  }
  return 'Other';
}

/**
 * Determines rarity and corresponding UI color
 */
function determineRarity(tags: any[]): { rarity: CS2Skin['rarity']; color: string } {
  const rarityTag = tags?.find((t: any) => t.category === 'Rarity');
  const name = rarityTag ? (rarityTag.localized_tag_name || rarityTag.name || '').toLowerCase() : '';

  if (name.includes('contraband')) {
    return { rarity: 'Contraband', color: '#ffd700' };
  }
  if (name.includes('covert') || name.includes('extraordinary')) {
    return { rarity: 'Covert', color: '#eb4b4b' };
  }
  if (name.includes('classified')) {
    return { rarity: 'Classified', color: '#d32ce6' };
  }
  if (name.includes('restricted') || name.includes('remarkable')) {
    return { rarity: 'Restricted', color: '#8847ff' };
  }
  if (name.includes('mil-spec') || name.includes('high grade')) {
    return { rarity: 'Mil-Spec', color: '#4b69ff' };
  }
  if (name.includes('industrial')) {
    return { rarity: 'Industrial', color: '#5e98d9' };
  }
  return { rarity: 'Consumer', color: '#b0c3d9' };
}

/**
 * Determines wear exterior from item name or tags
 */
function determineWear(marketName: string, tags?: any[]): { wear: CS2Skin['wear']; wearName: string; float: number } {
  const extTag = tags?.find((t: any) => t.category === 'Exterior')?.localized_tag_name;
  if (extTag) {
    if (extTag.includes('Factory New')) return { wear: 'FN', wearName: 'Factory New', float: 0.015 };
    if (extTag.includes('Minimal Wear')) return { wear: 'MW', wearName: 'Minimal Wear', float: 0.088 };
    if (extTag.includes('Field-Tested')) return { wear: 'FT', wearName: 'Field-Tested', float: 0.215 };
    if (extTag.includes('Well-Worn')) return { wear: 'WW', wearName: 'Well-Worn', float: 0.410 };
    if (extTag.includes('Battle-Scarred')) return { wear: 'BS', wearName: 'Battle-Scarred', float: 0.640 };
  }
  if (marketName.includes('(Factory New)')) {
    return { wear: 'FN', wearName: 'Factory New', float: 0.015 };
  }
  if (marketName.includes('(Minimal Wear)')) {
    return { wear: 'MW', wearName: 'Minimal Wear', float: 0.088 };
  }
  if (marketName.includes('(Field-Tested)')) {
    return { wear: 'FT', wearName: 'Field-Tested', float: 0.215 };
  }
  if (marketName.includes('(Well-Worn)')) {
    return { wear: 'WW', wearName: 'Well-Worn', float: 0.410 };
  }
  if (marketName.includes('(Battle-Scarred)')) {
    return { wear: 'BS', wearName: 'Battle-Scarred', float: 0.640 };
  }
  return { wear: 'FN', wearName: 'Factory New', float: 0.025 };
}

/**
 * Calculates benchmark market price and SkinToCash instant cashout value
 */
function estimateItemPrice(marketName: string, category: string, rarity: string, isStatTrak: boolean): { price: number; steamPrice: number; buffPrice: number } {
  let basePrice = 25.0;
  const lower = marketName.toLowerCase();

  // Tier 1 Knives & Legendary Skins
  if (lower.includes('dragon lore')) basePrice = 9820;
  else if (lower.includes('howl')) basePrice = 5200;
  else if (lower.includes('gungan')) basePrice = 7500;
  else if (lower.includes('gamma doppler') || lower.includes('emerald')) basePrice = 3450;
  else if (lower.includes('doppler')) basePrice = 1450;
  else if (lower.includes('fade')) basePrice = 1850;
  else if (lower.includes('fire serpent')) basePrice = 1650;
  else if (lower.includes('pandora')) basePrice = 5400;
  else if (lower.includes('printstream')) basePrice = lower.includes('m4a1') ? 890 : 260;
  else if (lower.includes('asiimov')) basePrice = lower.includes('awp') ? 220 : 130;
  else if (lower.includes('vulcan')) basePrice = 640;
  else if (lower.includes('case hardened')) basePrice = 450;
  else if (lower.includes('crane flight')) basePrice = 85;
  else if (lower.includes('black nile')) basePrice = 14.5;
  else if (lower.includes('crakow')) basePrice = 48.0;
  else if (lower.includes('jawbreaker')) basePrice = 32.0;
  else if (category === 'Knife') basePrice = 420;
  else if (category === 'Gloves') basePrice = 360;
  else if (category === 'Case') basePrice = lower.includes('weapon case') ? 95 : 2.8;
  else if (category === 'Sticker') basePrice = lower.includes('glitter') || lower.includes('holo') ? 16.5 : 3.8;
  else if (category === 'Agent') basePrice = 28.0;
  else if (rarity === 'Covert') basePrice = 85;
  else if (rarity === 'Classified') basePrice = 38;
  else if (rarity === 'Restricted') basePrice = 12.5;
  else if (rarity === 'Mil-Spec') basePrice = 4.8;
  else basePrice = 1.6;

  if (isStatTrak) basePrice *= 1.35;

  // Round to realistic numbers
  const buffPrice = Math.round(basePrice * 100) / 100;
  const steamPrice = Math.round(buffPrice * 1.15 * 100) / 100;
  const cashoutPrice = Math.round(buffPrice * 0.94 * 100) / 100;

  return {
    price: cashoutPrice,
    buffPrice,
    steamPrice,
  };
}

/**
 * Converts raw Steam community descriptions + assets into typed CS2Skin objects
 */
export function mapSteamItemsToCS2Skins(assets: any[], descriptions: any[]): CS2Skin[] {
  if (!assets || !descriptions) return [];

  const descMap = new Map<string, any>();
  descriptions.forEach((d) => {
    const key = `${d.classid}_${d.instanceid || '0'}`;
    descMap.set(key, d);
    descMap.set(d.classid, d);
  });

  const skins: CS2Skin[] = [];

  assets.forEach((asset, idx) => {
    const key = `${asset.classid}_${asset.instanceid || '0'}`;
    const desc = descMap.get(key) || descMap.get(asset.classid);

    if (!desc || !desc.market_hash_name) return;

    // Filter out untradable items if specified
    if (desc.tradable === 0) return;

    const marketName = desc.market_hash_name || desc.name;
    const isStatTrak = marketName.includes('StatTrak™');
    const category = determineCategory(marketName, desc.tags);
    const { rarity, color } = determineRarity(desc.tags);
    const { wear, wearName, float } = determineWear(marketName, desc.tags);
    const { price, steamPrice, buffPrice } = estimateItemPrice(marketName, category, rarity, isStatTrak);

    // Extract weapon name and skin title
    const nameParts = marketName.replace('StatTrak™ ', '').replace('★ ', '').split(' | ');
    const weapon = nameParts[0] || 'Weapon';
    const skinNameWithWear = nameParts[1] || marketName;
    const skinName = skinNameWithWear.split(' (')[0];

    // Build official Akamai CDN icon image
    const iconUrl = desc.icon_url_large || desc.icon_url;
    const imageUrl = iconUrl 
      ? `https://community.akamai.steamstatic.com/economy/image/${iconUrl}/512fx384f`
      : 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRd4cJ5nqeYrN2m2wK1_Us5Z2r1d46dd1M8Y13YqFi9wO_p0J67vM6bzSA26Sg8pSGKJ7_F_vA/512fx384f';

    skins.push({
      id: `steam-${asset.assetid || idx}`,
      name: marketName,
      weapon,
      skinName,
      category,
      wear,
      wearName,
      float: parseFloat(float.toFixed(4)),
      rarity,
      rarityColor: color,
      rarityBorder: `border-[${color}]/40`,
      rarityGlow: `${color}40`,
      patternIndex: Math.floor(Math.random() * 800) + 1,
      price,
      steamPrice,
      buffPrice,
      image: imageUrl,
      fallbackImage: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
      isStatTrak,
    });
  });

  return skins;
}

/**
 * Main service call: Fetches and evaluates inventory from trade URL or SteamID64
 */
export async function fetchSteamInventory(input: string): Promise<SteamInventoryResult> {
  const { partnerId, steamId64, isValid } = parseSteamTradeUrl(input);

  if (!isValid && input.trim().toLowerCase() !== 'demo') {
    return {
      success: false,
      status: 'error',
      items: [],
      totalCount: 0,
      message: 'Invalid Steam Trade URL or SteamID format',
    };
  }

  // If user requested demo explicitly
  if (input.trim().toLowerCase() === 'demo') {
    return {
      success: true,
      status: 'demo',
      items: MOCK_CS2_INVENTORY,
      totalCount: MOCK_CS2_INVENTORY.length,
      message: 'Demo inventory loaded successfully',
      player: {
        personaname: 'Verified Trader',
        avatar: 'https://avatars.steamstatic.com/b5bd56c1aa99e440b0b12e1a6ae410290fec5b12_full.jpg',
      },
    };
  }

  try {
    const url = `/api/steam-inventory?steamId64=${steamId64 || ''}&partner=${partnerId || ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        status: 'error',
        items: [],
        totalCount: 0,
        message: 'Could not connect to Steam servers. Please try again.',
        steamId64,
      };
    }

    const data = await response.json();

    // Check for private inventory
    if (data.error === 'private_inventory' || data.status === 401 || data.status === 403) {
      return {
        success: false,
        status: 'private',
        items: [],
        totalCount: 0,
        message: 'This Steam Inventory is set to Private. Please open your Steam Profile -> Privacy Settings -> Set Inventory to Public.',
        player: data.player || null,
        steamId64,
      };
    }

    // Check for rate limited
    if (data.error === 'rate_limited') {
      return {
        success: false,
        status: 'rate_limited',
        items: [],
        totalCount: 0,
        message: 'Steam rate limit reached. Please wait 30 seconds and try again.',
        player: data.player || null,
        steamId64,
      };
    }

    if (data.success && data.assets && data.descriptions) {
      const skins = mapSteamItemsToCS2Skins(data.assets, data.descriptions);
      return {
        success: true,
        status: skins.length > 0 ? 'success' : 'empty',
        items: skins,
        totalCount: skins.length,
        player: data.player,
        steamId64,
        message: skins.length > 0 
          ? `Successfully synchronized ${skins.length} CS2 items` 
          : 'Your CS2 inventory has no tradable skins.',
      };
    }

    return {
      success: false,
      status: 'error',
      items: [],
      totalCount: 0,
      message: data.message || 'Unable to load Steam inventory.',
      player: data.player || null,
      steamId64,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'error',
      items: [],
      totalCount: 0,
      message: err?.message || 'Network issue contacting Steam API.',
      steamId64,
    };
  }
}
