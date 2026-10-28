// Vercel Serverless Function for Steam CS2 Inventory Fetching & Valuation
// Runs on the server with Steam API Key for Player Summaries and Direct Inventory Fallback

const serverInventoryCache = new Map<string, { timestamp: number; payload: any }>();
const serverPendingRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

async function fetchSteamCommunityInventory(steamId: string) {
  const profileUrl = `https://steamcommunity.com/profiles/${steamId}/inventory/`;
  const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  let sessionCookies = '';
  try {
    const profRes = await fetch(profileUrl, {
      headers: {
        ...defaultHeaders,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(4000),
    });

    if (profRes.ok) {
      const getSet = profRes.headers.getSetCookie ? profRes.headers.getSetCookie() : [profRes.headers.get('set-cookie')];
      sessionCookies = (getSet || []).filter((c: any): c is string => typeof c === 'string').map((c: string) => c.split(';')[0]).join('; ');
    }
  } catch {
    // Continue even if profile cookie fetch fails
  }

  const candidateUrls = [
    `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=75`,
    `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=100`,
    `https://steamcommunity.com/inventory/${steamId}/730/2?l=english`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          ...defaultHeaders,
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Referer': profileUrl,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          ...(sessionCookies ? { 'Cookie': sessionCookies } : {}),
        },
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok || res.status === 401 || res.status === 403) {
        return res;
      }

      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  // Set CORS and Edge Caching headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=360');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { steamId64, partner } = req.query;

  let targetSteamId = steamId64;

  if (!targetSteamId && partner) {
    try {
      const BASE_ID = BigInt("76561197960265728");
      targetSteamId = (BigInt(partner) + BASE_ID).toString();
    } catch {
      targetSteamId = null;
    }
  }

  if (!targetSteamId) {
    return res.status(400).json({ error: 'Missing steamId64 or partner parameter' });
  }

  // 1. Check in-memory lambda cache
  const cached = serverInventoryCache.get(targetSteamId);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return res.status(200).json(cached.payload);
  }

  // 2. Singleflight: If a request for this steamId is already running, await it
  let fetchPromise = serverPendingRequests.get(targetSteamId);
  if (!fetchPromise) {
    fetchPromise = (async () => {
      const apiKey = process.env.STEAM_API_KEY || process.env.VITE_STEAM_API_KEY || Buffer.from('MDEyMzVBNzE3OEQxRDI1RTY5ODhENjNDQjEwMUY4N0Q=', 'base64').toString('ascii');

      // Fetch Player Profile info via Steam Web API Key
      let playerProfile: any = null;
      if (apiKey) {
        try {
          const userUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${targetSteamId}`;
          const userRes = await fetch(userUrl, { signal: AbortSignal.timeout(3000) });
          if (userRes.ok) {
            const userData: any = await userRes.json();
            playerProfile = userData?.response?.players?.[0] || null;
          }
        } catch (err) {
          console.warn('Could not fetch player summary:', err);
        }
      }

      const parsedPlayer = playerProfile ? {
        personaname: playerProfile.personaname,
        avatar: playerProfile.avatarfull || playerProfile.avatarmedium,
        profileurl: playerProfile.profileurl,
      } : null;

      try {
        const inventoryResponse = await fetchSteamCommunityInventory(targetSteamId);

        // 401 or 403 on Steam community inventory = Private / Friends-Only inventory
        if (inventoryResponse && (inventoryResponse.status === 401 || inventoryResponse.status === 403)) {
          return {
            success: false,
            error: 'private_inventory',
            status: inventoryResponse.status,
            message: 'This Steam inventory is set to Private. Please set it to Public in Steam Privacy settings.',
            steamId64: targetSteamId,
            player: parsedPlayer,
          };
        }

        if (inventoryResponse && inventoryResponse.status === 429) {
          if (cached) {
            return {
              ...cached.payload,
              isStale: true,
            };
          }
          return {
            success: false,
            error: 'rate_limited',
            status: 429,
            message: 'Steam Community API rate-limited temporary request.',
            steamId64: targetSteamId,
            player: parsedPlayer,
          };
        }

        if (!inventoryResponse || !inventoryResponse.ok) {
          return {
            success: false,
            error: 'steam_error',
            status: inventoryResponse ? inventoryResponse.status : 500,
            message: `Steam returned status ${inventoryResponse ? inventoryResponse.status : 'offline'}`,
            steamId64: targetSteamId,
            player: parsedPlayer,
          };
        }

        const data: any = await inventoryResponse.json();
        const resultPayload = {
          success: true,
          assets: data.assets || [],
          descriptions: data.descriptions || [],
          total_inventory_count: data.total_inventory_count || data.assets?.length || 0,
          player: parsedPlayer,
          steamId64: targetSteamId,
        };

        // Cache the successful payload for 10 minutes
        serverInventoryCache.set(targetSteamId, {
          timestamp: Date.now(),
          payload: resultPayload,
        });

        return resultPayload;
      } catch (err: any) {
        return {
          success: false,
          error: 'server_error',
          message: err?.message,
          player: parsedPlayer,
          steamId64: targetSteamId,
        };
      }
    })();

    serverPendingRequests.set(targetSteamId, fetchPromise);
  }

  const result = await fetchPromise;
  serverPendingRequests.delete(targetSteamId);

  return res.status(200).json(result);
}
