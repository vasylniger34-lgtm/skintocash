// Vercel Serverless Function for Steam CS2 Inventory Fetching & Valuation
// Runs securely on the server with Steam API Key (no CORS issues in browser)

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { steamId64, partner } = req.query;

  let targetSteamId = steamId64;

  if (!targetSteamId && partner) {
    try {
      const BASE_ID = 76561197960265728n;
      targetSteamId = (BASE_ID + BigInt(partner)).toString();
    } catch {
      targetSteamId = null;
    }
  }

  if (!targetSteamId) {
    return res.status(400).json({ error: 'Missing steamId64 or partner parameter' });
  }

  const apiKey = process.env.STEAM_API_KEY || process.env.VITE_STEAM_API_KEY || '';

  try {
    // 1. Fetch CS2 Public Inventory from Steam Community (appid 730, contextid 2)
    const inventoryUrl = `https://steamcommunity.com/inventory/${targetSteamId}/730/2?l=english&count=100`;

    const inventoryResponse = await fetch(inventoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (inventoryResponse.status === 403) {
      return res.status(200).json({
        success: false,
        error: 'private_inventory',
        message: 'This Steam inventory is set to Private. Please set it to Public in Steam Privacy settings.',
        steamId64: targetSteamId,
      });
    }

    if (inventoryResponse.status === 429) {
      return res.status(200).json({
        success: false,
        error: 'rate_limited',
        message: 'Steam Community API rate-limited temporary request. Fallback activated.',
        steamId64: targetSteamId,
      });
    }

    if (!inventoryResponse.ok) {
      return res.status(200).json({
        success: false,
        error: 'steam_error',
        status: inventoryResponse.status,
        message: `Steam returned status ${inventoryResponse.status}`,
        steamId64: targetSteamId,
      });
    }

    const data = await inventoryResponse.json();

    if (!data || !data.assets || !data.descriptions) {
      return res.status(200).json({
        success: true,
        items: [],
        totalCount: 0,
        steamId64: targetSteamId,
      });
    }

    // 2. Fetch Player Profile info via Steam Web API if key is present
    let playerProfile = null;
    if (apiKey) {
      try {
        const userUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${targetSteamId}`;
        const userRes = await fetch(userUrl);
        if (userRes.ok) {
          const userData = await userRes.json();
          playerProfile = userData?.response?.players?.[0] || null;
        }
      } catch (err) {
        console.warn('Could not fetch player summary:', err);
      }
    }

    return res.status(200).json({
      success: true,
      assets: data.assets,
      descriptions: data.descriptions,
      total_inventory_count: data.total_inventory_count || data.assets.length,
      player: playerProfile ? {
        personaname: playerProfile.personaname,
        avatar: playerProfile.avatarfull || playerProfile.avatarmedium,
        profileurl: playerProfile.profileurl,
      } : null,
      steamId64: targetSteamId,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: error.message || 'Internal server error while contacting Steam',
    });
  }
}
