import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Link as LinkIcon, 
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';

interface HeroProps {
  onScanInventory: (tradeUrl: string) => void;
  onOpenSteamModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanInventory, onOpenSteamModal }) => {
  const { t } = useLanguage();
  const [tradeUrl, setTradeUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // 3D Mouse Parallax effect for the right showcase
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-250, 250], [6, -6]);
  const rotateY = useTransform(mouseX, [-250, 250], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
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
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanInventory(tradeUrl || 'demo');
    }, 1200);
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

          {/* Right Column: Frameless Floating Composition with Real Weapon Render */}
          <div 
            className="lg:col-span-5 relative flex items-center justify-center perspective-[1000px] min-h-[420px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[440px] h-[380px] flex items-center justify-center"
            >
              {/* Atmospheric Ambient Emerald Radial Glow */}
              <div className="absolute w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Real Weapon Render Floating Freely (No Heavy Card Box!) */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-20 w-80 sm:w-96 h-60 flex items-center justify-center cursor-pointer"
                onClick={onOpenSteamModal}
              >
                <SkinImage
                  src="https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRd4cJ5nqeYrN2m2wK1_Us5Z2r1d46dd1M8Y13YqFi9wO_p0J67vM6bzSA26Sg8pSGKJ7_F_vA/512fx384f"
                  fallback="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw"
                  alt="Karambit Gamma Doppler Emerald"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.45)] drop-shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-transform duration-300 hover:scale-105"
                />
              </motion.div>

              {/* ONLY 2 Minimalist Floating Glass Pills (Per User Directive) */}
              
              {/* Pill 1 (Top-Left): Item Title & Float */}
              <motion.div
                animate={{
                  y: [5, -5, 5],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-6 -left-2 z-30 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-white tracking-tight">
                  {t('hero.cardPillTop')}
                </span>
              </motion.div>

              {/* Pill 2 (Bottom-Right): Payout & Speed */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.6,
                }}
                className="absolute bottom-6 -right-2 z-30 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-2"
              >
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-emerald-400 tracking-tight">
                  {t('hero.cardPillBottom')}
                </span>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
