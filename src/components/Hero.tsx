import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Link as LinkIcon, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';

interface HeroProps {
  onScanInventory: (tradeUrl: string) => void;
  onOpenSteamModal: () => void;
  onTriggerSellModal?: () => void;
}

interface ShowcaseSkin {
  name: string;
  weapon: string;
  skinName: string;
  float: string;
  wear: string;
  phase: string;
  payout: string;
  paymentRail: string;
  speed: string;
  glowColor: string;
  accentBorder: string;
  image: string;
  fallback: string;
}

const SHOWCASE_SKINS: ShowcaseSkin[] = [
  {
    name: '★ Karambit | Gamma Doppler',
    weapon: 'Karambit',
    skinName: 'Gamma Doppler',
    float: '0.0084 FN',
    wear: 'Factory New',
    phase: 'Emerald Phase',
    payout: '$3,450.00',
    paymentRail: 'USDT (TRC-20)',
    speed: '42s',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    accentBorder: 'rgba(16, 185, 129, 0.4)',
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRd4cJ5nqeYrN2m2wK1_Us5Z2r1d46dd1M8Y13YqFi9wO_p0J67vM6bzSA26Sg8pSGKJ7_F_vA/512fx384f',
    fallback: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
  },
  {
    name: 'AWP | Dragon Lore',
    weapon: 'AWP',
    skinName: 'Dragon Lore',
    float: '0.0142 FN',
    wear: 'Factory New',
    phase: 'Cobblestone Grail',
    payout: '$9,820.00',
    paymentRail: 'Bitcoin (BTC)',
    speed: '58s',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    accentBorder: 'rgba(245, 158, 11, 0.4)',
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv2P9o6migzl_kI5Z2HzJ4eTdQE4N1zR_1K9wO_v1pC_vM7Mn3Rk7nZ2-z-DyIFJb74/512fx384f',
    fallback: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJai0ki7VeTHjM-sJnCW8Vli_YTxuAm2FVL0n5X16SBf6O_4b_0-I6DDDGjHk7d9teFrSHn0wh4vtDyKnN6qIz33ZwhwDYJ-FLdfswbskIu3h1K78f_Gcw',
  },
  {
    name: '★ Butterfly Knife | Fade',
    weapon: 'Butterfly Knife',
    skinName: 'Fade',
    float: '0.0071 FN',
    wear: 'Factory New',
    phase: '100% Full Fade',
    payout: '$4,190.00',
    paymentRail: 'Visa Direct',
    speed: '34s',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    accentBorder: 'rgba(236, 72, 153, 0.4)',
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
    fallback: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
  },
  {
    name: 'M4A1-S | Printstream',
    weapon: 'M4A1-S',
    skinName: 'Printstream',
    float: '0.0049 FN',
    wear: 'Factory New',
    phase: 'Pearlescent Tier-1',
    payout: '$890.00',
    paymentRail: 'Apple Pay',
    speed: '29s',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentBorder: 'rgba(6, 182, 212, 0.4)',
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITBhGJf_NZlmOzA-LP4jVC9vh5yY2GhI4fAdlA9aF3V-FfsxO_s1JTu7Z3BySZhuCgitC3D30vgN8_v6f0/512fx384f',
    fallback: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
  },
  {
    name: '★ Sport Gloves | Pandora\'s Box',
    weapon: 'Sport Gloves',
    skinName: 'Pandora\'s Box',
    float: '0.0821 MW',
    wear: 'Minimal Wear',
    phase: 'Ultra Rare Indigo',
    payout: '$5,420.00',
    paymentRail: 'USDT (TRC-20)',
    speed: '45s',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    accentBorder: 'rgba(139, 92, 246, 0.4)',
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrfummpD78A_3LGZo9vxiQ218xVuNWz3I9SWdwM8ZVrU81W8wO_p1pG5tJ_Am3Rr6Sg8pSGK5_5857A/512fx384f',
    fallback: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw',
  },
];

