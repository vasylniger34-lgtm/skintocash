export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { steamId64, tradeSession } = req.body || {};
  return res.status(200).json({
    success: true,
    tradeSession,
    message: 'Deposit trade recorded successfully',
  });
}
