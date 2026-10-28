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
  ArrowLeftRight,
  PackageOpen
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
  const { user, loginWithSteam, logout, updateTradeUrl, syncUserWithTradeUrl, updateBalance, transactions, addTransaction } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, currentOption } = useLanguage();
  const tc = (key: string, params?: Record<string, string | number>) => getCabinetText(language, key, params);

  // The FIRST page in profile is automatically the user's CS2 inventory!
  const [activeTab, setActiveTab] = useState<CabinetTab>('inventory');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Trade URL State & Strict Verification
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(user?.tradeUrl || '');
  const [tradeUrlError, setTradeUrlError] = useState<string | null>(null);
  const [tradeUrlSuccess, setTradeUrlSuccess] = useState<string | null>(null);

  // User CS2 Inventory State - starts empty until loaded, never shows fake demo skins
  const [skins, setSkins] = useState<CS2Skin[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState<'success' | 'private' | 'rate_limited' | 'error' | 'demo' | 'empty'>('empty');
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
    { code: 'RUB', label: 'RUB (₽)', icon: '₽' },
    { code: 'KZT', label: 'KZT (₸)', icon: '₸' },
  ];

  // Auto-load the user's Steam CS2 Inventory on mount
  const loadUserInventory = useCallback(async (target: string, force = false) => {
    if (!target) return;
    setIsLoadingInventory(true);
    try {
      const res = await fetchSteamInventory(target, force);
      setIsLoadingInventory(false);

      if (res.items && res.items.length > 0) {
        setSkins(res.items);
        setSelectedSkinIds(new Set(res.items.slice(0, 2).map(s => s.id)));
        setInventoryStatus('success');
      } else if (res.status === 'private') {
        setSkins([]);
        setSelectedSkinIds(new Set());
        setInventoryStatus('private');
      } else {
        setSkins([]);
        setSelectedSkinIds(new Set());
        setInventoryStatus(res.status || 'empty');
      }
    } catch (err) {
      console.warn('Failed to load user inventory in cabinet:', err);
      setIsLoadingInventory(false);
      setInventoryStatus('error');
      setSkins([]);
      setSelectedSkinIds(new Set());
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
   * Saves and verifies Trade URL, connects it to the user account, and fetches real Steam items.
   */
  const handleSaveTradeUrl = async () => {
    setTradeUrlError(null);
    setTradeUrlSuccess(null);

    if (!user) return;

    const trimmed = tradeUrlInput.trim();
    if (!trimmed) {
      setTradeUrlError(tc('cabinet.errEnterTradeUrl'));
      return;
    }

    const parsed = parseSteamTradeUrl(trimmed);
    if (!parsed.isValid || !parsed.steamId64) {
      setTradeUrlError('Некоректний формат Trade URL. Посилання має містити partner=... та token=...');
      return;
    }

    setIsLoadingInventory(true);

    try {
      if (syncUserWithTradeUrl) {
        await syncUserWithTradeUrl(trimmed);
      } else {
        updateTradeUrl(trimmed);
      }

      setTradeUrlSuccess(tc('cabinet.successTradeUrl'));
      await loadUserInventory(trimmed, true);
    } catch (err: any) {
      console.warn('Error saving trade url:', err);
      setTradeUrlError(err?.message || 'Помилка оновлення Trade URL');
      setIsLoadingInventory(false);
    }

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
      title: tc('cabinet.depositTitle', { count: tradeSession.skins.length, bot: tradeSession.bot.personaName }),
      amount: tradeSession.totalValue,
      status: 'completed',
      method: 'Steam Escrow Bot',
      destinationMasked: tc('cabinet.depositCode', { code: tradeSession.securityCode }),
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
            {tc('cabinet.signInTitle')}
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {tc('cabinet.signInSubtitle')}
          </p>

          <button
            onClick={loginWithSteam}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
            <span>{tc('cabinet.signInSteam')}</span>
          </button>
        </div>

        <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500 font-['JetBrains_Mono']">
          © 2026 SkinToCash Technologies Ltd. {tc('cabinet.allRights')}
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
    ? tc('cabinet.statusOnline')
    : user.personastate === 0 
    ? tc('cabinet.statusOffline')
    : tc('cabinet.statusPlaying');

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
              title={tc('cabinet.p2pMarket')}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{tc('cabinet.p2pMarket')}</span>
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
                {tc('cabinet.home')}
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
            <span>{tc('cabinet.valueOnHome')}</span>
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
                    <span>{tc('cabinet.steamProfile')}</span>
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
                    {tc('cabinet.vacClean')}
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
                  {tc('cabinet.invValue')}
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
                    <span>{tc('cabinet.linkTradeUrl')}</span>
                    <span className="text-[10px] font-['JetBrains_Mono'] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                      {tc('cabinet.ownerCheck')}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    <>{tc('cabinet.linkTradeUrlDesc', { steamId: user.steamId64 })}</>
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
                  {tc('cabinet.verifyAndSave')}
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
                  {tc('trade.findUrl')} →
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
              <span>{tc('cabinet.tradeUrlLinked')}</span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-slate-400 hidden sm:inline">
                (Partner: {tradeUrlInfo.partnerId})
              </span>
            </div>

            <button
              onClick={() => setActiveTab('trade')}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-['JetBrains_Mono'] cursor-pointer"
            >
              {tc('cabinet.changeOrView')}
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
                  {tc('cabinet.autoSyncedInv')}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] text-white">
                  {formatPrice(totalInventoryValue)}
                  <span className="text-xs text-slate-400 font-normal ml-3">
                    ({tc('cabinet.availableItems', { count: skins.length })})
                  </span>
                </div>
              </div>

              {/* Selection Summary & Cashout CTA Button */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400 font-['JetBrains_Mono']">
                    {tc('inv.selectedItems')} <strong className="text-white">{selectedSkinIds.size}</strong> {tc('sandbox.items')}
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
                  <span>{tc('inv.btnSell')} ({formatPrice(selectedTotalValue)})</span>
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
                  {tc('inv.categoryAll')} ({skins.length})
                </button>

                <button
                  onClick={() => setActiveCategory('knife-gloves')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'knife-gloves'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {tc('inv.categoryKnives')}
                </button>

                <button
                  onClick={() => setActiveCategory('rifles')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'rifles'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {tc('inv.categoryRifles')}
                </button>

                <button
                  onClick={() => setActiveCategory('pistols')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === 'pistols'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {tc('inv.categoryPistols')}
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
                    placeholder={tc('inv.searchPlaceholder')}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-['JetBrains_Mono'] focus:border-emerald-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => setSortBy(prev => prev === 'price-desc' ? 'price-asc' : prev === 'price-asc' ? 'float-asc' : 'price-desc')}
                  title={tc('cabinet.changeSort')}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">
                    {sortBy === 'price-desc' ? tc('inv.sortPriceDesc') : sortBy === 'price-asc' ? tc('inv.sortPriceAsc') : 'Float: ↑'}
                  </span>
                </button>

                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{tc('cabinet.selectAll')}</span>
                </button>

                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-['Space_Grotesk'] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{tc('cabinet.deselect')}</span>
                </button>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoadingInventory ? (
              <div className="py-20 text-center space-y-3 bg-[#0B1017] rounded-3xl border border-white/[0.05]">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <div className="text-sm font-['Space_Grotesk'] text-slate-300">
                  {tc('steamModal.loading')}
                </div>
              </div>
            ) : inventoryStatus === 'private' ? (
              /* Private Inventory Notice */
              <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {tc('sandbox.privateTitle')}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {tc('sandbox.privateDesc')}
                </p>
                <div className="pt-2">
                  <a
                    href="https://steamcommunity.com/id/me/edit/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-['Space_Grotesk']"
                  >
                    <span>{tc('sandbox.openPrivacyBtn')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : filteredSkins.length === 0 ? (
              /* Empty Inventory State */
              <div className="py-16 px-6 text-center space-y-3.5 bg-[#0B1017] rounded-3xl border border-white/[0.05]">
                <PackageOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {tc('inv.empty')}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-['Space_Grotesk']">
                  У вашому CS2 інвентарі наразі немає скінів або вони знаходяться на 7-денному трейд-холді Steam.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const target = user?.tradeUrl || user?.steamId64;
                      if (target) loadUserInventory(target, true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Повторити сканування</span>
                  </button>
                  <a
                    href={user?.profileurl ? `${user.profileurl}/inventory/#730` : `https://steamcommunity.com/profiles/${user?.steamId64}/inventory/#730`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 border border-white/10 transition-colors"
                  >
                    <span>Відкрити інвентар у Steam</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
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
                    {tc('cabinet.availableBalance')}
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['JetBrains_Mono'] text-white tracking-tight drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    {formatPrice(user.balance || 0)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-xl">
                    {tc('cabinet.fundsReady')}
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
                  {user.totalSales || 7} {tc('p2p.tradesCount')}
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
                        {tc('cabinet.botOnline')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-['JetBrains_Mono'] mt-1 flex flex-wrap items-center gap-3">
                      <span>SteamID: {OFFICIAL_STEAM_BOT.steamId64}</span>
                      <span>•</span>
                      <span>{tc('cabinet.botInv')} {OFFICIAL_STEAM_BOT.inventoryCount} {tc('sandbox.items')}</span>
                      <span>•</span>
                      <span>{tc('cabinet.steamLevel')}: {OFFICIAL_STEAM_BOT.level}</span>
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
                    <span>{tc('bot.action')}</span>
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
                    <span>{selectedSkinIds.size > 0 ? tc('cabinet.depositSelected', { amount: formatPrice(selectedTotalValue) }) : tc('inv.btnSell')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-emerald-950/20 border border-cyan-500/20 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold font-['Space_Grotesk'] text-cyan-400 mb-1">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  {tc('cabinet.referralTitle')}
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  <>{tc('cabinet.referralDesc')}</>
                </p>
              </div>

              <button
                onClick={() => handleCopy(`https://skintocash.com/ref/${user.steamId64}`, 'ref')}
                className="shrink-0 px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-['Space_Grotesk'] font-bold text-cyan-300 flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedField === 'ref' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{tc('cabinet.linkCopied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{tc('cabinet.copyRefLink')}</span>
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
                  <span>{tc('trade.tabTitle')}</span>
                  <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tc('cabinet.ownerCheck')}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                  {tc('trade.desc')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 mb-2 font-semibold">
                  {tc('cabinet.yourTradeUrl')}
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
                    <span>{tc('cabinet.verifyAndSave')}</span>
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {tradeUrlError && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-white block mb-0.5">{tc('cabinet.errValidation')}</strong>
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
                  <span>{tc('trade.findUrl')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Account info pill */}
                <div className="text-xs text-slate-400 font-['JetBrains_Mono']">
                  {tc('cabinet.yourSteamId')} <span className="text-slate-200">{user.steamId64}</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">{tc('cabinet.securityMemo')}</strong>
                  {tc('cabinet.securityMemoDesc')}
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
                {tc('history.title')} ({transactions.length})
              </h3>
              <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                {tc('cabinet.historySub')}
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
                      {tc('history.statusCompleted')}
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
                  {tc('sec.title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {tc('cabinet.secDesc')}
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
                        {tc('cabinet.authValve')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {tc('cabinet.active')}
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
                        {tc('cabinet.mobileGuard')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {tc('cabinet.protected')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {tc('cabinet.officialDomain')}
                      </div>
                      <div className="text-xs text-slate-400">
                        {tc('cabinet.encryptedSsl')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {tc('cabinet.valid')}
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
                  <span>{tc('cabinet.endSession')}</span>
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
            © 2026 SkinToCash Technologies Ltd. {tc('cabinet.allRights')}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">
              {tc('cabinet.home')}
            </button>
            <span>•</span>
            <span className="text-emerald-400">{tc('cabinet.session')} {user.personaname}</span>
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
