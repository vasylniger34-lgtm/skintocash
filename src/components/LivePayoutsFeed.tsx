import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, ChevronLeft, ChevronRight, Database, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { getOrInitLivePayouts, addNewLivePayout, saveLivePayouts } from '../data/payoutsData';
import type { LivePayout } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';
import { PaymentMethodIcon } from './PaymentMethodIcon';

type PriceFilter = 'all' | 'budget' | 'mid' | 'high';

export const LivePayoutsFeed: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  
  // Persistent payouts history state loaded from database/localStorage
  const [payouts, setPayouts] = useState<LivePayout[]>(() => getOrInitLivePayouts());
  const [activeFilter, setActiveFilter] = useState<PriceFilter>('all');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update current time every 5 seconds to smoothly update relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic simulation of incoming real trades (ticks every 50-80s, persisted in DB)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextPayout = () => {
      const nextDelayMs = Math.floor(45000 + Math.random() * 45000); // 45s to 90s
      timeoutId = setTimeout(() => {
        setPayouts(prev => {
          const updated = addNewLivePayout(prev);
          return updated;
        });
        scheduleNextPayout();
      }, nextDelayMs);
    };

    scheduleNextPayout();
    return () => clearTimeout(timeoutId);
  }, []);

  // Filter items if user chooses a category
  const filteredPayouts = useMemo(() => {
    if (activeFilter === 'budget') {
      return payouts.filter(p => p.amount < 10);
    }
    if (activeFilter === 'mid') {
      return payouts.filter(p => p.amount >= 10 && p.amount <= 100);
    }
    if (activeFilter === 'high') {
      return payouts.filter(p => p.amount > 100);
    }
    return payouts;
  }, [payouts, activeFilter]);

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
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Jump to specific point in time history (e.g. 15m, 30m, 45m, 1h, 1.5h, 2h)
  const jumpToTime = (minutesAgo: number) => {
    if (!scrollContainerRef.current) return;

    if (minutesAgo === 0) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const targetTimestamp = currentTime - minutesAgo * 60 * 1000;
    
    // Find closest card to this timestamp
    let closestIndex = 0;
    let minDiff = Infinity;

    filteredPayouts.forEach((item, index) => {
      const diff = Math.abs(item.timestamp - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    const cardWidthWithGap = 304; // 288px width + 16px gap
    const targetScrollLeft = Math.max(0, closestIndex * cardWidthWithGap - 40);

    scrollContainerRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  // Calculate stats for the database badge
  const oldestTimestamp = payouts[payouts.length - 1]?.timestamp || currentTime;
  const historyMinutesSpan = Math.max(1, Math.round((currentTime - oldestTimestamp) / 60000));
  const historyHoursSpan = (historyMinutesSpan / 60).toFixed(1);

  return (
    <section id="live-payouts" className="py-16 sm:py-24 bg-[#070A0E] relative overflow-hidden border-b border-white/[0.04]">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
          
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute"></span>
              <Flame className="w-5 h-5 fill-emerald-400 relative z-10" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
                  {t('feed.title')}
                </h2>
                <span className="text-[10px] font-['JetBrains_Mono'] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold tracking-wider">
                  {t('feed.badge')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                {t('feed.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-['JetBrains_Mono'] text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/[0.08] shadow-sm">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('feed.dbSaved')} <strong className="text-emerald-400 font-bold">{payouts.length} ({historyHoursSpan}h)</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/[0.08] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('feed.paid24h')} <strong className="text-emerald-400 font-bold">$412,890.00</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/[0.08] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('feed.medianSpeed')} <strong className="text-cyan-400 font-bold">41s</strong></span>
            </div>
          </div>

        </div>

        {/* Timeline Jump & Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-2 border-t border-white/[0.06]">
          
          {/* Timeline Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1 shrink-0">
              <History className="w-3 h-3 text-emerald-400" />
              {t('feed.timeline')}:
            </span>

            {[
              { label: t('feed.jumpNow'), min: 0, icon: '⚡' },
              { label: t('feed.jump15m'), min: 15 },
              { label: t('feed.jump30m'), min: 30 },
              { label: t('feed.jump45m'), min: 45 },
              { label: t('feed.jump1h'), min: 60 },
              { label: t('feed.jump1_5h'), min: 90 },
              { label: t('feed.jump2h'), min: 120 },
            ].map(item => (
              <button
                key={item.min}
                onClick={() => jumpToTime(item.min)}
                className="px-2.5 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] transition-all hover:border-emerald-500/40 shrink-0 flex items-center gap-1 active:scale-95"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Navigation & Filter controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Price Category Filter Pills */}
            <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.08] text-[11px] font-['JetBrains_Mono']">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-1 rounded-md transition-colors ${activeFilter === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('feed.filterAll')}
              </button>
              <button
                onClick={() => setActiveFilter('budget')}
                className={`px-2 py-1 rounded-md transition-colors ${activeFilter === 'budget' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('feed.filterBudget')}
              </button>
              <button
                onClick={() => setActiveFilter('mid')}
                className={`px-2 py-1 rounded-md transition-colors ${activeFilter === 'mid' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('feed.filterMid')}
              </button>
              <button
                onClick={() => setActiveFilter('high')}
                className={`px-2 py-1 rounded-md transition-colors ${activeFilter === 'high' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('feed.filterHigh')}
              </button>
            </div>

            {/* Left / Right Carousel Arrow Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleScroll('left')}
                title={t('feed.scrollNewer')}
                className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                title={t('feed.scrollOlder')}
                className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Horizontal Carousel of Payout Cards (Scrollable back in history) */}
      <div 
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 px-4 sm:px-6 lg:px-8 select-none"
      >
        <div className="flex gap-4 w-max">
          <AnimatePresence initial={false}>
            {filteredPayouts.map((item, index) => (
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

      {/* History scroll indicator hint for user */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>{t('feed.avgInterval')}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>{t('feed.scrollOlder')}</span>
          <ArrowRight className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>
      </div>

    </section>
  );
};
