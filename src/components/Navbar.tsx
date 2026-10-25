import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Flame, 
  Globe 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import type { Currency } from '../types';

interface NavbarProps {
  onOpenSteamModal: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSteamModal, onScrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#070A0E]/85 backdrop-blur-xl border-b border-emerald-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] group">
              <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-sm group-hover:bg-emerald-400/25 transition-all"></div>
              {/* Custom CS2 / Lightning Knife Emblem */}
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] relative z-10 transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-['Space_Grotesk'] tracking-tight font-extrabold text-xl leading-none">
                <span className="text-white">SKIN</span>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  TOCASH
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-['JetBrains_Mono'] tracking-wider uppercase text-emerald-400/90 font-medium">
                  Instant P2P Engine
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/15 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <button
              onClick={() => onScrollToSection('inventory-sandbox')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              Instant Sell
            </button>

            <button
              onClick={() => onScrollToSection('inventory-sandbox')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Buy Skins
            </button>

            <button
              onClick={() => onScrollToSection('live-payouts')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-cyan-400" />
              Live Deals
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-['JetBrains_Mono'] bg-cyan-500/20 text-cyan-300 font-bold ml-0.5 border border-cyan-400/30">
                LIVE
              </span>
            </button>

            <button
              onClick={() => onScrollToSection('how-it-works')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              How It Works
            </button>

            <button
              onClick={() => onScrollToSection('why-us')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Trust & Security
            </button>

            <button
              onClick={() => onScrollToSection('faq')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* Live Status indicator pill (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-['JetBrains_Mono'] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">Bots:</span>
              <span className="text-emerald-400 font-bold">32 Online</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Avg:</span>
              <span className="text-cyan-400 font-bold">38s</span>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-['JetBrains_Mono'] font-medium text-slate-200 transition-all cursor-pointer"
                title="Select currency"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: currencyDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0B1017] border border-emerald-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)] p-1 z-50 backdrop-blur-2xl"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-lg transition-colors cursor-pointer ${
                          currency === c.code 
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className="text-slate-500 text-[10px]">{c.icon}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sell Skins via Steam CTA Button with Animated Shimmer */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSteamModal}
              className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.65)] transition-all flex items-center gap-2 cursor-pointer"
            >
              {/* Sweeping shimmer beam */}
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none -translate-x-[200%] animate-[shimmerSweep_3s_infinite_cubic-bezier(0.4,0,0.2,1)]" />

              {/* Steam SVG Icon */}
              <svg className="w-4 h-4 fill-slate-950 transition-transform group-hover:rotate-12" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
              </svg>

              <span>Sell Skins via Steam</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#070A0E]/95 border-b border-emerald-500/20 backdrop-blur-2xl px-4 py-6"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onScrollToSection('inventory-sandbox');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Instant Sell Inventory
                </span>
                <span className="text-xs font-['JetBrains_Mono'] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                  Sub-120s
                </span>
              </button>

              <button
                onClick={() => {
                  onScrollToSection('live-payouts');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                Live Payouts Stream
              </button>

              <button
                onClick={() => {
                  onScrollToSection('why-us');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                Why Choose Us & Security
              </button>

              <button
                onClick={() => {
                  onScrollToSection('how-it-works');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                3-Step Cashout Guide
              </button>

              <button
                onClick={() => {
                  onScrollToSection('faq');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                Frequently Asked Questions
              </button>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  32 Trading Bots Operational
                </span>
                <span>Avg: 38s Payout</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
