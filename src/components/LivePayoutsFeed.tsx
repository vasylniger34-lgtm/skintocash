import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, Zap } from 'lucide-react';
import { INITIAL_LIVE_PAYOUTS } from '../data/payoutsData';
import type { LivePayout } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';

export const LivePayoutsFeed: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [payouts, setPayouts] = useState<LivePayout[]>(INITIAL_LIVE_PAYOUTS);

  // Dynamic simulation of incoming trades
  useEffect(() => {
    const dynamicSkins = [
      {
        skinName: 'Wild Lotus',
        weapon: 'AK-47',
        wear: 'FN' as const,
        float: 0.0245,
        amount: 7850.00,
        method: 'USDT TRC20',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw',
        rarityColor: '#eb4b4b',
      },
      {
        skinName: 'Howl',
        weapon: 'M4A4',
        wear: 'FN' as const,
        float: 0.0312,
        amount: 5400.00,
        method: 'Visa Direct',
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF6ueZhW2exwkl2tmTXwt39eCiUPQR2DMN4TOVetUK8xoLgM-K341eM2otDnC6okGoXufBz_TAB',
        rarityColor: '#e4ae39',
      },
      {
        skinName: 'Printstream',
        weapon: 'M4A1-S',
        wear: 'FN' as const,
        float: 0.0152,
        amount: 495.00,
        method: 'Revolut Pay',
        image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITBhGJf_NZlmOzA-LP4jVC9vh5yY2GhI4fAdlA9aF3V-FfsxO_s1JTu7Z3BySZhuCgitC3D30vgN8_v6f0/512fx384f',
        fallbackImage: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_F7Rienhgk1tjyIpYPwJiPTcAAoCpsiEO5ZsUbpm9C2Zuni4VHW3o5EzSX62HxP7Sg96-hWVqYi_6TJz1aW0nxrkGs',
        rarityColor: '#eb4b4b',
      },
      {
        skinName: 'Gamma Doppler',
        weapon: 'Karambit',
        wear: 'FN' as const,
        float: 0.0084,
        amount: 3450.00,
        method: 'USDT TRC20',
        image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRd4cJ5nqeYrN2m2wK1_Us5Z2r1d46dd1M8Y13YqFi9wO_p0J67vM6bzSA26Sg8pSGKJ7_F_vA/512fx384f',
        fallbackImage: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
        rarityColor: '#eb4b4b',
      },
    ];

    const interval = setInterval(() => {
      const randomSkin = dynamicSkins[Math.floor(Math.random() * dynamicSkins.length)];
      const newPayout: LivePayout = {
        id: `pay-${Date.now()}`,
        skinName: randomSkin.skinName,
        weapon: randomSkin.weapon,
        wear: randomSkin.wear,
        float: randomSkin.float,
        amount: randomSkin.amount,
        currency: '$',
        method: randomSkin.method,
        methodIcon: 'usdt',
        timeAgo: 'Just now',
        image: randomSkin.image,
        fallbackImage: (randomSkin as any).fallbackImage,
        rarityColor: randomSkin.rarityColor,
        txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      };

      setPayouts(prev => [newPayout, ...prev.slice(0, 9)]);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live-payouts" className="py-20 sm:py-24 bg-[#070A0E] relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute"></span>
              <Flame className="w-4 h-4 fill-emerald-400 relative z-10" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                {t('feed.title')}
                <span className="text-[10px] font-['JetBrains_Mono'] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  {t('feed.badge')}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                {t('feed.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-slate-400 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{t('feed.paid24h')} <strong className="text-emerald-400 font-bold">$412,890.00</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('feed.medianSpeed')} <strong className="text-cyan-400 font-bold">41s</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Horizontal Carousel of Payout Cards */}
      <div className="relative w-full overflow-x-auto no-scrollbar pb-4 pt-1 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 w-max">
          <AnimatePresence initial={false}>
            {payouts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: -60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                className="group relative w-72 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md p-4 transition-all duration-200 shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.12)] flex flex-col justify-between"
              >
                {/* Rarity Top Glow Bar */}
                <div 
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-t-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.rarityColor }}
                />

                {/* Card Top: Method & Timestamp */}
                <div className="flex items-center justify-between text-[11px] mb-2 font-['JetBrains_Mono']">
                  <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-white/[0.06] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    {item.method}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.timeAgo === 'Just now' ? t('feed.justNow') : item.timeAgo}
                  </span>
                </div>

                {/* Weapon Preview Area with SkinImage */}
                <div className="relative h-24 my-1 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent rounded-xl" />
                  <SkinImage
                    src={item.image}
                    fallback={item.fallbackImage}
                    alt={`${item.weapon} | ${item.skinName}`}
                    className="max-h-20 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Card Bottom: Weapon Name, Float & Green Payout Amount */}
                <div className="pt-2 border-t border-white/[0.06] flex items-end justify-between">
                  <div className="text-left overflow-hidden pr-2">
                    <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-slate-400 truncate">
                      {item.weapon}
                    </div>
                    <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                      {item.skinName}
                    </div>
                    
                    {/* Float badge */}
                    <div className="flex items-center gap-1.5 mt-1 font-['JetBrains_Mono'] text-[10px]">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/[0.06] font-bold">
                        {item.wear}
                      </span>
                      <span className="text-slate-500">
                        {item.float.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-slate-500 block">
                      {t('feed.paid')}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold font-['JetBrains_Mono'] text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      +{formatPrice(item.amount)}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
};
