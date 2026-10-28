export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { steamId64 } = req.query;
  if (!steamId64) {
    return res.status(400).json({ error: 'Missing steamId64 parameter' });
  }

  const apiKey = process.env.STEAM_API_KEY || process.env.VITE_STEAM_API_KEY || Buffer.from('MDEyMzVBNzE3OEQxRDI1RTY5ODhENjNDQjEwMUY4N0Q=', 'base64').toString('ascii');

  try {
    let playerProfile: any = null;
    let steamLevel = 1;
    let tradeBanned = false;

    if (apiKey) {
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
    }

    const defaultName = steamId64 === '76561199165318169' ? '@fpv.mir' : `Player_${steamId64.slice(-4)}`;
    const defaultAvatar = steamId64 === '76561199165318169'
      ? 'https://avatars.steamstatic.com/623456c285da40156eb692680c9f3939557b9ee5_full.jpg'
      : 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg';

    const personaname = playerProfile?.personaname || defaultName;
    const avatar = playerProfile?.avatar || defaultAvatar;
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

    return res.status(200).json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
}
