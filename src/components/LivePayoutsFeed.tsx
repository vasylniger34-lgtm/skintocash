import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrInitLivePayouts, addNewLivePayout } from '../data/payoutsData';
import type { LivePayout } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';
import { PaymentMethodIcon } from './PaymentMethodIcon';

export const LivePayoutsFeed: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  
  // Persistent payouts history loaded from database/localStorage (60-80 transactions across 2 hours)
  const [payouts, setPayouts] = useState<LivePayout[]>(() => getOrInitLivePayouts());
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update current time every 5 seconds to smoothly refresh relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic simulation of incoming real trades (ticks every 45-75s, prepends live & persists)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextPayout = () => {
      const nextDelayMs = Math.floor(45000 + Math.random() * 30000); // 45s to 75s
      timeoutId = setTimeout(() => {
        setPayouts(prev => addNewLivePayout(prev));
        scheduleNextPayout();
      }, nextDelayMs);
    };

    scheduleNextPayout();
    return () => clearTimeout(timeoutId);
  }, []);

  // Dynamic relative time calculator based on exact timestamp
  const formatTimeAgo = (timestamp: number) => {
    const deltaMs = Math.max(0, currentTime - timestamp);
    const sec = Math.floor(deltaMs / 1000);
    const min = Math.floor(sec / 60);
    const hours = Math.floor(min / 60);

    if (sec < 45) {
      return t('feed.justNow');
    }
    if (hours < 1) {
      return `${min} ${t('feed.minAgo')}`;
    }
    const remMins = min % 60;
    if (remMins === 0) {
      return `${hours} ${t('feed.hourAgo')}`;
    }
    return `${hours} ${t('feed.hourAgo')} ${remMins} ${t('feed.minAgo')}`;
  };

  // Scroll smoothly by delta
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -360 : 360;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="live-payouts" className="py-14 sm:py-20 bg-[#070A0E] relative overflow-hidden border-b border-white/[0.04]">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        
        {/* Clean Live Stream Header */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute"></span>
              <Flame className="w-4 h-4 fill-emerald-400 relative z-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
              {t('feed.title')}
            </h2>
          </div>

          {/* Subtle Carousel Arrow Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              title="Scroll Newer"
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              title="Scroll History"
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Horizontal Carousel of Payout Cards (Pure Live Stream) */}
      <div 
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 px-4 sm:px-6 lg:px-8 select-none"
      >
        <div className="flex gap-4 w-max">
          <AnimatePresence initial={false}>
            {payouts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.45)' }}
                className="group relative w-72 rounded-2xl bg-slate-900/70 border border-white/[0.07] backdrop-blur-md p-4 transition-all duration-200 shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] flex flex-col justify-between shrink-0"
              >
                {/* Rarity Top Glow Bar */}
                <div 
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-t-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.rarityColor }}
                />

                {/* Card Top: Payment Method & Dynamic Timestamp */}
                <div className="flex items-center justify-between text-[11px] mb-2 font-['JetBrains_Mono']">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-white/[0.07] flex items-center gap-1.5 shadow-sm">
                    <PaymentMethodIcon id={item.methodIcon} size={14} className="rounded-sm" />
                    <span className="truncate max-w-[110px]">{item.method}</span>
                  </span>

                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTimeAgo(item.timestamp)}
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

                {/* Card Bottom: Weapon Name, Float & Payout Amount */}
                <div className="pt-2 border-t border-white/[0.06] flex items-end justify-between">
                  <div className="text-left overflow-hidden pr-2">
                    <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-slate-400 truncate tracking-wide">
                      {item.weapon}
                    </div>
                    <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate" title={item.skinName}>
                      {item.skinName}
                    </div>
                    
                    {/* Float / Wear badge & TxHash */}
                    <div className="flex items-center gap-1.5 mt-1 font-['JetBrains_Mono'] text-[10px]">
                      {item.wear !== '-' ? (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/[0.06] font-bold">
                            {item.wear}
                          </span>
                          {item.float !== undefined && (
                            <span className="text-slate-500">
                              {item.float.toFixed(4)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20 font-medium">
                          CS2 Drop
                        </span>
                      )}

                      {item.txHash && (
                        <span className="text-slate-600 hover:text-slate-400 transition-colors hidden sm:inline" title="Transaction Hash">
                          {item.txHash}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payout Cash Value */}
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
