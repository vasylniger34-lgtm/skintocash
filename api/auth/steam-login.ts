export default async function handler(req: any, res: any) {
  const host = req.headers['host'] || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || 'https';
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

  res.writeHead(302, {
    Location: `https://steamcommunity.com/openid/login?${params.toString()}`,
  });
  res.end();
}
