import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap,
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Flame, 
  Globe,
  ArrowLeftRight,
  ShieldCheck,
  HelpCircle,
  Coins
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
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);

  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, t, currentOption } = useLanguage();
  const { user, openCabinet, loginWithSteam } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click / escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
        setLangDropdownOpen(false);
        setInfoDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCurrencyDropdownOpen(false);
        setLangDropdownOpen(false);
        setInfoDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
    setInfoDropdownOpen(false);
  };

  const handleNavigateP2P = () => {
    window.history.pushState({}, '', '/p2p');
    window.dispatchEvent(new PopStateEvent('popstate'));
    setMobileMenuOpen(false);
    setInfoDropdownOpen(false);
  };

  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-[#070A0E]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.85)] py-2 sm:py-2.5' 
          : 'bg-[#070A0E]/75 backdrop-blur-md border-b border-white/[0.04] py-3 sm:py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-nowrap w-full">
          
          {/* Brand Logo - Never shrinks, pinned to left */}
          <div 
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center transition-transform group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.35)] shrink-0">
              <LogoIcon size={30} />
            </div>

            <div className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl tracking-tight text-white flex items-center shrink-0">
              <span>SkinTo</span>
              <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                Cash
              </span>
            </div>
          </div>

          {/* Desktop Navigation: Compact, non-overflowing core links (fits all 1024px-1600px screens without clipping right side) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 min-w-0">
            {/* 1. Instant Sell */}
            <button
              onClick={() => handleNavClick('inventory-sandbox')}
              className="whitespace-nowrap px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-400 shrink-0" />
              <span>{t('nav.instantSell')}</span>
            </button>

            {/* 2. P2P Marketplace (Featured) */}
            <button
              onClick={handleNavigateP2P}
              className="whitespace-nowrap px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:text-emerald-300 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>P2P Ринок</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-[9px] font-black text-slate-950 font-['JetBrains_Mono'] uppercase">
                New
              </span>
            </button>

            {/* 3. Buy Skins */}
            <button
              onClick={() => handleNavClick('inventory-sandbox')}
              className="whitespace-nowrap px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              {t('nav.buySkins')}
            </button>

            {/* 4. Dropdown "Інфо ▾" for secondary links (guarantees header never overflows on 1280px-1536px) */}
            <div className="relative">
              <button
                onClick={() => {
                  setInfoDropdownOpen(!infoDropdownOpen);
                  setLangDropdownOpen(false);
                  setCurrencyDropdownOpen(false);
                }}
                className={`whitespace-nowrap text-xs font-medium flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  infoDropdownOpen 
                    ? 'bg-white/[0.08] text-white border border-white/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{language === 'EN' ? 'Info' : (language === 'RU' ? 'Инфо' : 'Інфо')}</span>
                <ChevronDown 
                  className="w-3 h-3 text-slate-400 transition-transform duration-200" 
                  style={{ transform: infoDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                />
              </button>

              <AnimatePresence>
                {infoDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#0B1017] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.95)] p-1.5 z-50 backdrop-blur-2xl"
                  >
                    <button
                      onClick={() => handleNavClick('live-payouts')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t('nav.liveDeals')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('how-it-works')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('nav.howItWorks')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('why-us')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t('nav.trustSecurity')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('faq')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="w-3.5 text-center font-bold text-amber-400">?</span>
                      <span>{t('nav.faq')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Tools - STRICTLY SHRINK-0 (Always 100% visible, never pushed offscreen!) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                  setInfoDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-['JetBrains_Mono'] ${
                  langDropdownOpen
                    ? 'bg-slate-800 text-white border-emerald-500/50'
                    : 'bg-slate-900/80 border-white/10 hover:border-emerald-500/40 text-slate-200'
                }`}
                title="Оберіть мову"
              >
                <span>{currentOption.flag}</span>
                <span className="font-semibold">{language}</span>
                <ChevronDown 
                  className="w-3 h-3 text-slate-400 transition-transform duration-200" 
                  style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0B1017] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.95)] p-1.5 z-50 backdrop-blur-2xl"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-xl transition-colors cursor-pointer ${
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
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLangDropdownOpen(false);
                  setInfoDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-['JetBrains_Mono'] ${
                  currencyDropdownOpen
                    ? 'bg-slate-800 text-white border-emerald-500/50'
                    : 'bg-slate-900/80 border-white/10 hover:border-emerald-500/40 text-slate-200'
                }`}
                title="Оберіть валюту"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{currency}</span>
                <ChevronDown 
                  className="w-3 h-3 text-slate-400 transition-transform duration-200" 
                  style={{ transform: currencyDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0B1017] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.95)] p-1.5 z-50 backdrop-blur-2xl"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-xl transition-colors cursor-pointer ${
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

            {/* Authenticated Steam User Capsule OR Sign In CTA - ALWAYS VISIBLE */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCabinet}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer group shrink-0"
                title="Відкрити Особистий кабінет"
              >
                <div className="relative shrink-0">
                  <img
                    src={user.avatarfull || user.avatar}
                    alt={user.personaname}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-emerald-400/50"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="text-xs font-bold font-['Space_Grotesk'] text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <span className="truncate max-w-[70px] sm:max-w-[105px]">{user.personaname}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform hidden sm:inline" />
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
                className="relative group overflow-hidden whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
                title="Увійти через Steam"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none -translate-x-[200%] animate-[shimmerSweep_3s_infinite_cubic-bezier(0.4,0,0.2,1)]" />

                <svg className="w-3.5 h-3.5 fill-slate-950 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                </svg>

                {/* Responsive label: compact on small phones, full on sm+ */}
                <span className="inline sm:hidden">
                  {language === 'EN' ? 'Sign In' : (language === 'RU' ? 'Войти' : 'Увійти')}
                </span>
                <span className="hidden sm:inline">{t('nav.signInSteam')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950 shrink-0 hidden sm:inline" />
              </motion.button>
            )}

            {/* Mobile Menu Toggle Button (44x44 minimum touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Full slide-down overlay with native mobile touch UX) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[#070A0E]/98 border-b border-white/10 backdrop-blur-2xl px-4 py-5 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              
              {/* Authenticated User Card OR Steam Sign In Banner */}
              {user ? (
                <div 
                  onClick={() => {
                    openCabinet();
                    setMobileMenuOpen(false);
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0B1017] border border-emerald-500/40 flex items-center justify-between cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatarfull || user.avatar}
                        alt={user.personaname}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {user.personaname}
                      </div>
                      <div className="text-xs text-emerald-400 font-['JetBrains_Mono'] font-bold mt-0.5">
                        Баланс: {formatPrice(user.balance || 0)}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-950 font-bold font-['Space_Grotesk'] bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-xl shadow-md transition-all">
                    Кабінет →
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    loginWithSteam();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                >
                  <svg className="w-4 h-4 fill-slate-950 shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                  </svg>
                  <span>{t('nav.signInSteam')}</span>
                </button>
              )}

              {/* Mobile Segmented Selectors: Currency & Language */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                {/* Currency selector chips */}
                <div>
                  <div className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>Валюта сайту</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`py-1.5 px-2 rounded-xl text-center text-xs font-['JetBrains_Mono'] font-bold transition-all ${
                          currency === c.code
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-white/[0.04] text-slate-300 hover:text-white'
                        }`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language selector chips */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Мова інтерфейсу
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`py-1.5 px-1 rounded-xl text-center text-xs font-['JetBrains_Mono'] transition-all flex flex-col items-center gap-0.5 ${
                          language === l.code
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                            : 'bg-white/[0.03] text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{l.flag}</span>
                        <span className="text-[10px]">{l.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Action Links */}
              <div className="space-y-2">
                {/* 1. Instant Sell */}
                <button
                  onClick={() => handleNavClick('inventory-sandbox')}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-between cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    <span>{t('nav.instantSell')}</span>
                  </span>
                  <span className="text-[10px] font-['JetBrains_Mono'] bg-emerald-500/25 px-2 py-0.5 rounded-lg text-emerald-300">
                    Миттєво
                  </span>
                </button>

                {/* 2. P2P Marketplace */}
                <button
                  onClick={handleNavigateP2P}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-between cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                    <span>P2P Ринок (Скіни на картку)</span>
                  </span>
                  <span className="text-[9px] font-black font-['JetBrains_Mono'] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md uppercase">
                    New
                  </span>
                </button>

                {/* 3. Live Deals */}
                <button
                  onClick={() => handleNavClick('live-payouts')}
                  className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold font-['Space_Grotesk'] flex items-center gap-2.5 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <span>{t('nav.liveDeals')}</span>
                </button>

                {/* 4. How it works */}
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold font-['Space_Grotesk'] flex items-center gap-2.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t('nav.howItWorks')}</span>
                </button>

                {/* 5. Trust & Security */}
                <button
                  onClick={() => handleNavClick('why-us')}
                  className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold font-['Space_Grotesk'] flex items-center gap-2.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.trustSecurity')}</span>
                </button>

                {/* 6. FAQ */}
                <button
                  onClick={() => handleNavClick('faq')}
                  className="w-full py-2.5 px-4 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold font-['Space_Grotesk'] flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="w-4 text-center font-bold text-amber-400">?</span>
                  <span>{t('nav.faq')}</span>
                </button>
              </div>

              {/* Drawer Footer Badge */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-['JetBrains_Mono']">
                <span>SkinToCash © 2026</span>
                <span className="text-emerald-400 font-semibold">4.9/5 Trustpilot ⭐</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
