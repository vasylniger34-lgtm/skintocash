export default async function handler(req: any, res: any) {
  try {
    const host = req.headers['host'] || 'localhost:3000';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${proto}://${host}`;
    const fullUrl = new URL(req.url, origin);

    const claimedId = fullUrl.searchParams.get('openid.claimed_id') || '';
    const match = claimedId.match(/https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);
    const steamId64 = match ? match[1] : null;

    if (!steamId64) {
      res.writeHead(302, { Location: '/?auth_error=no_steam_id' });
      res.end();
      return;
    }

    const apiKey = process.env.STEAM_API_KEY || process.env.VITE_STEAM_API_KEY || '';

    // Fetch user profile, level, bans
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
      } catch (err) {
        console.warn('Error fetching Steam details in Vercel function:', err);
      }
    }

    const personaname = playerProfile?.personaname || `Player_${steamId64.slice(-4)}`;
    const avatar = playerProfile?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg';
    const avatarmedium = playerProfile?.avatarmedium || avatar;
    const avatarfull = playerProfile?.avatarfull || avatarmedium;
    const profileurl = playerProfile?.profileurl || `https://steamcommunity.com/profiles/${steamId64}`;
    const loccountrycode = playerProfile?.loccountrycode || 'UA';
    const personastate = playerProfile?.personastate ?? 1;
    const timecreated = playerProfile?.timecreated || Math.floor(Date.now() / 1000) - 86400 * 365 * 4;
    const joinedYear = new Date(timecreated * 1000).getFullYear();

    const user = {
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

    const userEncoded = encodeURIComponent(JSON.stringify(user));
    res.writeHead(302, { Location: `/#steam_auth=${userEncoded}` });
    res.end();
  } catch (err: any) {
    res.writeHead(302, { Location: `/?auth_error=${encodeURIComponent(err?.message || 'unknown')}` });
    res.end();
  }
}