export const Hero: React.FC<HeroProps> = ({ 
  onScanInventory, 
  onOpenSteamModal,
  onTriggerSellModal 
}) => {
  const { t } = useLanguage();
  const [tradeUrl, setTradeUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Showcase Active Skin Index & Timer
  const [activeSkinIndex, setActiveSkinIndex] = useState(0);
  const activeSkin = SHOWCASE_SKINS[activeSkinIndex];

  // Auto-rotation every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkinIndex((prev) => (prev + 1) % SHOWCASE_SKINS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleNextSkin = () => {
    setActiveSkinIndex((prev) => (prev + 1) % SHOWCASE_SKINS.length);
  };

  const handlePrevSkin = () => {
    setActiveSkinIndex((prev) => (prev - 1 + SHOWCASE_SKINS.length) % SHOWCASE_SKINS.length);
  };

  // 3D Mouse Parallax & Tilt Effect for the Showcase Card
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });

  const mouseX = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 18 });

  // 3D Rotation Angles
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
    setMouseCoord({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDemoClick = () => {
    onScanInventory('demo');
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTriggerSellModal) {
      onTriggerSellModal();
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanInventory(tradeUrl || 'demo');
    }, 1000);
  };

  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-44 lg:pb-36 overflow-hidden ambient-mesh">
      
      {/* Background Cyber Grid & Subtle Glow Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/6 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Radical Minimalist Headlines & Command Bar */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Minimal Trust Badge Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.4)] mb-6 cursor-pointer hover:border-emerald-500/40 transition-colors backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-['JetBrains_Mono'] font-bold text-emerald-400">
                  99.8%
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <div className="flex text-emerald-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  4.9/5 Trustpilot <span className="text-slate-500 font-normal">(14.2k+)</span>
                </span>
              </div>
            </motion.div>

            {/* Main Headline: Exactly 2 lines max, tight tracking */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-['Space_Grotesk'] text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.08] mb-5"
            >
              <span>{t('hero.headlinePart1')} </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(16,185,129,0.45)]">
                {t('hero.headlinePart2')}
              </span>
            </motion.h1>

            {/* Subheading: Exactly one high-impact sentence */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl mb-8 font-normal"
            >
              {t('hero.subheadline')}
            </motion.p>

            {/* Sleek Single-Line Command Bar (h-14, glassmorphic, nested button) */}
            <motion.form
              onSubmit={handleScanSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-xl relative flex items-center h-14 pl-4 pr-1.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/50 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all mb-3.5"
            >
              <LinkIcon className="w-4 h-4 text-emerald-400 shrink-0 mr-3" />
              
              <input
                type="url"
                value={tradeUrl}
                onChange={(e) => setTradeUrl(e.target.value)}
                placeholder={t('hero.inputPlaceholder')}
                className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm font-['JetBrains_Mono'] focus:outline-none"
              />

              <button
                type="submit"
                disabled={isScanning}
                className="h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-all"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>{t('hero.getCashBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.form>

            {/* Minimalist Sub-Bar: Demo Trigger & Clean Payment Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{t('hero.noUrlHandy')}</span>
                <button
                  type="button"
                  onClick={handleDemoClick}
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {t('hero.tryDemo')}
                </button>
              </div>

              {/* Minimalist Monochrome Payment Logos */}
              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-['Space_Grotesk']">
                <span className="hover:text-slate-300 transition-colors">VISA</span>
                <span>•</span>
                <span className="hover:text-slate-300 transition-colors">MC</span>
                <span>•</span>
                <span className="hover:text-slate-300 transition-colors">USDT</span>
                <span>•</span>
                <span className="hover:text-slate-300 transition-colors">BTC</span>
                <span>•</span>
                <span className="hover:text-slate-300 transition-colors"> Pay</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Tilting Glass Card with Smooth Rotating Weapons */}
          <div className="lg:col-span-5 relative flex items-center justify-center perspective-[1200px] min-h-[440px]">
            
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[440px] rounded-3xl bg-[#0B1017]/90 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.12)] transition-colors duration-500 overflow-hidden group cursor-pointer"
              onClick={handleNextSkin}
            >
              {/* Dynamic Cursor Spotlight Sheen */}
              <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(400px circle at ${mouseCoord.x}px ${mouseCoord.y}px, rgba(255, 255, 255, 0.06), transparent 70%)`,
                }}
              />

              {/* Dynamic Background Glow matching current weapon accent */}
              <motion.div
                key={`glow-${activeSkin.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 blur-3xl pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${activeSkin.glowColor}, transparent 70%)`,
                }}
              />

              {/* Top Controls Row: Wear pill + Manual Nav Arrows */}
              <div className="flex items-center justify-between mb-4 relative z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ backgroundColor: activeSkin.accentBorder }}
                  />
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-white tracking-tight">
                    {activeSkin.weapon} • {activeSkin.float}
                  </span>
                </div>

                {/* Arrow switches */}
                <div 
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handlePrevSkin}
                    className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Previous Skin"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextSkin}
                    className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Next Skin"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Weapon Display Area with AnimatePresence for smooth transitions */}
              <div className="relative h-60 sm:h-64 flex items-center justify-center my-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSkin.name}
                    initial={{ opacity: 0, scale: 0.82, rotate: -3, y: 15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, rotate: 3, y: -15 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    {/* Weapon Image with glowing filter */}
                    <SkinImage
                      src={activeSkin.image}
                      fallback={activeSkin.fallback}
                      alt={activeSkin.name}
                      className="max-h-52 sm:max-h-56 w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Card Metrics Banner */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between relative z-20">
                <div>
                  <div className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{activeSkin.phase}</span>
                  </div>
                  <div className="text-lg font-bold font-['Space_Grotesk'] text-white truncate max-w-[190px]">
                    {activeSkin.skinName}
                  </div>
                </div>

                <div 
                  className="text-right cursor-pointer group/payout"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSteamModal();
                  }}
                  title="Click to Sell This Item"
                >
                  <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 group-hover/payout:text-emerald-300 transition-colors">
                    Instant Payout ({activeSkin.speed}) →
                  </div>
                  <div className="text-xl font-extrabold font-['JetBrains_Mono'] text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                    {activeSkin.payout}
                  </div>
                </div>
              </div>

              {/* Pagination Dots Indicator */}
              <div 
                className="flex items-center justify-center gap-1.5 mt-4 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                {SHOWCASE_SKINS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSkinIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSkinIndex === i 
                        ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' 
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
