import { ReviewItem } from '../types';

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Viktor "k1ng" M.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'Today, 11:24',
    title: 'Literally paid out 3.4k in 45 seconds',
    comment: 'Sold my Karambit Gamma Doppler Emerald. Was nervous as hell sending a $3,400 knife to a bot, but trade offer showed up in 3 seconds, verified on Steam Guard, and USDT TRC20 hit my wallet before I even closed the browser tab. 10/10.',
    skinSold: '★ Karambit | Gamma Doppler Emerald',
    payoutAmount: '$3,450.00',
    payoutMethod: 'USDT TRC20',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Alexander B.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'Yesterday, 19:42',
    title: 'Best rates in the entire market',
    comment: 'Checked CS.MONEY, Skinport and Avan.Market. SkinToCash gave me almost $280 more for my Butterfly Fade and didn\'t take ridiculous 15% marketplace cut or hold my money for 8 days. Direct to my Revolut card instantly.',
    skinSold: '★ Butterfly Knife | Fade (99.4%)',
    payoutAmount: '$2,890.00',
    payoutMethod: 'Revolut Card',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Marcus Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: '2 days ago',
    title: 'Zero API scam risk. Super clean interface.',
    comment: 'The bot verification token matches your Steam trade offer directly so there is zero chance of getting phished by API scam bots. Sold my AWP Dragon Lore and received SEPA Instant in Sweden within 3 minutes.',
    skinSold: 'AWP | Dragon Lore (FT)',
    payoutAmount: '$4,280.00',
    payoutMethod: 'SEPA Instant EUR',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Taras H.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: '3 days ago',
    title: 'Card payout worked like magic',
    comment: 'Cashed out Printstream M4 and Deagle. Money was in my card account faster than buying coffee. Exact amount displayed before confirming, no hidden bank conversion fees.',
    skinSold: 'M4A1-S & Desert Eagle | Printstream',
    payoutAmount: '$610.00',
    payoutMethod: 'Visa / Mastercard',
    verified: true,
  },
];

export const FAQ_DATA = [
  {
    question: 'How fast will I actually receive my money?',
    answer: 'For 99.4% of all transactions, funds are dispatched within 45 to 120 seconds after you confirm the trade offer in your Steam Guard Mobile Authenticator. Crypto payouts (USDT, SOL, LTC) process on the next block, and Card/Revolut payouts land immediately via Visa Direct / Mastercard MoneySend.',
  },
  {
    question: 'Is it safe? How do you protect against Steam API Scams?',
    answer: 'We employ a proprietary Anti-Phishing Handshake protocol. When our verified trading bot sends you a trade offer, SkinToCash provides an exclusive 6-character Security Token and displays the exact Bot Account Creation Date, Steam Level, and Registration Badge. You only accept if the token matches on Steam Guard, eliminating man-in-the-middle interception.',
  },
  {
    question: 'Are there any hidden fees or surprise deductions?',
    answer: 'None. What you see on the cashout panel is exactly what reaches your wallet or bank account. All platform fees are 0% during our promotional launch, and standard blockchain network fees (e.g., $1 on TRC-20 or $0.001 on Solana) are transparently disclosed before you hit confirm.',
  },
  {
    question: 'Why is SkinToCash better than selling on the Steam Community Market?',
    answer: 'The Steam Market locks your money permanently inside your Steam Wallet—you cannot withdraw it to cash or crypto, and Valve charges a hefty 15% transaction fee. With SkinToCash, you get real cash directly into your real-world bank, card, or crypto wallet at up to 92-95% of market valuation.',
  },
  {
    question: 'What items can I sell on SkinToCash?',
    answer: 'You can sell any tradable Counter-Strike 2 skin, knife, pair of gloves, sticker capsule, or case. Items must be tradable in your Steam inventory (not subject to Valve\'s 7-day trade cooldown from a recent trade or market purchase).',
  },
  {
    question: 'What are the minimum and maximum cashout limits?',
    answer: 'Minimum cashout starts at just $5.00 for cards, Revolut, and USDT TRC-20. Maximum single-transaction cashout is $50,000 for verified crypto transactions, with no daily ceiling for high-tier inventories.',
  },
];
