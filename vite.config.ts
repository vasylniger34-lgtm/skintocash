import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite dev middleware for Steam Inventory API
function steamDevProxyPlugin(apiKey: string) {
  return {
    name: 'steam-dev-proxy',
    configureServer(server: any) {
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

          const inventoryUrl = `https://steamcommunity.com/inventory/${targetSteamId}/730/2?l=english&count=100`;

          const invRes = await fetch(inventoryUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json',
            },
          });

          if (invRes.status === 403) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: 'private_inventory',
              message: 'This Steam inventory is set to Private. Please make it Public in Steam Privacy settings.',
              steamId64: targetSteamId,
            }));
            return;
          }

          if (invRes.status === 429) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: 'rate_limited',
              message: 'Steam rate-limited public request. Fallback activated.',
              steamId64: targetSteamId,
            }));
            return;
          }

          if (!invRes.ok) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: 'steam_error',
              status: invRes.status,
              steamId64: targetSteamId,
            }));
            return;
          }

          const data: any = await invRes.json();

          // Fetch player profile info via Steam API Key
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

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            assets: data.assets,
            descriptions: data.descriptions,
            total_inventory_count: data.total_inventory_count || data.assets?.length || 0,
            player: playerProfile ? {
              personaname: playerProfile.personaname,
              avatar: playerProfile.avatarfull || playerProfile.avatarmedium,
              profileurl: playerProfile.profileurl,
            } : null,
            steamId64: targetSteamId,
          }));
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
  const steamKey = env.STEAM_API_KEY || env.VITE_STEAM_API_KEY || '';

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
