import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Lock,
  RefreshCw
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface HeroProps {
  onScanInventory: (tradeUrl: string) => void;
  onOpenSteamModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanInventory, onOpenSteamModal }) => {
  const { formatPrice } = useCurrency();
  const [tradeUrl, setTradeUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string | null>(null);

  // 3D Mouse Parallax effect for the right column showcase
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 120, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 25 });

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

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

  const handleTestDemoUrl = () => {
    const demoUrl = 'https://steamcommunity.com/tradeoffer/new/?partner=184920412&token=9X4bK2sM';
    setTradeUrl(demoUrl);
  };

  const handleScanClick = () => {
    setIsScanning(true);
    setScanStep('Connecting to Steam Community API...');
    setTimeout(() => {
      setScanStep('Fetching 11 tradable CS2 items & float values...');
    }, 700);
    setTimeout(() => {
      setScanStep('Applying live Buff163 & P2P valuation algorithms...');
    }, 1400);
    setTimeout(() => {
      setIsScanning(false);
      setScanStep(null);
      onScanInventory(tradeUrl || 'demo');
    }, 2000);
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden ambient-mesh">
      
      {/* Background Cyber Grid & Glow Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 right-10 w-[450px] h-[450px] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-cyan-500/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Instant Valuation Widget */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Trustpilot & Speed Pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-6 cursor-pointer hover:border-emerald-500/50 transition-all backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-['JetBrains_Mono'] font-bold text-emerald-400">
                  99.8% Instant Payouts
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
                  4.9/5 on Trustpilot <span className="text-slate-500 font-normal">(14,200+ Reviews)</span>
                </span>
              </div>
            </motion.div>

            {/* Main Punchy Gaming Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-['Space_Grotesk'] text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
            >
              Turn Your CS2 Skins Into{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  Real Cash.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500/50" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,7 Q50,0 100,7" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{' '}
              Under 120 Seconds.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal"
            >
              Skip the 15% Steam Community Market lock and shady P2P traders. 
              Sell directly to automated high-liquidity bots with <strong className="text-emerald-400 font-semibold">up to 95% market valuation</strong> and 
              receive instant cashout via <span className="text-white font-medium">USDT, Visa/Mastercard, Apple Pay</span>, or <span className="text-white font-medium">Bank Wire</span>.
            </motion.p>

            {/* Interactive Trade URL / Payout Calculator Widget */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-2xl rounded-2xl p-1 bg-gradient-to-b from-emerald-500/25 via-emerald-500/10 to-cyan-500/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl mb-8"
            >
              <div className="bg-[#0B1017]/95 rounded-[14px] p-4 sm:p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    Instant Trade URL / Inventory Valuation
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestDemoUrl}
                      className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Try Demo Inventory
                    </button>
                    <span className="text-slate-600">•</span>
                    <a
                      href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-['Plus_Jakarta_Sans'] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      Where is my Trade URL?
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Input with Action Button */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4 text-emerald-400/70" />
                    </div>
                    <input
                      type="url"
                      value={tradeUrl}
                      onChange={(e) => setTradeUrl(e.target.value)}
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 text-xs sm:text-sm font-['JetBrains_Mono'] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isScanning}
                    onClick={handleScanClick}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap min-w-[190px]"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <span>Scan & Get Cash</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Scanning progress display */}
                {scanStep && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{scanStep}</span>
                  </motion.div>
                )}

                {/* Instant Valuation Quick Ticker */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Demo inventory loaded: <strong className="text-white font-['JetBrains_Mono']">11 High-Tier Skins</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Estimated Valuation:</span>
                    <span className="text-sm font-bold font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {formatPrice(34490.00)}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Micro Trust Proofs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Anti-API Scam Protection</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Average Payout: 38 seconds</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>0% Payout Fee on Crypto</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Visual Centerpiece — 3D Parallax Floating CS2 Showcase */}
          <div 
            className="lg:col-span-5 relative flex items-center justify-center perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[480px] h-[520px] rounded-3xl glass-panel p-6 flex flex-col justify-between border border-emerald-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.22)]"
            >
              {/* Radial glow backdrop behind weapon */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-cyan-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              {/* Top Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-['JetBrains_Mono'] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    ★ COVERT KNIFE
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-['JetBrains_Mono'] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    EMERALD PHASE
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Bot #14
                </div>
              </div>

              {/* Main Floating Centerpiece Weapon: Karambit Gamma Doppler Emerald */}
              <div className="relative my-auto flex items-center justify-center">
                
                {/* Secondary background item: AWP Dragon Lore subtle silhouette float */}
                <motion.div
                  animate={{
                    y: [-8, 8, -8],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-12 -right-8 w-48 h-28 opacity-25 filter blur-[1px] pointer-events-none"
                >
                  <img
                    src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV"
                    alt="AWP Dragon Lore"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  />
                </motion.div>

                {/* Primary High-Tier Weapon Float */}
                <motion.div
                  animate={{
                    y: [-12, 12, -12],
                    rotate: [-1, 2, -1],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-20 w-72 sm:w-80 h-52 flex items-center justify-center"
                >
                  {/* Atmospheric Emerald Backlight */}
                  <div className="absolute w-56 h-36 bg-emerald-500/25 blur-3xl rounded-full" />
                  
                  <img
                    src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iVzOtkse1tcCSyhx8rtjSfn4vGLSLANkI-X8MjTLFYskTsw9bnZOuwsgSIj4sTniz-2i5A7yY6tbwGV6Nx-qGEjxaBb-MuPavopw"
                    alt="Karambit Gamma Doppler Emerald"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.45)] drop-shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={onOpenSteamModal}
                  />
                </motion.div>

                {/* Floating Telemetry Badge 1: Float Value */}
                <motion.div
                  animate={{
                    y: [6, -6, 6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="absolute -left-3 top-10 z-30 px-3 py-1.5 rounded-xl bg-[#0B1017]/90 border border-emerald-500/40 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="text-left font-['JetBrains_Mono']">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Exact Float</div>
                    <div className="text-xs font-bold text-white">0.008412 <span className="text-emerald-400 text-[10px]">(FN)</span></div>
                  </div>
                </motion.div>

                {/* Floating Telemetry Badge 2: Payout Speed */}
                <motion.div
                  animate={{
                    y: [-6, 6, -6],
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute -right-3 bottom-12 z-30 px-3.5 py-2 rounded-xl bg-[#0B1017]/90 border border-cyan-400/40 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center gap-2.5"
                >
                  <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left font-['JetBrains_Mono']">
                    <div className="text-[9px] text-slate-400 uppercase">Paid via USDT TRC20</div>
                    <div className="text-xs font-bold text-cyan-400">Received in 42s</div>
                  </div>
                </motion.div>
              </div>

              {/* Weapon Info Bottom Panel */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                      ★ Karambit | Gamma Doppler
                    </h3>
                    <p className="text-xs text-slate-400 font-['JetBrains_Mono'] flex items-center gap-1.5 mt-0.5">
                      <span>Pattern #415</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">Rank #3 World Float</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-slate-400 font-medium">
                      Instant Cashout
                    </div>
                    <div className="text-xl font-extrabold font-['JetBrains_Mono'] text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                      {formatPrice(3450.00)}
                    </div>
                  </div>
                </div>

                {/* Mini Wear Meter */}
                <div className="mt-3">
                  <div className="flex justify-between text-[9px] font-['JetBrains_Mono'] text-slate-500 mb-1">
                    <span className="text-emerald-400 font-bold">FN (0.00 - 0.07)</span>
                    <span>MW</span>
                    <span>FT</span>
                    <span>WW</span>
                    <span>BS</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-500 w-full" />
                    {/* Float indicator tick */}
                    <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_4px_#fff]" style={{ left: '8%' }} />
                  </div>
                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
