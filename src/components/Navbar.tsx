import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap,
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Flame, 
  Globe,
  ArrowLeftRight
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Currency } from '../types';

interface NavbarProps {
  onOpenSteamModal?: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, t, currentOption } = useLanguage();
  const { user, openCabinet, loginWithSteam } = useAuth();

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
          ? 'bg-[#070A0E]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Decluttered Apple/Stripe-level Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center transition-transform group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
              <LogoIcon size={34} />
            </div>

            <div className="font-['Space_Grotesk'] font-bold text-xl tracking-tight text-white flex items-center">
              <span>SkinTo</span>
              <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                Cash
              </span>
            </div>
          </div>

          {/* Single-Line Desktop Navigation (No heavy borders, no line wraps) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button
              onClick={() => onScrollToSection('inventory-sandbox')}
              className="whitespace-nowrap text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-400 shrink-0" />
              <span>{t('nav.instantSell')}</span>
            </button>

            <button
              onClick={() => {
                window.history.pushState({}, '', '/p2p');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="whitespace-nowrap text-xs font-semibold text-white hover:text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>P2P Ринок</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-[9px] font-black text-slate-950 font-['JetBrains_Mono'] uppercase">
                New
              </span>
            </button>

            <button
              onClick={() => onScrollToSection('inventory-sandbox')}
              className="whitespace-nowrap text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {t('nav.buySkins')}
            </button>

            <button
              onClick={() => onScrollToSection('live-payouts')}
              className="whitespace-nowrap text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t('nav.liveDeals')}</span>
            </button>

            <button
              onClick={() => onScrollToSection('how-it-works')}
              className="whitespace-nowrap text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {t('nav.howItWorks')}
            </button>

            <button
              onClick={() => onScrollToSection('why-us')}
              className="whitespace-nowrap text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {t('nav.trustSecurity')}
            </button>

            <button
              onClick={() => onScrollToSection('faq')}
              className="whitespace-nowrap text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {t('nav.faq')}
            </button>
          </nav>

          {/* Right Action Tools: Language + Currency + CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 text-xs font-['JetBrains_Mono'] font-medium text-slate-200 transition-all cursor-pointer"
                title="Select language"
              >
                <span>{currentOption.flag}</span>
                <span className="font-semibold">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0B1017] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.95)] p-1 z-50 backdrop-blur-2xl"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-lg transition-colors cursor-pointer ${
                          language === l.code 
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        <span className="text-slate-500 text-[10px]">{l.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 text-xs font-['JetBrains_Mono'] font-medium text-slate-200 transition-all cursor-pointer"
                title="Select currency"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: currencyDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0B1017] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.95)] p-1 z-50 backdrop-blur-2xl"
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
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
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

            {/* Authenticated Steam User Capsule OR Sign In via Steam CTA Button */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCabinet}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer group"
                title="Відкрити Особистий кабінет"
              >
                <div className="relative">
                  <img
                    src={user.avatarfull || user.avatar}
                    alt={user.personaname}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-emerald-400/50"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="text-xs font-bold font-['Space_Grotesk'] text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <span className="truncate max-w-[80px] sm:max-w-[120px]">{user.personaname}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
                  </div>
                  <div className="text-[10px] font-bold font-['JetBrains_Mono'] text-emerald-400">
                    {formatPrice(user.balance || 0)}
                  </div>
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loginWithSteam}
                className="relative group overflow-hidden whitespace-nowrap px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 cursor-pointer"
                title="Увійти через Steam"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none -translate-x-[200%] animate-[shimmerSweep_3s_infinite_cubic-bezier(0.4,0,0.2,1)]" />

                <svg className="w-3.5 h-3.5 fill-slate-950 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                </svg>

                <span>{t('nav.signInSteam')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              </motion.button>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
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
            className="lg:hidden bg-[#070A0E]/95 border-b border-white/10 backdrop-blur-2xl px-4 py-6"
          >
            <div className="flex flex-col gap-3">
              {/* Authenticated user banner in mobile */}
              {user ? (
                <div 
                  onClick={() => {
                    openCabinet();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarfull || user.avatar}
                      alt={user.personaname}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-400"
                    />
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {user.personaname}
                      </div>
                      <div className="text-xs text-emerald-400 font-['JetBrains_Mono']">
                        Баланс: {formatPrice(user.balance || 0)}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-400 font-semibold font-['Space_Grotesk'] bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                    Кабінет →
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    loginWithSteam();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-slate-950 shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                  </svg>
                  <span>{t('nav.signInSteam')}</span>
                </button>
              )}
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/p2p');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                  <span>P2P Ринок (Скіни на картку)</span>
                </span>
                <span className="text-[10px] font-black font-['JetBrains_Mono'] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                  New
                </span>
              </button>

              <button
                onClick={() => {
                  onScrollToSection('inventory-sandbox');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  {t('nav.instantSell')}
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
                {t('nav.liveDeals')}
              </button>

              <button
                onClick={() => {
                  onScrollToSection('why-us');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                {t('nav.trustSecurity')}
              </button>

              <button
                onClick={() => {
                  onScrollToSection('how-it-works');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                {t('nav.howItWorks')}
              </button>

              <button
                onClick={() => {
                  onScrollToSection('faq');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:bg-slate-900 text-sm font-medium"
              >
                {t('nav.faq')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
