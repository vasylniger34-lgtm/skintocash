import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ExternalLink, 
  Copy, 
  Check, 
  LogOut, 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Flame, 
  Clock, 
  RefreshCw, 
  Sparkles,
  Link2,
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { LogoIcon } from '../components/LogoIcon';
import { FIAT_PAYMENT_METHODS } from '../data/paymentMethods';
import { parseSteamTradeUrl } from '../services/steamService';
import type { Currency } from '../types';

interface CabinetPageProps {
  onNavigateHome: () => void;
  onLoadInventoryAndGoHome: (tradeUrlOrSteamId: string) => void;
}

type CabinetTab = 'wallet' | 'trade' | 'history' | 'security';

export const CabinetPage: React.FC<CabinetPageProps> = ({ 
  onNavigateHome, 
  onLoadInventoryAndGoHome 
}) => {
  const { user, loginWithSteam, logout, updateTradeUrl, updateBalance, transactions, addTransaction } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, currentOption } = useLanguage();

  const [activeTab, setActiveTab] = useState<CabinetTab>('wallet');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(user?.tradeUrl || '');
  const [tradeUrlSaved, setTradeUrlSaved] = useState(false);

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Cashout / Withdraw state inside cabinet
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawMethod, setWithdrawMethod] = useState(FIAT_PAYMENT_METHODS[0].name);
  const [withdrawDestination, setWithdrawDestination] = useState('5375 **** **** 1290');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveTradeUrl = () => {
    parseSteamTradeUrl(tradeUrlInput);
    updateTradeUrl(tradeUrlInput);
    setTradeUrlSaved(true);
    setTimeout(() => setTradeUrlSaved(false), 2500);
  };

  const handleExecuteWithdraw = () => {
    const currentBalance = user?.balance || 0;
    if (withdrawAmount <= 0 || withdrawAmount > currentBalance) return;

    setIsProcessingWithdraw(true);

    setTimeout(() => {
      updateBalance(-withdrawAmount);
      addTransaction({
        type: 'payout',
        title: `Виплата коштів на ${withdrawMethod}`,
        amount: withdrawAmount,
        status: 'completed',
        method: withdrawMethod,
        destinationMasked: withdrawDestination,
        itemsCount: 1,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      });

      setIsProcessingWithdraw(false);
      setIsWithdrawing(false);

      // Celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B'],
      });
    }, 1000);
  };

  const handleLoadInventory = () => {
    const target = user?.tradeUrl || user?.steamId64 || '';
    if (target) {
      onLoadInventoryAndGoHome(target);
    } else {
      onNavigateHome();
    }
  };

  // If user is not authenticated, show a clean authorization screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A0E] text-white flex flex-col justify-between">
        {/* Simple Top Bar */}
        <header className="border-b border-white/[0.06] bg-[#070A0E]/80 backdrop-blur-xl py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <LogoIcon size={32} />
              <div className="font-['Space_Grotesk'] font-bold text-xl text-white">
                <span>SkinTo</span>
                <span className="text-emerald-400">Cash</span>
              </div>
            </div>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>На головну</span>
            </button>
          </div>
        </header>

        {/* Not Logged In Center Banner */}
        <div className="max-w-md mx-auto text-center px-4 py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <svg className="w-8 h-8 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] mb-3">
            Вхід в Особистий кабінет
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Для перегляду балансу, історії виплат та синхронізації інвентарю CS2 увійдіть за допомогою офіційного Steam OpenID.
          </p>

          <button
            onClick={loginWithSteam}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
            <span>Увійти через STEAM</span>
          </button>
        </div>

        <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500 font-['JetBrains_Mono']">
          © 2026 SkinToCash Technologies Ltd. Всі права захищено.
        </footer>
      </div>
    );
  }

  const statusColor = user.personastate === 1 
    ? 'bg-emerald-400' 
    : user.personastate === 0 
    ? 'bg-slate-500' 
    : 'bg-cyan-400';

  const statusLabel = user.personastate === 1 
    ? 'У мережі (Online)' 
    : user.personastate === 0 
    ? 'Не в мережі' 
    : 'У Counter-Strike 2';

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Navigation Header for Cabinet Page */}
      <header className="sticky top-0 z-40 bg-[#070A0E]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Back to Home Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <LogoIcon size={34} />
              <div className="font-['Space_Grotesk'] font-bold text-xl text-white flex items-center">
                <span>SkinTo</span>
                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Cash</span>
              </div>
            </div>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['Space_Grotesk'] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>На головну</span>
            </button>
          </div>

          {/* Right Action Tools: Language + Currency + Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-['JetBrains_Mono'] text-slate-200 transition-all cursor-pointer"
              >
                <span>{currentOption.flag}</span>
                <span className="font-semibold">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0B1017] border border-white/10 shadow-2xl p-1 z-50"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-lg transition-colors cursor-pointer ${
                          language === l.code ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{l.nativeName}</span>
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-['JetBrains_Mono'] text-slate-200 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0B1017] border border-white/10 shadow-2xl p-1 z-50"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-['JetBrains_Mono'] rounded-lg transition-colors cursor-pointer ${
                          currency === c.code ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
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

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                onNavigateHome();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-['Space_Grotesk'] font-medium text-red-400 hover:text-red-300 transition-all cursor-pointer"
              title="Вийти з акаунту"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Вийти</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Breadcrumb / Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-slate-400 mb-1">
              <button onClick={onNavigateHome} className="hover:text-emerald-400 transition-colors">
                Головна
              </button>
              <span>/</span>
              <span className="text-emerald-400">Особистий кабінет</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
              Особистий кабінет гравця
            </h1>
          </div>

          <button
            onClick={handleLoadInventory}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Продати скіни CS2</span>
          </button>
        </div>

        {/* Master User Profile Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-[#0B1017] border border-white/[0.08] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Avatar + Info */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-teal-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden">
                  <img
                    src={user.avatarfull || user.avatar}
                    alt={user.personaname}
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                </div>
                {/* Status Dot */}
                <span 
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-[#0B1017] ${statusColor} shadow-[0_0_12px_rgba(16,185,129,0.9)]`} 
                  title={statusLabel}
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
                    {user.personaname}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400 font-['JetBrains_Mono']">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Steam Verified
                  </span>
                  {user.loccountrycode && (
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] font-['JetBrains_Mono'] text-slate-300 uppercase">
                      🇺🇦 {user.loccountrycode}
                    </span>
                  )}
                </div>

                {/* SteamID and Profile URL */}
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  <button
                    onClick={() => handleCopy(user.steamId64, 'steamid')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] hover:border-emerald-500/40 text-xs font-['JetBrains_Mono'] text-slate-300 hover:text-white transition-all cursor-pointer group"
                  >
                    <span className="text-slate-500">SteamID:</span>
                    <span>{user.steamId64}</span>
                    {copiedField === 'steamid' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>

                  <a
                    href={user.profileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-slate-300 hover:text-white transition-all"
                  >
                    <span>Профіль у Steam</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 font-['JetBrains_Mono']">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Рівень Steam {user.steamLevel || 1}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 font-['JetBrains_Mono']">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    VAC: Без блокувань
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400 font-['JetBrains_Mono']">
                    Акаунт із {user.joinedAt || '2024'} р.
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Balance Header Pill */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-left md:text-right shrink-0">
              <div className="text-xs font-['JetBrains_Mono'] text-slate-400 mb-1">
                Доступний баланс:
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {formatPrice(user.balance || 0)}
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Гаманець & Баланс</span>
          </button>

          <button
            onClick={() => setActiveTab('trade')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'trade'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Steam Trade URL & Інвентар</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Історія транзакцій ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Безпека</span>
          </button>
        </div>

        {/* Tab 1: WALLET & BALANCES */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            
            {/* Big Wallet Card */}
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-[#0F172A] border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Wallet className="w-48 h-48 text-emerald-400" />
              </div>

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400 uppercase tracking-wider font-semibold mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Доступний баланс SkinToCash
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['JetBrains_Mono'] text-white tracking-tight drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    {formatPrice(user.balance || 0)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-xl">
                    Гроші готові до моментальної виплати на картки України (Monobank, Privat24, Visa/Mastercard) або криптовалюту без затримок.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsWithdrawing(!isWithdrawing)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    <span>Вивести кошти</span>
                  </button>

                  <button
                    onClick={handleLoadInventory}
                    className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white font-['Space_Grotesk'] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Продати скіни CS2</span>
                  </button>
                </div>
              </div>

              {/* Inline Cashout Form Drawer */}
              <AnimatePresence>
                {isWithdrawing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-6 border-t border-white/[0.08]"
                  >
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mb-4">
                      Заявка на виведення коштів
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-['JetBrains_Mono'] text-slate-400 mb-1.5">
                          Сума виводу ($)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max={user.balance || 0}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Math.max(1, Number(e.target.value)))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-['JetBrains_Mono'] text-slate-400 mb-1.5">
                          Спосіб отримання
                        </label>
                        <select
                          value={withdrawMethod}
                          onChange={(e) => setWithdrawMethod(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                        >
                          <option value="Monobank (UAH)">Monobank (UAH ₴)</option>
                          <option value="PrivatBank (UAH)">ПриватБанк (UAH ₴)</option>
                          <option value="Visa / Mastercard (UAH)">Будь-яка карта України (Visa/MC)</option>
                          <option value="Tether USDT (TRC-20)">Tether USDT (TRC-20)</option>
                          <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-xs font-['JetBrains_Mono'] text-slate-400 mb-1.5">
                        Номер картки або USDT гаманець:
                      </label>
                      <input
                        type="text"
                        value={withdrawDestination}
                        onChange={(e) => setWithdrawDestination(e.target.value)}
                        placeholder="5375 0000 0000 0000 або TWK8..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setIsWithdrawing(false)}
                        className="px-4 py-2.5 text-xs font-['Space_Grotesk'] text-slate-400 hover:text-white"
                      >
                        Скасувати
                      </button>

                      <button
                        disabled={isProcessingWithdraw || (user.balance || 0) < withdrawAmount}
                        onClick={handleExecuteWithdraw}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
                      >
                        {isProcessingWithdraw ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        <span>Підтвердити виплату ({formatPrice(withdrawAmount)})</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-[#0B1017] border border-white/[0.07] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                  <span>Всього виведено коштів:</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {formatPrice(user.totalWithdrawn || 420.00)}
                </div>
                <div className="text-xs text-emerald-400/80 mt-1 font-['JetBrains_Mono']">
                  100% успішних транзакцій
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B1017] border border-white/[0.07] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                  <span>Успішних угод:</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {user.totalSales || 7} угод
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  Середній час виводу: 38 сек
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B1017] border border-white/[0.07] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                  <span>Комісія платформи:</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                  0.0% (VIP)
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  Акційний статус активний
                </div>
              </div>
            </div>

            {/* Referral Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-emerald-950/20 border border-cyan-500/20 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold font-['Space_Grotesk'] text-cyan-400 mb-1">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  Реферальна програма SkinToCash
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Діліться вашим реферальним лінком та отримуйте <strong className="text-emerald-400">+1.5%</strong> з кожного трейду ваших друзів довічно!
                </p>
              </div>

              <button
                onClick={() => handleCopy(`https://skintocash.com/ref/${user.steamId64}`, 'ref')}
                className="shrink-0 px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-['Space_Grotesk'] font-bold text-cyan-300 flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedField === 'ref' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Посилання скопійовано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Скопіювати реф-лінк</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: STEAM TRADE URL SETTINGS */}
        {activeTab === 'trade' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/[0.08] space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-1.5">
                  Steam Trade URL (Посилання на обмін)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                  Посилання на обмін використовується ботами сервісу для надсилання вам пропозицій обміну. Воно абсолютно безпечне і не надає доступу до ваших паролів чи акаунта.
                </p>
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 mb-2 font-semibold">
                  Ваш активний Trade URL:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={tradeUrlInput}
                    onChange={(e) => setTradeUrlInput(e.target.value)}
                    placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-xs sm:text-sm focus:border-emerald-500/50 outline-none"
                  />
                  <button
                    onClick={handleSaveTradeUrl}
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    {tradeUrlSaved ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    <span>{tradeUrlSaved ? 'Збережено!' : 'Зберегти'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/[0.05]">
                <a
                  href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium font-['Space_Grotesk']"
                >
                  <span>Де знайти свій Steam Trade URL?</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setTradeUrlInput('https://steamcommunity.com/tradeoffer/new/?partner=184920412&token=9X4bK2sM')}
                  className="text-xs text-slate-400 hover:text-slate-200 font-['JetBrains_Mono']"
                >
                  Вставити тестовий URL
                </button>
              </div>

              {/* Instant Load Inventory Shortcut Card */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-emerald-300 font-['Space_Grotesk']">
                    Завантажити свій CS2 інвентар у калькулятор
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Перейдіть до оцінки скінів — система підтягне ваші предмети безпосередньо за вашим SteamID.
                  </div>
                </div>

                <button
                  onClick={handleLoadInventory}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Завантажити інвентар</span>
                </button>
              </div>

              {/* Safety notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">Памʼятка безпеки: </strong>
                  SkinToCash ніколи та ні за яких умов не просить ваш Steam Web API ключ чи код відновлення Steam Guard. Усі обміни підтверджуються виключно вами у вашому мобільному додатку Steam.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Історія операцій ({transactions.length})
              </h3>
              <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                Захищені виплати через банківські шлюзи та Web3
              </span>
            </div>

            <div className="space-y-3.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-5 rounded-3xl bg-[#0B1017] hover:bg-white/[0.03] border border-white/[0.07] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === 'payout' 
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' 
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}>
                      {tx.type === 'payout' ? (
                        <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                      ) : (
                        <Sparkles className="w-6 h-6 stroke-[2.5]" />
                      )}
                    </div>

                    <div>
                      <div className="font-['Space_Grotesk'] font-bold text-sm sm:text-base text-white">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-['JetBrains_Mono'] flex-wrap">
                        <span className="text-slate-300 font-semibold">{tx.id}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="text-slate-300">{tx.method}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                    <div className="text-lg font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                      +{formatPrice(tx.amount)}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                      <Check className="w-3 h-3" />
                      Виплачено
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/[0.08] space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-1.5">
                  Безпека та активні сеанси
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Інформація про стан вашого зʼєднання та криптографічну автентифікацію через офіційний OpenID сервіс корпорації Valve.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        Valve Steam OpenID 2.0
                      </div>
                      <div className="text-xs text-slate-400">
                        Автентичність облікового запису підтверджена Valve
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Активно
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        Steam Mobile Authenticator Guard
                      </div>
                      <div className="text-xs text-slate-400">
                        Акаунт захищено 2FA від несанкціонованих угод
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Захищено
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        Офіційний домен SkinToCash
                      </div>
                      <div className="text-xs text-slate-400">
                        Захищене SSL зʼєднання
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Дійсно
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    logout();
                    onNavigateHome();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 font-['Space_Grotesk'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Завершити сесію та вийти з акаунту</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Page Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-500 font-['JetBrains_Mono']">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 SkinToCash Technologies Ltd. Всі права захищено.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">
              На головну
            </button>
            <span>•</span>
            <span className="text-emerald-400">Сесія: {user.personaname}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
