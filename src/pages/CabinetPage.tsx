import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Globe,
  Search,
  CheckSquare,
  Square,
  Lock,
  Layers,
  ArrowUpDown,
  ArrowLeftRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { LogoIcon } from '../components/LogoIcon';
import { SkinImage } from '../components/SkinImage';
import { PaymentMethodIcon } from '../components/PaymentMethodIcon';
import { PayoutTimerModal, type PayoutSession } from '../components/PayoutTimerModal';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import { getCabinetText } from '../data/pagesTranslations';
import { MOCK_CS2_INVENTORY } from '../data/skinsData';
import { fetchSteamInventory, verifyUserTradeUrl, parseSteamTradeUrl } from '../services/steamService';
import { TradeOfferModal } from '../components/TradeOfferModal';
import { OFFICIAL_STEAM_BOT, type DepositTradeSession } from '../data/steamBot';
import type { Currency, CS2Skin, PaymentOption } from '../types';

interface CabinetPageProps {
  onNavigateHome: () => void;
  onLoadInventoryAndGoHome: (tradeUrlOrSteamId: string) => void;
}

type CabinetTab = 'inventory' | 'wallet' | 'trade' | 'history' | 'security';

export const CabinetPage: React.FC<CabinetPageProps> = ({ 
  onNavigateHome, 
  onLoadInventoryAndGoHome 
}) => {
  const { user, loginWithSteam, logout, updateTradeUrl, updateBalance, transactions, addTransaction } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, currentOption } = useLanguage();

  // The FIRST page in profile is automatically the user's CS2 inventory!
  const [activeTab, setActiveTab] = useState<CabinetTab>('inventory');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Trade URL State & Strict Verification
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(user?.tradeUrl || '');
  const [tradeUrlError, setTradeUrlError] = useState<string | null>(null);
  const [tradeUrlSuccess, setTradeUrlSuccess] = useState<string | null>(null);

  // User CS2 Inventory State
  const [skins, setSkins] = useState<CS2Skin[]>(MOCK_CS2_INVENTORY);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState<'success' | 'private' | 'rate_limited' | 'error' | 'demo' | 'empty'>('demo');
  const [selectedSkinIds, setSelectedSkinIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'float-asc'>('price-desc');

  // Helper for full multilingual translations
  const ct = (key: string) => getCabinetText(language, key);

  // All payout methods with visual brand logos (MIR, SBP, Sber, T-Bank, Monobank, Privat, Visa/MC, Crypto)
  const cabinetPaymentMethods: PaymentOption[] = useMemo(() => {
    return [...FIAT_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS];
  }, []);

  // Header Dropdowns
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Cashout / Withdraw state inside cabinet
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption>(FIAT_PAYMENT_METHODS[0]);
  const [withdrawMethod, setWithdrawMethod] = useState(FIAT_PAYMENT_METHODS[0].name);
  const [withdrawDestination, setWithdrawDestination] = useState('2200 **** **** 4812');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // Live Payout Countdown Timer Modal State
  const [payoutSession, setPayoutSession] = useState<PayoutSession | null>(null);
  const [isPayoutTimerOpen, setIsPayoutTimerOpen] = useState(false);

  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  // Auto-load the user's Steam CS2 Inventory on mount
  const loadUserInventory = useCallback(async (target: string, force = false) => {
    if (!target) return;
    setIsLoadingInventory(true);
    try {
      const res = await fetchSteamInventory(target, force);
      setIsLoadingInventory(false);
      setInventoryStatus(res.status);

      if (res.status === 'success' && res.items.length > 0) {
        setSkins(res.items);
        // Pre-select first 2 skins for immediate convenience
        setSelectedSkinIds(new Set(res.items.slice(0, 2).map(s => s.id)));
      } else if (res.status === 'demo' || (res.items && res.items.length > 0)) {
        setSkins(res.items);
        setSelectedSkinIds(new Set(res.items.slice(0, 2).map(s => s.id)));
      }
    } catch (err) {
      console.warn('Failed to load user inventory in cabinet:', err);
      setIsLoadingInventory(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const target = user.tradeUrl || user.steamId64;
      loadUserInventory(target);
    }
  }, [user, loadUserInventory]);

  // Keep input in sync if user changes
  useEffect(() => {
    if (user?.tradeUrl) {
      setTradeUrlInput(user.tradeUrl);
    }
  }, [user?.tradeUrl]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  /**
   * Strictly verifies whether the trade URL belongs to THIS logged-in user.
   * If someone tries to paste another account's trade URL, it is blocked with an explicit error!
   */
  const handleSaveTradeUrl = () => {
    setTradeUrlError(null);
    setTradeUrlSuccess(null);

    if (!user) return;

    if (!tradeUrlInput.trim()) {
      setTradeUrlError(language === 'EN' ? 'Please enter your Steam Trade URL' : (language === 'RU' ? 'Введите ваш Steam Trade URL' : 'Введіть ваш Steam Trade URL'));
      return;
    }

    const verification = verifyUserTradeUrl(tradeUrlInput, user.steamId64);

    if (!verification.belongsToUser) {
      setTradeUrlError(verification.error || (language === 'EN' ? 'This Trade URL belongs to a different Steam account! Third-party trade links cannot be linked.' : (language === 'RU' ? 'Этот Trade URL принадлежит другому аккаунту Steam! Чужой трейдлинк добавить нельзя.' : 'Цей Trade URL належить іншому акаунту Steam! Сторонній трейдлінк додати не можна.')));
      return;
    }

    // Success: URL is strictly verified to match user's steamId64
    updateTradeUrl(tradeUrlInput);
    setTradeUrlSuccess(language === 'EN' ? 'Trade URL successfully verified and linked to your account!' : (language === 'RU' ? 'Trade URL успешно проверен и привязан к вашему аккаунту!' : 'Trade URL успішно верифіковано та закріплено за вашим акаунтом!'));
    loadUserInventory(tradeUrlInput, true);

    setTimeout(() => {
      setTradeUrlSuccess(null);
    }, 4500);
  };

  const toggleSelectSkin = (id: string) => {
    setSelectedSkinIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedSkinIds(new Set(filteredSkins.map(s => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedSkinIds(new Set());
  };

  // Filtered & Sorted skins
  const filteredSkins = useMemo(() => {
    return skins.filter(skin => {
      // Category filter
      if (activeCategory === 'knife-gloves') {
        if (skin.category !== 'Knife' && skin.category !== 'Gloves') return false;
      } else if (activeCategory === 'rifles') {
        if (skin.category !== 'Rifle' && skin.category !== 'Sniper') return false;
      } else if (activeCategory === 'pistols') {
        if (skin.category !== 'Pistol') return false;
      } else if (activeCategory === 'stattrak') {
        if (!skin.isStatTrak) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = skin.name.toLowerCase().includes(query);
        const matchesWeapon = skin.weapon.toLowerCase().includes(query);
        const matchesSkin = skin.skinName.toLowerCase().includes(query);
        if (!matchesName && !matchesWeapon && !matchesSkin) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'float-asc') return a.float - b.float;
      return 0;
    });
  }, [skins, activeCategory, searchQuery, sortBy]);

  // Inventory Valuations
  const totalInventoryValue = useMemo(() => {
    return skins.reduce((acc, s) => acc + s.price, 0);
  }, [skins]);

  const selectedTotalValue = useMemo(() => {
    return skins
      .filter(s => selectedSkinIds.has(s.id))
      .reduce((acc, s) => acc + s.price, 0);
  }, [skins, selectedSkinIds]);

  const selectedSkinsList = useMemo(() => {
    return skins.filter(s => selectedSkinIds.has(s.id));
  }, [skins, selectedSkinIds]);

  const handleCashoutSelected = () => {
    if (selectedSkinIds.size === 0) return;
    setIsTradeModalOpen(true);
  };

  const handleDepositTradeCompleted = (tradeSession: DepositTradeSession) => {
    updateBalance(tradeSession.totalValue);

    addTransaction({
      type: 'sale',
      title: language === "EN" ? `Deposit ${tradeSession.skins.length} skins (Bot: ${tradeSession.bot.personaName})` : (language === "RU" ? `Депозит ${tradeSession.skins.length} скинов (Бот: ${tradeSession.bot.personaName})` : `Депозит ${tradeSession.skins.length} скінів (Бот: ${tradeSession.bot.personaName})`),
      amount: tradeSession.totalValue,
      status: 'completed',
      method: 'Steam Escrow Bot',
      destinationMasked: language === "EN" ? `Code: ${tradeSession.securityCode}` : `Код: ${tradeSession.securityCode}`,
      itemsCount: tradeSession.skins.length,
      txHash: tradeSession.txId,
      tradeOfferId: tradeSession.txId,
    });

    setSkins(prev => prev.filter(s => !selectedSkinIds.has(s.id)));
    setSelectedSkinIds(new Set());
    setIsTradeModalOpen(false);
  };

  const handleExecuteWithdraw = () => {
    if (withdrawAmount <= 0) return;

    setIsProcessingWithdraw(true);

    setTimeout(() => {
      const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const activeMethodName = selectedPaymentMethod?.name || withdrawMethod;
      const activeMethodId = selectedPaymentMethod?.id || 'mir';

      if (selectedTotalValue > 0) {
        // Sold selected skins
        addTransaction({
          type: 'sale',
          title: ct('history.typeSale') + ` (${selectedSkinIds.size} CS2)`,
          amount: selectedTotalValue,
          status: 'completed',
          method: activeMethodName,
          destinationMasked: withdrawDestination,
          itemsCount: selectedSkinIds.size,
          txHash: txId,
        });
        setSelectedSkinIds(new Set());
      } else {
        updateBalance(-withdrawAmount);
        addTransaction({
          type: 'payout',
          title: ct('history.typePayout') + ` (${activeMethodName})`,
          amount: withdrawAmount,
          status: 'completed',
          method: activeMethodName,
          destinationMasked: withdrawDestination,
          itemsCount: 1,
          txHash: txId,
        });
      }

      setIsProcessingWithdraw(false);
      setIsWithdrawing(false);

      // Trigger Live Payout Timer Modal with real-time countdown!
      setPayoutSession({
        txId,
        amount: withdrawAmount,
        methodName: activeMethodName,
        methodId: activeMethodId,
        destination: withdrawDestination,
        timestamp: Date.now(),
      });
      setIsPayoutTimerOpen(true);
    }, 600);
  };

  // If user is not authenticated, show a clean authorization screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A0E] text-white flex flex-col justify-between">
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
              <span>{ct('cabinet.home')}</span>
            </button>
          </div>
        </header>

        <div className="max-w-md mx-auto text-center px-4 py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <svg className="w-8 h-8 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] mb-3">
            {language === 'EN' ? 'Sign in to Personal Cabinet' : (language === 'RU' ? 'Вход в Личный кабинет' : 'Вхід в Особистий кабінет')}
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {language === 'EN' 
              ? 'To view your balance, payout history, and instantly load your CS2 inventory, sign in via official Valve Steam OpenID.' 
              : (language === 'RU' ? 'Для просмотра баланса, истории выплат и авто-загрузки вашего инвентаря CS2 войдите через официальный Valve Steam OpenID.' : 'Для перегляду балансу, історії виплат та автоматичного завантаження вашого інвентарю CS2 увійдіть через Valve Steam OpenID.')}
          </p>

          <button
            onClick={loginWithSteam}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
            <span>{language === 'EN' ? 'Sign in with STEAM' : (language === 'RU' ? 'Войти через STEAM' : 'Увійти через STEAM')}</span>
          </button>
        </div>

        <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500 font-['JetBrains_Mono']">
          © 2026 SkinToCash Technologies Ltd. {language === 'EN' ? 'All rights reserved.' : (language === 'RU' ? 'Все права защищены.' : 'Всі права захищено.')}
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
    ? (language === 'EN' ? 'Online' : (language === 'RU' ? 'В сети (Online)' : 'У мережі (Online)'))
    : user.personastate === 0 
    ? (language === 'EN' ? 'Offline' : (language === 'RU' ? 'Не в сети' : 'Не в мережі'))
    : (language === 'EN' ? 'Playing Counter-Strike 2' : (language === 'RU' ? 'В Counter-Strike 2' : 'У Counter-Strike 2'));

  // Check if current user has verified Trade URL
  const tradeUrlInfo = parseSteamTradeUrl(user.tradeUrl || '');
  const isTradeUrlAttached = Boolean(tradeUrlInfo.isValid && user.tradeUrl);

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Navigation Header for Cabinet Page */}
      <header className="sticky top-0 z-40 bg-[#070A0E]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-nowrap w-full">
          
          {/* Left: Brand Logo + Back to Home Button */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <div 
              onClick={onNavigateHome}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
            >
              <LogoIcon size={32} />
              <div className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl text-white flex items-center shrink-0">
                <span>SkinTo</span>
                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Cash</span>
              </div>
            </div>

            <div className="h-5 w-px bg-white/10 hidden sm:block shrink-0" />

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['Space_Grotesk'] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
              title={ct("cabinet.home")}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{ct("cabinet.home")}</span>
            </button>

            <button
              onClick={() => {
                window.history.pushState({}, '', '/p2p');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 border border-emerald-500/30 text-xs font-['Space_Grotesk'] font-semibold text-emerald-300 hover:text-white transition-all cursor-pointer shrink-0"
              title={language === "EN" ? "P2P Market" : (language === "RU" ? "P2P Рынок" : "P2P Ринок")}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{language === "EN" ? "P2P Market" : (language === "RU" ? "P2P Рынок" : "P2P Ринок")}</span>
            </button>
          </div>

          {/* Right Action Tools: Language + Currency + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
              title={ct("cabinet.logout")}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ct("cabinet.logout")}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7">
        
        {/* Breadcrumb / Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-slate-400 mb-1">
              <button onClick={onNavigateHome} className="hover:text-emerald-400 transition-colors">
                {language === "EN" ? "Home" : (language === "RU" ? "Главная" : "Головна")}
              </button>
              <span>/</span>
              <span className="text-emerald-400">{ct("cabinet.title")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
              {ct("cabinet.title")}: {user.personaname}
            </h1>
          </div>

          <button
            onClick={() => {
              const target = user.tradeUrl || user.steamId64;
              onLoadInventoryAndGoHome(target);
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{language === "EN" ? "Value on Homepage" : (language === "RU" ? "Оценить на главной" : "Оцінити на головній")}</span>
          </button>
        </div>

        {/* Master User Profile Header Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-[#0B1017] border border-white/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.08)] overflow-hidden">
          <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Avatar + Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-teal-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] overflow-hidden">
                  <img
                    src={user.avatarfull || user.avatar}
                    alt={user.personaname}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
                {/* Status Dot */}
                <span 
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B1017] ${statusColor} shadow-[0_0_10px_rgba(16,185,129,0.9)]`} 
                  title={statusLabel}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
                    {user.personaname}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 font-['JetBrains_Mono']">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Steam Verified
                  </span>
                  {user.loccountrycode && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] font-['JetBrains_Mono'] text-slate-300 uppercase">
                      🇺🇦 {user.loccountrycode}
                    </span>
                  )}
                </div>

                {/* SteamID and Profile URL */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <button
                    onClick={() => handleCopy(user.steamId64, 'steamid')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/[0.08] hover:border-emerald-500/40 text-[11px] font-['JetBrains_Mono'] text-slate-300 hover:text-white transition-all cursor-pointer group"
                  >
                    <span className="text-slate-500">SteamID:</span>
                    <span>{user.steamId64}</span>
                    {copiedField === 'steamid' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>

                  <a
                    href={user.profileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-[11px] font-['JetBrains_Mono'] text-slate-300 hover:text-white transition-all"
                  >
                    <span>{language === "EN" ? "Steam Profile" : (language === "RU" ? "Профиль в Steam" : "Профіль у Steam")}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 font-['JetBrains_Mono']">
                    <Award className="w-3 h-3 text-amber-400" />
                    {ct("cabinet.steamLevel")} {user.steamLevel || 1}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 font-['JetBrains_Mono']">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {language === "EN" ? "VAC: Clean (No Bans)" : (language === "RU" ? "VAC: Без блокировок" : "VAC: Без блокувань")}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-['JetBrains_Mono']">
                    {ct("cabinet.memberSince")} {user.joinedAt || "2024"}
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Metrics Capsule */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex-1 md:flex-initial text-left md:text-right">
                <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 mb-0.5">
                  {ct("cabinet.balance")}
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                  {formatPrice(user.balance || 0)}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex-1 md:flex-initial text-left md:text-right">
                <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 mb-0.5">
                  {language === "EN" ? "CS2 Inventory Value:" : (language === "RU" ? "Оценка CS2 инвентаря:" : "Оцінка CS2 інвентарю:")}
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {formatPrice(totalInventoryValue)}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Trade URL Status / Missing Banner (Strict verification alert) */}
        {!isTradeUrlAttached ? (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#0B1017] border border-amber-500/40 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                    <span>{language === 'EN' ? 'Link your Steam Trade URL' : (language === 'RU' ? 'Привяжите ваш Steam Trade URL' : 'Прив\'яжіть ваш Steam Trade URL')}</span>
                    <span className="text-[10px] font-['JetBrains_Mono'] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                      {language === "EN" ? "Ownership Check" : (language === "RU" ? "Проверка владельца" : "Перевірка власності")}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {language === 'EN' ? <>To receive automated trades from our bots, enter your personal Trade URL. The service verifies with your SteamID (<strong>{user.steamId64}</strong>) that the link belongs to you. <strong>Third-party links cannot be linked!</strong></> : language === 'RU' ? <>Для получения автоматических обменов укажите персональный Trade URL. Сервис проверит по вашему SteamID (<strong>{user.steamId64}</strong>), что трейдлинк принадлежит вам. <strong>Чужой трейдлинк привязать нельзя!</strong></> : <>Для отримання автоматичних трейдів від ботів вкажіть ваш персональний Trade URL. Сервіс перевірить за вашим SteamID (<strong>{user.steamId64}</strong>), чи трейдлінк дійсно належить вам. <strong>Сторонній трейдлінк прив'язати не можна!</strong></>}
                  </p>
                </div>
              </div>

              {/* Quick Input Bar */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={tradeUrlInput}
                  onChange={(e) => setTradeUrlInput(e.target.value)}
                  placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-xs min-w-[280px] sm:min-w-[340px] focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={handleSaveTradeUrl}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  {language === "EN" ? "Verify & Save" : (language === "RU" ? "Проверить и сохранить" : "Перевірити та зберегти")}
                </button>
              </div>
            </div>

            {/* Error or Success notification */}
            {tradeUrlError && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{tradeUrlError}</span>
                </span>
                <a
                  href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-400 hover:text-emerald-300 whitespace-nowrap"
                >
                  {language === "EN" ? "Where to find my Trade URL? →" : (language === "RU" ? "Где найти мой Trade URL? →" : "Де знайти мій Trade URL? →")}
                </a>
              </div>
            )}

            {tradeUrlSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{tradeUrlSuccess}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-['Space_Grotesk'] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === "EN" ? "Your official Steam Trade URL is verified and linked" : (language === "RU" ? "Ваш официальный Steam Trade URL подтвержден и привязан" : "Ваш офіційний Steam Trade URL верифіковано та закріплено")}</span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-slate-400 hidden sm:inline">
                (Partner: {tradeUrlInfo.partnerId})
              </span>
            </div>

            <button
              onClick={() => setActiveTab('trade')}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-['JetBrains_Mono'] cursor-pointer"
            >
              {language === "EN" ? "Change or view →" : (language === "RU" ? "Изменить или просмотреть →" : "Змінити або переглянути →")}
            </button>
          </div>
        )}

        {/* Tab Navigation Menu: INVENTORY IS FIRST! */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
          {/* TAB 1: Мій інвентар CS2 */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{ct("tab.inventory")} ({skins.length})</span>
          </button>

          {/* TAB 2: Гаманець & Баланс */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{ct("tab.wallet")}</span>
          </button>

          {/* TAB 3: Steam Trade URL */}
          <button
            onClick={() => setActiveTab('trade')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'trade'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>{ct("tab.trade")}</span>
          </button>

          {/* TAB 4: Історія транзакцій */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{ct("tab.history")} ({transactions.length})</span>
          </button>

          {/* TAB 5: Безпека */}
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{ct("tab.security")}</span>
          </button>
        </div>

        {/* TAB 1 CONTENT: AUTOMATICALLY LOADED CS2 INVENTORY (DEFAULT VIEW) */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Inventory Valuation Header Strip */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0B1017] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === "EN" ? "Automatically synced CS2 Inventory" : (language === "RU" ? "Автоматически синхронизированный инвентарь CS2" : "Автоматично синхронізований інвентар CS2")}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {formatPrice(totalInventoryValue)}
                  <span className="text-xs text-slate-400 font-normal ml-3">
                    ({skins.length} {language === "EN" ? "available items" : (language === "RU" ? "доступных предметов" : "доступних предметів")})
                  </span>
                </div>
              </div>

              {/* Selection Summary & Cashout CTA Button */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400 font-['JetBrains_Mono']">
                    {language === "EN" ? "Selected: " : (language === "RU" ? "Выбрано: " : "Обрано: ")}<strong className="text-white">{selectedSkinIds.size}</strong> {language === "EN" ? "skins" : (language === "RU" ? "скинов" : "скінів")}
                  </div>
                  <div className="text-base font-bold font-['JetBrains_Mono'] text-emerald-400">
                    {formatPrice(selectedTotalValue)}
                  </div>
                </div>

                <button
                  disabled={selectedSkinIds.size === 0}
                  onClick={handleCashoutSelected}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === "EN" ? "Sell Selected" : (language === "RU" ? "Продать выбранные" : "Продати обрані")} ({formatPrice(selectedTotalValue)})</span>
                </button>
              </div>
            </div>

            {/* Inventory Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {language === "EN" ? "All" : (language === "RU" ? "Все" : "Всі")} ({skins.length})
                </button>

                <button
                  onClick={() => setActiveCategory('knife-gloves')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'knife-gloves'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {language === "EN" ? "Knives & Gloves" : (language === "RU" ? "Ножи и перчатки" : "Ножі та рукавиці")}
                </button>

                <button
                  onClick={() => setActiveCategory('rifles')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'rifles'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {language === "EN" ? "Rifles & AWP" : (language === "RU" ? "Винтовки и AWP" : "Гвинтівки та AWP")}
                </button>

                <button
                  onClick={() => setActiveCategory('pistols')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'pistols'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {language === "EN" ? "Pistols" : (language === "RU" ? "Пистолеты" : "Пістолети")}
                </button>

                <button
                  onClick={() => setActiveCategory('stattrak')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'stattrak'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  StatTrak™
                </button>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "EN" ? "Search skin..." : (language === "RU" ? "Поиск скина..." : "Пошук скіна...")}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-['JetBrains_Mono'] focus:border-emerald-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => setSortBy(prev => prev === 'price-desc' ? 'price-asc' : prev === 'price-asc' ? 'float-asc' : 'price-desc')}
                  title={language === "EN" ? "Change sorting" : (language === "RU" ? "Изменить сортировку" : "Змінити сортування")}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">
                    {sortBy === 'price-desc' ? (language === 'EN' ? 'Price: ↓' : (language === 'RU' ? 'Цена: ↓' : 'Ціна: ↓')) : sortBy === 'price-asc' ? (language === 'EN' ? 'Price: ↑' : (language === 'RU' ? 'Цена: ↑' : 'Ціна: ↑')) : 'Float: ↑'}
                  </span>
                </button>

                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{language === "EN" ? "Select All" : (language === "RU" ? "Выбрать все" : "Вибрати все")}</span>
                </button>

                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{language === "EN" ? "Deselect" : (language === "RU" ? "Снять" : "Зняти")}</span>
                </button>
              </div>
            </div>

            {/* Private Inventory Notice */}
            {inventoryStatus === 'private' && (
              <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {language === "EN" ? "Your Steam inventory is currently private" : (language === "RU" ? "Ваш инвентарь в Steam сейчас скрыт (приватный)" : "Ваш інвентар у Steam наразі приватний")}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {language === "EN" ? "Steam hides inventories by default. To value and sell skins, set your inventory to public in Steam privacy settings." : (language === "RU" ? "Steam по умолчанию скрывает инвентарь. Чтобы оценить и продать скины, откройте доступ в настройках приватности Steam." : "Steam за замовчуванням приховує інвентар. Щоб оцінити та продати скіни, відкрийте доступ до інвентарю в налаштуваннях приватності Steam.")}
                </p>
                <a
                  href="https://steamcommunity.com/id/me/edit/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-['Space_Grotesk']"
                >
                  <span>{language === "EN" ? "Open Steam Privacy Settings" : (language === "RU" ? "Открыть настройки приватности Steam" : "Відкрити налаштування приватності Steam")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Skins Grid */}
            {isLoadingInventory ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <div className="text-sm font-['Space_Grotesk'] text-slate-300">
                  {language === "EN" ? "Loading inventory of your Steam account..." : (language === "RU" ? "Загружаем инвентарь вашего аккаунта Steam..." : "Завантажуємо інвентар вашого акаунта Steam...")}
                </div>
              </div>
            ) : filteredSkins.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-['JetBrains_Mono'] bg-[#0B1017] rounded-3xl border border-white/[0.05]">
                {language === "EN" ? "No items found for the selected filters." : (language === "RU" ? "Предметов не найдено по заданным фильтрам." : "Предметів не знайдено за заданими фільтрами.")}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {filteredSkins.map((skin) => {
                  const isSelected = selectedSkinIds.has(skin.id);
                  return (
                    <div
                      key={skin.id}
                      onClick={() => toggleSelectSkin(skin.id)}
                      className={`relative group rounded-2xl p-3 sm:p-4 bg-[#0B1017] border transition-all cursor-pointer select-none flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/20 ring-1 ring-emerald-500/50'
                          : 'border-white/[0.07] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Selection Badge Checkbox */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/80 border border-white/20 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Wear & StatTrak badges */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 uppercase">
                          {skin.wear}
                        </span>
                        {skin.isStatTrak && (
                          <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">
                            ST™
                          </span>
                        )}
                      </div>

                      {/* Skin Thumbnail Image */}
                      <div className="relative h-24 sm:h-28 flex items-center justify-center my-2">
                        <SkinImage
                          src={skin.image}
                          fallback={skin.fallbackImage}
                          alt={skin.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="pt-2 border-t border-white/[0.05]">
                        <div className="text-[11px] text-slate-400 font-['Space_Grotesk'] truncate">
                          {skin.weapon}
                        </div>
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] truncate">
                          {skin.skinName}
                        </div>
                        <div className="text-sm font-extrabold font-['JetBrains_Mono'] text-emerald-400 mt-1">
                          {formatPrice(skin.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: WALLET & BALANCES */}
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
                    {language === "EN" ? "Available SkinToCash Balance" : (language === "RU" ? "Доступный баланс SkinToCash" : "Доступний баланс SkinToCash")}
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['JetBrains_Mono'] text-white tracking-tight drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    {formatPrice(user.balance || 0)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-xl">
                    {language === "EN" ? "Funds are ready for instant cashout to Russian cards (MIR, SBP, Sber, T-Bank), Visa/Mastercard cards, or Crypto (USDT) without delays." : (language === "RU" ? "Средства готовы к моментальному выводу на карты РФ (МИР, СБП, Сбер, Т-Банк), карты Visa/Mastercard или криптовалюту (USDT) без задержек." : "Гроші готові до моментальної виплати на картки МИР/СБП, картки Visa/Mastercard або криптовалюту без затримок.")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsWithdrawing(!isWithdrawing)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    <span>{ct("cabinet.withdraw")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white font-['Space_Grotesk'] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{ct("tab.inventory")} ({skins.length})</span>
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
                    <div className="mb-4">
                      <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                        {ct('withdraw.title')}
                      </h3>
                      <p className="text-xs text-slate-400 font-['Space_Grotesk'] mt-0.5">
                        {ct('withdraw.subtitle')}
                      </p>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-4">
                      <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 font-bold mb-1.5">
                        {ct('withdraw.amountLabel')}
                      </label>
                      <div className="relative max-w-sm">
                        <input
                          type="number"
                          min="5"
                          max={user.balance || 0}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Math.max(1, Number(e.target.value)))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setWithdrawAmount(user.balance || 0)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    {/* Visual Payment Methods with Logos (No Dropdown!) */}
                    <div className="mb-5">
                      <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 font-bold mb-2">
                        {ct('withdraw.methodLabel')}
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {cabinetPaymentMethods.map((m) => {
                          const isSelected = selectedPaymentMethod.id === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setSelectedPaymentMethod(m);
                                setWithdrawMethod(m.name);
                              }}
                              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                                  : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                              }`}
                            >
                              <PaymentMethodIcon id={m.icon || m.id} size={28} />
                              <div className="overflow-hidden min-w-0 flex-1">
                                <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                                  {m.name}
                                </div>
                                <div className="text-[10px] text-emerald-400 font-['JetBrains_Mono'] truncate">
                                  {m.badge} • {m.speed}
                                </div>
                              </div>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Destination Account / Card Input */}
                    <div className="mb-5">
                      <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 font-bold mb-1.5">
                        {selectedPaymentMethod.id === 'mir' || selectedPaymentMethod.id === 'sber' || selectedPaymentMethod.id === 'tbank'
                          ? ct('withdraw.destMirLabel')
                          : selectedPaymentMethod.id === 'sbp'
                          ? ct('withdraw.destSbpLabel')
                          : selectedPaymentMethod.category === 'crypto'
                          ? ct('withdraw.destCryptoLabel')
                          : ct('withdraw.destCardLabel')}
                      </label>
                      <input
                        type="text"
                        value={withdrawDestination}
                        onChange={(e) => setWithdrawDestination(e.target.value)}
                        placeholder={
                          selectedPaymentMethod.id === 'mir' || selectedPaymentMethod.id === 'sber' || selectedPaymentMethod.id === 'tbank'
                            ? '2200 0000 0000 0000'
                            : selectedPaymentMethod.id === 'sbp'
                            ? '+7 (999) 000-00-00'
                            : selectedPaymentMethod.id === 'btc'
                            ? 'bc1q...'
                            : selectedPaymentMethod.category === 'crypto'
                            ? 'TXj... (USDT TRC20)'
                            : '4441 0000 0000 0000 (Visa/Mastercard)'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setIsWithdrawing(false)}
                        className="px-4 py-2.5 text-xs font-['Space_Grotesk'] text-slate-400 hover:text-white"
                      >
                        {ct('withdraw.cancel')}
                      </button>

                      <button
                        disabled={isProcessingWithdraw || (user.balance || 0) < withdrawAmount}
                        onClick={handleExecuteWithdraw}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        {isProcessingWithdraw ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        <span>{ct('withdraw.confirm')} ({formatPrice(withdrawAmount)})</span>
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
                  <span>{ct("metrics.totalWithdrawn")}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {formatPrice(user.totalWithdrawn || 420.00)}
                </div>
                <div className="text-xs text-emerald-400/80 mt-1 font-['JetBrains_Mono']">
                  {ct("metrics.totalSuccess")}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B1017] border border-white/[0.07] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                  <span>{ct("metrics.completedDeals")}</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {user.totalSales || 7} {language === "EN" ? "deals" : (language === "RU" ? "сделок" : "угод")}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  {ct("metrics.avgSpeed")}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B1017] border border-white/[0.07] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                  <span>{ct("metrics.fee")}</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                  0.0% (VIP)
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  {ct("metrics.promotional")}
                </div>
              </div>
            </div>

            {/* Official Steam Deposit Bot Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0B1017] border border-emerald-500/20 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={OFFICIAL_STEAM_BOT.avatar}
                      alt={OFFICIAL_STEAM_BOT.personaName}
                      className="w-14 h-14 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B1017]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold font-['Space_Grotesk'] text-white">
                        {ct("bot.title")}: {OFFICIAL_STEAM_BOT.personaName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] font-['JetBrains_Mono'] text-emerald-400 font-semibold border border-emerald-500/25">
                        {language === "EN" ? "Online • Auto-accept" : (language === "RU" ? "В сети • Авто-прием" : "Онлайн • Авто-прийом")}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-['JetBrains_Mono'] mt-1 flex flex-wrap items-center gap-3">
                      <span>SteamID: {OFFICIAL_STEAM_BOT.steamId64}</span>
                      <span>•</span>
                      <span>{language === "EN" ? "Bot inventory: " : (language === "RU" ? "Предметов у бота: " : "Предметів у боті: ")}{OFFICIAL_STEAM_BOT.inventoryCount} {language === "EN" ? "CS2 skins" : (language === "RU" ? "CS2 скинов" : "CS2 скінів")}</span>
                      <span>•</span>
                      <span>{language === "EN" ? "Level: " : (language === "RU" ? "Уровень: " : "Рівень: ")}{OFFICIAL_STEAM_BOT.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <a
                    href={OFFICIAL_STEAM_BOT.tradeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-['Space_Grotesk'] font-medium text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === "EN" ? "Open Bot Trade" : (language === "RU" ? "Открыть трейд бота" : "Відкрити трейд бота")}</span>
                  </a>

                  <button
                    onClick={() => {
                      if (selectedSkinIds.size > 0) {
                        setIsTradeModalOpen(true);
                      } else {
                        setActiveTab('inventory');
                      }
                    }}
                    className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{selectedSkinIds.size > 0 ? (language === 'EN' ? `Deposit Selected (${formatPrice(selectedTotalValue)})` : (language === 'RU' ? `Депозит выбранных (${formatPrice(selectedTotalValue)})` : `Депозит обраних (${formatPrice(selectedTotalValue)})`)) : (language === 'EN' ? 'Deposit skins to balance' : (language === 'RU' ? 'Депозит скинов на баланс' : 'Депозит скінів на баланс'))}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-emerald-950/20 border border-cyan-500/20 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold font-['Space_Grotesk'] text-cyan-400 mb-1">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  {language === "EN" ? "SkinToCash Referral Program" : (language === "RU" ? "Реферальная программа SkinToCash" : "Реферальна програма SkinToCash")}
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {language === "EN" ? <>Share your referral link and earn <strong className="text-emerald-400">+1.5%</strong> from every trade made by your friends lifetime!</> : language === "RU" ? <>Делитесь вашей реферальной ссылкой и получайте <strong className="text-emerald-400">+1.5%</strong> с каждой сделки ваших друзей пожизненно!</> : <>Діліться вашим реферальним лінком та отримуйте <strong className="text-emerald-400">+1.5%</strong> з кожного трейду ваших друзів довічно!</>}
                </p>
              </div>

              <button
                onClick={() => handleCopy(`https://skintocash.com/ref/${user.steamId64}`, 'ref')}
                className="shrink-0 px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-['Space_Grotesk'] font-bold text-cyan-300 flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedField === 'ref' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{language === "EN" ? "Link copied!" : (language === "RU" ? "Ссылка скопирована!" : "Посилання скопійовано!")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{language === "EN" ? "Copy Referral Link" : (language === "RU" ? "Скопировать реф-ссылку" : "Скопіювати реф-лінк")}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: STEAM TRADE URL SETTINGS (WITH STRICT OWNERSHIP VERIFICATION) */}
        {activeTab === 'trade' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/[0.08] space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
                  <span>{language === "EN" ? "Steam Trade URL (Trade Offer Link)" : (language === "RU" ? "Steam Trade URL (Ссылка на обмен)" : "Steam Trade URL (Посилання на обмін)")}</span>
                  <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {language === "EN" ? "Owner Verification" : (language === "RU" ? "Проверка владельца" : "Перевірка власника")}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                  {language === 'EN' ? <>Trade URL is required to receive trade offers from our automated bots. Our service strictly verifies that the specified Trade URL belongs to your account <strong>{user.personaname} (SteamID: {user.steamId64})</strong>. Third-party trade links cannot be linked.</> : language === 'RU' ? <>Trade URL необходим для получения трейд-офферов от наших ботов. Наш сервис проверяет, что указанный Trade URL принадлежит именно вашему аккаунту <strong>{user.personaname} (SteamID: {user.steamId64})</strong>. Сторонний трейдлинк привязать нельзя.</> : <>Trade URL потрібен для отримання трейд-оферів від наших торгових ботів. Наш сервіс автоматично перевіряє, що вказаний Trade URL дійсно належить вашому акаунту <strong>{user.personaname} (SteamID: {user.steamId64})</strong>. Сторонній трейдлінк прив'язати неможливо.</>}
                </p>
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 mb-2 font-semibold">
                  {language === "EN" ? "Your personal Trade URL:" : (language === "RU" ? "Ваш персональный Trade URL:" : "Ваш персональний Trade URL:")}
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
                    <Check className="w-4 h-4" />
                    <span>{language === "EN" ? "Verify and Save" : (language === "RU" ? "Проверить и сохранить" : "Перевірити та зберегти")}</span>
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {tradeUrlError && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-white block mb-0.5">{language === "EN" ? "Trade link validation error:" : (language === "RU" ? "Ошибка валидации трейдлинка:" : "Помилка валідації трейдлінку:")}</strong>
                    {tradeUrlError}
                  </div>
                </div>
              )}

              {tradeUrlSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{tradeUrlSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/[0.05]">
                <a
                  href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium font-['Space_Grotesk']"
                >
                  <span>{language === "EN" ? "Where to find your Steam Trade URL?" : (language === "RU" ? "Где найти свой Steam Trade URL?" : "Де знайти свій Steam Trade URL?")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Account info pill */}
                <div className="text-xs text-slate-400 font-['JetBrains_Mono']">
                  {language === "EN" ? "Your SteamID64:" : (language === "RU" ? "Ваш SteamID64:" : "Ваш SteamID64:")} <span className="text-slate-200">{user.steamId64}</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">{language === "EN" ? "Security Memo: " : (language === "RU" ? "Памятка безопасности: " : "Памʼятка безпеки: ")}</strong>
                  {language === "EN" ? "SkinToCash never asks for your Steam Web API Key or Steam Guard recovery codes under any circumstance. All trades are confirmed solely by you inside your Steam mobile app." : (language === "RU" ? "SkinToCash ни при каких условиях не запрашивает ваш Steam Web API ключ или коды восстановления Steam Guard. Все обмены подтверждаются исключительно вами в мобильном приложении Steam." : "SkinToCash ніколи та ні за яких умов не просить ваш Steam Web API ключ чи код відновлення Steam Guard. Усі обміни підтверджуються виключно вами у вашому мобільному додатку Steam.")}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                {language === "EN" ? "Transaction History" : (language === "RU" ? "История операций" : "Історія операцій")} ({transactions.length})
              </h3>
              <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                {language === "EN" ? "Protected payouts via banking gateways and Web3" : (language === "RU" ? "Защищенные выплаты через банковские шлюзы и Web3" : "Захищені виплати через банківські шлюзи та Web3")}
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
                      {language === "EN" ? "Paid Out" : (language === "RU" ? "Выплачено" : "Виплачено")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/[0.08] space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-1.5">
                  {language === "EN" ? "Security & Active Sessions" : (language === "RU" ? "Безопасность и активные сессии" : "Безпека та активні сеанси")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {language === "EN" ? "Information about connection status and cryptographic authentication through official Valve OpenID service." : (language === "RU" ? "Информация о состоянии соединения и криптографической аутентификации через официальный OpenID сервис корпорации Valve." : "Інформація про стан вашого зʼєднання та криптографічну автентифікацію через офіційний OpenID сервіс корпорації Valve.")}
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
                        {language === "EN" ? "Account authenticity verified by Valve" : (language === "RU" ? "Подлинность аккаунта подтверждена Valve" : "Автентичність облікового запису підтверджена Valve")}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {language === "EN" ? "Active" : (language === "RU" ? "Активно" : "Активно")}
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
                        {language === "EN" ? "Account protected by 2FA against unauthorized trades" : (language === "RU" ? "Аккаунт защищен 2FA от несанкционированных сделок" : "Акаунт захищено 2FA від несанкціонованих угод")}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {language === "EN" ? "Protected" : (language === "RU" ? "Защищено" : "Захищено")}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {language === "EN" ? "Official SkinToCash Domain" : (language === "RU" ? "Официальный домен SkinToCash" : "Офіційний домен SkinToCash")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {language === "EN" ? "Encrypted SSL Connection" : (language === "RU" ? "Защищенное SSL соединение" : "Захищене SSL зʼєднання")}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {language === "EN" ? "Valid" : (language === "RU" ? "Действительно" : "Дійсно")}
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
                  <span>{language === "EN" ? "End session and log out" : (language === "RU" ? "Завершить сессию и выйти из аккаунта" : "Завершити сесію та вийти з акаунту")}</span>
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
            © 2026 SkinToCash Technologies Ltd. {language === "EN" ? "All rights reserved." : (language === "RU" ? "Все права защищены." : "Всі права захищено.")}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">
              {language === "EN" ? "Home" : (language === "RU" ? "На главную" : "На головну")}
            </button>
            <span>•</span>
            <span className="text-emerald-400">{language === "EN" ? "Session:" : (language === "RU" ? "Сессия:" : "Сесія:")} {user.personaname}</span>
          </div>
        </div>
      </footer>

      {/* Official Steam Trade Offer Deposit Modal */}
      <TradeOfferModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        selectedSkins={selectedSkinsList}
        totalPayout={selectedTotalValue}
        destinationAddress={user.tradeUrl || user.steamId64}
        userTradeUrl={user.tradeUrl}
        onTradeCompleted={handleDepositTradeCompleted}
      />

      {/* Live Payout Countdown Timer Modal with Gateway Progress */}
      <PayoutTimerModal
        isOpen={isPayoutTimerOpen}
        onClose={() => setIsPayoutTimerOpen(false)}
        session={payoutSession}
      />

    </div>
  );
};
