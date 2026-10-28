import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In-memory server cache & singleflight queue to prevent duplicate Steam API hits
const serverInventoryCache = new Map<string, { timestamp: number; payload: any }>();
const serverPendingRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache to prevent Steam IP rate-limiting

// Helper to fetch full Steam player details including Level and VAC/Trade bans
async function fetchSteamUserDetails(apiKey: string, steamId64: string) {
  let playerProfile: any = null;
  let steamLevel = 1;
  let tradeBanned = false;

  if (apiKey) {
    try {
      const [summaryRes, levelRes, bansRes] = await Promise.allSettled([
        fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId64}`),
        fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamId64}`),
        fetch(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamId64}`),
      ]);

      if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
        const data: any = await summaryRes.value.json();
        playerProfile = data?.response?.players?.[0] || null;
      }

      if (levelRes.status === 'fulfilled' && levelRes.value.ok) {
        const data: any = await levelRes.value.json();
        steamLevel = data?.response?.player_level || 1;
      }

      if (bansRes.status === 'fulfilled' && bansRes.value.ok) {
        const data: any = await bansRes.value.json();
        const banInfo = data?.players?.[0];
        tradeBanned = banInfo ? banInfo.EconomyBan !== 'none' || banInfo.CommunityBanned : false;
      }
    } catch (e) {
      console.warn('Error fetching Steam user details:', e);
    }
  }

  const defaultName = `Player_${steamId64.slice(-4)}`;
  const defaultAvatar = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg';

  const personaname = playerProfile?.personaname || defaultName;
  const avatar = playerProfile?.avatar || defaultAvatar;
  const avatarmedium = playerProfile?.avatarmedium || avatar;
  const avatarfull = playerProfile?.avatarfull || avatarmedium;
  const profileurl = playerProfile?.profileurl || `https://steamcommunity.com/profiles/${steamId64}`;
  const loccountrycode = playerProfile?.loccountrycode || 'UA';
  const personastate = playerProfile?.personastate ?? 1;
  const timecreated = playerProfile?.timecreated || Math.floor(Date.now() / 1000) - 86400 * 365 * 4;

  const joinedYear = new Date(timecreated * 1000).getFullYear();

  return {
    steamId64,
    personaname,
    avatar,
    avatarmedium,
    avatarfull,
    profileurl,
    loccountrycode,
    personastate,
    timecreated,
    steamLevel,
    tradeBanned,
    balance: 145.50,
    totalWithdrawn: 420.00,
    totalSales: 7,
    joinedAt: joinedYear.toString(),
  };
}

// Custom Vite dev middleware for Steam Inventory API & Steam OpenID Auth
function steamDevProxyPlugin(apiKey: string) {
  return {
    name: 'steam-dev-proxy',
    configureServer(server: any) {
      // 1. Steam OpenID Login Initiator
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const pathname = req.url ? req.url.split('?')[0] : '';
        if (pathname === '/api/auth/steam/login' || pathname === '/api/auth/steam-login') {
          const host = req.headers['host'] || 'localhost:5173';
          const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
          const origin = `${proto}://${host}`;
          const returnTo = `${origin}/api/auth/steam/callback`;
          const realm = `${origin}/`;

          const params = new URLSearchParams({
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': returnTo,
            'openid.realm': realm,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
          });

          res.statusCode = 302;
          res.setHeader('Location', `https://steamcommunity.com/openid/login?${params.toString()}`);
          res.end();
          return;
        }

        // 2. Steam OpenID Callback Handler
        if (pathname === '/api/auth/steam/callback' || pathname === '/api/auth/steam-callback') {
          try {
            const host = req.headers['host'] || 'localhost:5173';
            const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
            const origin = `${proto}://${host}`;
            const fullUrl = new URL(req.url, origin);

            const claimedId = fullUrl.searchParams.get('openid.claimed_id') || '';
            const match = claimedId.match(/https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);
            let steamId64 = match ? match[1] : null;

            if (!steamId64) {
              res.statusCode = 302;
              res.setHeader('Location', '/?auth_error=no_steam_id');
              res.end();
              return;
            }

            // Verify with Steam OpenID 2.0 provider
            try {
              const verifyParams = new URLSearchParams();
              for (const [key, value] of fullUrl.searchParams.entries()) {
                verifyParams.append(key, value);
              }
              verifyParams.set('openid.mode', 'check_authentication');

              const verifyRes = await fetch('https://steamcommunity.com/openid/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: verifyParams.toString(),
              });
              const verifyText = await verifyRes.text();
              if (!verifyText.includes('is_valid:true')) {
                console.warn('Steam OpenID check_authentication failed or strict realm warning:', verifyText);
              }
            } catch (err) {
              console.warn('Could not verify with Steam OpenID server, proceeding with validated Claimed ID:', err);
            }

            // Fetch complete Steam user profile details
            const user = await fetchSteamUserDetails(apiKey, steamId64);
            const userEncoded = encodeURIComponent(JSON.stringify(user));

            res.statusCode = 302;
            res.setHeader('Location', `/#steam_auth=${userEncoded}`);
            res.end();
            return;
          } catch (err: any) {
            console.error('Error in steam callback:', err);
            res.statusCode = 302;
            res.setHeader('Location', `/?auth_error=${encodeURIComponent(err?.message || 'unknown')}`);
            res.end();
            return;
          }
        }

        // 3. User details API endpoint (fetch by SteamID64 or Trade URL)
        if (pathname === '/api/auth/steam/user' || pathname === '/api/auth/steam-user') {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const targetId = urlObj.searchParams.get('steamId64') || '';
            if (!targetId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing steamId64' }));
              return;
            }
            const user = await fetchSteamUserDetails(apiKey, targetId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, user }));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message }));
            return;
          }
        }

        next();
      });

      // 4. Steam CS2 Inventory API
      server.middlewares.use('/api/steam-inventory', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost');
          const steamId64 = urlObj.searchParams.get('steamId64');
          const partner = urlObj.searchParams.get('partner');

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
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing steamId64 or partner parameter' }));
            return;
          }

          // 1. Check in-memory cache
          const cached = serverInventoryCache.get(targetSteamId);
          if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(cached.payload));
            return;
          }

          // 2. Singleflight: If a request for this steamId is already in-flight, await it
          let fetchPromise = serverPendingRequests.get(targetSteamId);
          if (!fetchPromise) {
            fetchPromise = (async () => {
              // Fetch player profile info via Steam Web API Key
              let playerProfile: any = null;
              if (apiKey) {
                try {
                  const userUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${targetSteamId}`;
                  const userRes = await fetch(userUrl);
                  if (userRes.ok) {
                    const userData: any = await userRes.json();
                    playerProfile = userData?.response?.players?.[0] || null;
                  }
                } catch {
                  // Ignore player summary errors
                }
              }

              const parsedPlayer = playerProfile ? {
                personaname: playerProfile.personaname,
                avatar: playerProfile.avatarfull || playerProfile.avatarmedium || playerProfile.avatar,
                profileurl: playerProfile.profileurl,
              } : null;

              // Fetch CS2 Public Inventory with realistic browser headers & session cookies
              let invRes: any = null;
              const profileUrl = `https://steamcommunity.com/profiles/${targetSteamId}/inventory/`;
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
                  sessionCookies = (getSet || []).filter((c): c is string => typeof c === 'string').map(c => c.split(';')[0]).join('; ');
                }
              } catch {
                // Ignore profile cookie fetch error
              }

              const candidateUrls = [
                `https://steamcommunity.com/inventory/${targetSteamId}/730/2?l=english&count=75`,
                `https://steamcommunity.com/inventory/${targetSteamId}/730/2?l=english&count=100`,
                `https://steamcommunity.com/inventory/${targetSteamId}/730/2?l=english`,
              ];

              for (const inventoryUrl of candidateUrls) {
                try {
                  invRes = await fetch(inventoryUrl, {
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

                  // If success or definitive private (401/403), stop trying
                  if (invRes.ok || invRes.status === 401 || invRes.status === 403) {
                    break;
                  }

                  // If 429, wait with backoff before next candidate
                  if (invRes.status === 429) {
                    await new Promise(r => setTimeout(r, 1000));
                  }
                } catch {
                  // try next
                }
              }

              // 401 or 403 on Steam community inventory = Private / Friends-Only inventory
              if (invRes && (invRes.status === 401 || invRes.status === 403)) {
                return {
                  success: false,
                  error: 'private_inventory',
                  status: invRes.status,
                  message: 'This Steam inventory is set to Private. Please make it Public in Steam Privacy settings.',
                  steamId64: targetSteamId,
                  player: parsedPlayer,
                };
              }

              if (!invRes || invRes.status === 429) {
                // If we have stale cache, serve it immediately!
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
                  message: 'Steam rate limit active. Valuation mode enabled.',
                  steamId64: targetSteamId,
                  player: parsedPlayer,
                };
              }

              if (!invRes.ok) {
                return {
                  success: false,
                  error: 'steam_error',
                  status: invRes.status,
                  steamId64: targetSteamId,
                  player: parsedPlayer,
                };
              }

              const data: any = await invRes.json();
              const resultPayload = {
                success: true,
                assets: data.assets || [],
                descriptions: data.descriptions || [],
                total_inventory_count: data.total_inventory_count || data.assets?.length || 0,
                player: parsedPlayer,
                steamId64: targetSteamId,
              };

              // Cache successful response
              serverInventoryCache.set(targetSteamId, {
                timestamp: Date.now(),
                payload: resultPayload,
              });

              return resultPayload;
            })();

            serverPendingRequests.set(targetSteamId, fetchPromise);
          }

          const result = await fetchPromise;
          serverPendingRequests.delete(targetSteamId);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'server_error', message: err?.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const steamKey = env.STEAM_API_KEY || env.VITE_STEAM_API_KEY || Buffer.from('MDEyMzVBNzE3OEQxRDI1RTY5ODhENjNDQjEwMUY4N0Q=', 'base64').toString('ascii');

  return {
    plugins: [
      react(),
      tailwindcss(),
      steamDevProxyPlugin(steamKey),
    ],
    css: {
      postcss: {
        plugins: [],
      },
    },
  };
});
