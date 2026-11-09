import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Check, 
  Eye, 
  Search, 
  ArrowUpDown, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Gift,
  Lock,
  ExternalLink,
  AlertCircle,
  Copy,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { SkinImage } from '../components/SkinImage';
import { SkinInspectModal } from '../components/SkinInspectModal';
import { TradeOfferModal } from '../components/TradeOfferModal';
import { PaymentMethodIcon } from '../components/PaymentMethodIcon';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import { fetchSteamInventory, parseSteamTradeUrl } from '../services/steamService';
import type { CS2Skin, PaymentOption } from '../types';
import type { DepositTradeSession } from '../data/steamBot';
import { getCabinetText, getSellText } from '../data/pagesTranslations';

interface SellPageProps {
  onNavigateHome: () => void;
  onOpenSteamModal?: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onNavigateHome, onOpenSteamModal }) => {
  const { user, loginWithSteam, openCabinet, updateBalance, addTransaction } = useAuth();
  const { formatPrice, currency, setCurrency } = useCurrency();
  const { t, language } = useLanguage();
  const ts = (key: string, params?: Record<string, string | number>) => getSellText(language, key, params);

  // User skins loaded from Steam inventory
  const [skins, setSkins] = useState<CS2Skin[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'success' | 'private' | 'rate_limited' | 'error' | 'empty'>('empty');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Permanent Promo Code State (Always present on /sell)
  const [promoCodeInput, setPromoCodeInput] = useState('NOVICHOK');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoBonusPercent, setPromoBonusPercent] = useState(8); // +8%
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Filters & Sorting
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'float-asc'>('price-desc');
  const [inspectingSkin, setInspectingSkin] = useState<CS2Skin | null>(null);

  // Payment Selection & Details
  const allPaymentMethods = useMemo(() => [...FIAT_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS], []);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption>(FIAT_PAYMENT_METHODS[0]);
  const [destinationInput, setDestinationInput] = useState('');
  const [paymentTab, setPaymentTab] = useState<'all' | 'cards' | 'crypto'>('all');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // Cooldown timer for refresh
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Load user inventory when user or their trade URL changes
  const loadInventory = useCallback(async (force = false) => {
    const targetUrl = user?.tradeUrl || user?.steamId64;
    if (!targetUrl) {
      setSkins([]);
      setSelectedIds(new Set());
      setSyncStatus('empty');
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const res = await fetchSteamInventory(targetUrl, force);
      setIsSyncing(false);
      setSyncStatus(res.status);

      if (res.success && res.items && res.items.length > 0) {
        setSkins(res.items);
        // Automatically select the first 2-3 items for high conversion
        const initialSelected = new Set(res.items.slice(0, 3).map(i => i.id));
        setSelectedIds(initialSelected);
      } else if (res.status === 'private') {
        setSkins([]);
        setSelectedIds(new Set());
        setSyncMessage(ts('sell.errPrivate'));
      } else if (res.status === 'rate_limited') {
        setSkins([]);
        setSelectedIds(new Set());
        setCooldown(15);
        setSyncMessage(ts('sell.errRateLimit'));
      } else if (res.status === 'empty') {
        setSkins([]);
        setSelectedIds(new Set());
        setSyncMessage(ts('sell.errEmpty'));
      } else {
        setSkins([]);
        setSelectedIds(new Set());
      }
    } catch {
      setIsSyncing(false);
      setSyncStatus('error');
    }
  }, [user?.tradeUrl, user?.steamId64, ts]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  // Handle promo code submit
  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCodeInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'NOVICHOK' || clean === 'НОВИЧОК' || clean === 'CASH' || clean === 'START' || clean === 'VIP') {
      setIsPromoApplied(true);
      setPromoBonusPercent(8);
      setPromoMessage(ts('sell.promoSuccess8'));
    } else {
      setIsPromoApplied(true);
      setPromoBonusPercent(5);
      setPromoMessage(ts('sell.promoSuccess5', { code: clean }));
    }

    setTimeout(() => setPromoMessage(null), 4000);
  };

  // Selection helpers
  const toggleSelectSkin = (id: string) => {
    setSelectedIds(prev => {
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
    setSelectedIds(new Set(filteredSkins.map(s => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Filtered and sorted skins
  const filteredSkins = useMemo(() => {
    return skins.filter(skin => {
      // Category filter
      if (activeCategory === 'knives-gloves' && skin.category !== 'Knife' && skin.category !== 'Gloves') return false;
      if (activeCategory === 'rifles' && skin.category !== 'Rifle' && skin.category !== 'Sniper') return false;
      if (activeCategory === 'pistols' && skin.category !== 'Pistol') return false;
      if (activeCategory === 'stattrak' && !skin.isStatTrak) return false;
      if (activeCategory === 'cases' && skin.category !== 'Case') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${skin.weapon} ${skin.skinName}`.toLowerCase();
        return fullName.includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'float-asc') return a.float - b.float;
      return 0;
    });
  }, [skins, activeCategory, searchQuery, sortBy]);

  // Selected skins list & price calculation
  const selectedSkinsList = useMemo(() => {
    return skins.filter(s => selectedIds.has(s.id));
  }, [skins, selectedIds]);

  const baseGrossValue = useMemo(() => {
    return selectedSkinsList.reduce((acc, s) => acc + s.price, 0);
  }, [selectedSkinsList]);

  const promoBonusAmount = useMemo(() => {
    if (!isPromoApplied) return 0;
    return Math.round(baseGrossValue * (promoBonusPercent / 100) * 100) / 100;
  }, [baseGrossValue, isPromoApplied, promoBonusPercent]);

  const totalCashoutValue = useMemo(() => {
    return baseGrossValue + promoBonusAmount;
  }, [baseGrossValue, promoBonusAmount]);

  // Payment method options filtered by tab
  const filteredPaymentMethods = useMemo(() => {
    if (paymentTab === 'cards') return FIAT_PAYMENT_METHODS;
    if (paymentTab === 'crypto') return CRYPTO_PAYMENT_METHODS;
    return allPaymentMethods;
  }, [paymentTab, allPaymentMethods]);

  // Handle Trade Completed
  const handleTradeCompleted = (tradeSession: DepositTradeSession) => {
    if (user) {
      updateBalance(tradeSession.totalValue);
      addTransaction({
        type: 'sale',
        title: getCabinetText(language, 'cabinet.depositTitle', { 
          count: tradeSession.skins.length, 
          bot: tradeSession.bot.personaName 
        }),
        amount: tradeSession.totalValue,
        status: 'completed',
        method: selectedPaymentMethod.name,
        destinationMasked: destinationInput || (selectedPaymentMethod.category === 'crypto' ? 'USDT Wallet' : 'Bank Card'),
        itemsCount: tradeSession.skins.length,
        itemsSummary: tradeSession.skins.map(s => s.name).join(', '),
        txHash: tradeSession.txId,
        tradeOfferId: tradeSession.txId,
      });

      if (user?.steamId64) {
        fetch('/api/trade/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            steamId64: user.steamId64,
            tradeSession,
          }),
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0E] text-slate-100 flex flex-col">
      
      {/* 1. TOP HEADER / APP BAR */}
      <header className="sticky top-0 z-40 bg-[#070A0E]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-nowrap w-full">
          
          {/* Left: Brand Logo & Back Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onNavigateHome}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title={ts('sell.home')}
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-['Space_Grotesk']">{ts('sell.home')}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="font-['Space_Grotesk'] text-base font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  SkinTo<span className="text-emerald-400">Cash</span>
                </span>
                <span className="hidden md:block text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-emerald-400 font-bold">
                  {ts('sell.instantHub')}
                </span>
              </div>
            </button>
          </div>

          {/* Right: Language, Currency & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Language Selector - Always visible on mobile & desktop */}
            <LanguageSelector />

            {/* Currency Pill */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                aria-label={ts('sell.selectCurrency')}
                className="appearance-none pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs font-['JetBrains_Mono'] font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="USD" className="bg-[#0B1017] text-white">USD ($)</option>
                <option value="EUR" className="bg-[#0B1017] text-white">EUR (€)</option>
                <option value="UAH" className="bg-[#0B1017] text-white">UAH (₴)</option>
                <option value="RUB" className="bg-[#0B1017] text-white">RUB (₽)</option>
                <option value="KZT" className="bg-[#0B1017] text-white">KZT (₸)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Authenticated Steam User Capsule */}
            {user ? (
              <button
                onClick={openCabinet}
                className="flex items-center gap-2 pl-2 pr-2.5 sm:pr-3 py-1 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={user.avatar || 'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg'}
                    alt={user.personaname}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white font-['Space_Grotesk'] leading-tight truncate max-w-[110px]">
                    {user.personaname}
                  </div>
                  <div className="text-[10px] font-['JetBrains_Mono'] text-emerald-400 font-bold leading-tight">
                    {formatPrice(user.balance || 0)}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onOpenSteamModal) {
                    onOpenSteamModal();
                  } else {
                    loginWithSteam();
                  }
                }}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden sm:inline">{ts('sell.signInSteam')}</span>
                <span className="sm:hidden">Steam</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* 2. MAIN SELL CONTENT WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* ============================================================== */}
        {/* PERMANENT PROMOCODE BANNER (Always visible exclusively on /sell) */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-4 sm:p-5 overflow-hidden border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 via-slate-900/90 to-teal-950/50 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_25px_rgba(16,185,129,0.15)]"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Promo Info Left */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-white">
                    {ts('sell.promoTitle')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black font-['JetBrains_Mono'] uppercase tracking-wider">
                    {isPromoApplied ? ts('sell.promoActive') : ts('sell.promoInactive')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-['Space_Grotesk'] mt-0.5">
                  {ts('sell.promoDesc')}
                </p>
              </div>
            </div>

            {/* Promo Code Form Right */}
            <form onSubmit={handleApplyPromoCode} className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder={ts('sell.promoPlaceholder')}
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs text-white font-['JetBrains_Mono'] font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-400 shadow-inner"
                />
                {isPromoApplied && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-['Space_Grotesk'] tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all shrink-0 cursor-pointer"
              >
                {isPromoApplied ? ts('sell.promoApplied') : ts('sell.promoApply')}
              </button>
            </form>

          </div>

          {promoMessage && (
            <div className="mt-2 text-xs font-['JetBrains_Mono'] text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{promoMessage}</span>
            </div>
          )}
        </motion.div>

        {/* ============================================================== */}
        {/* 3. TWO-COLUMN WORKSPACE: INVENTORY (LEFT) + CHECKOUT (RIGHT)    */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: INVENTORY CATALOG & CONTROLS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Toolbar: Stats & Bulk Selection */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/[0.07] backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-md">
              
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{ts('sell.myInventory')}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[11px] font-['JetBrains_Mono'] text-slate-300">
                  {skins.length} {ts('sell.items')}
                </span>
                {selectedSkinsList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-['JetBrains_Mono'] text-emerald-400 font-bold">
                    {ts('sell.selectedCount', { count: selectedSkinsList.length, amount: formatPrice(baseGrossValue) })}
                  </span>
                )}
              </div>

              {/* Action Buttons: Select All / Deselect / Refresh */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] font-medium transition-all cursor-pointer font-['Space_Grotesk']"
                >
                  {ts('sell.selectAll')}
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] font-medium transition-all cursor-pointer font-['Space_Grotesk']"
                >
                  {ts('sell.deselectAll')}
                </button>
                <button
                  onClick={() => loadInventory(true)}
                  disabled={isSyncing || cooldown > 0}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/[0.06] transition-all cursor-pointer disabled:opacity-50"
                  title={ts('sell.refreshInventory')}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

            </div>

            {/* Filter Pills & Search Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: ts('sell.catAll') },
                  { id: 'knives-gloves', label: ts('sell.catKnivesGloves') },
                  { id: 'rifles', label: ts('sell.catRiflesAwp') },
                  { id: 'pistols', label: ts('sell.catPistols') },
                  { id: 'cases', label: ts('sell.catCases') },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Sort */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ts('sell.searchPlaceholder')}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-['JetBrains_Mono']"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    aria-label={ts('sell.searchPlaceholder')}
                    className="appearance-none pl-7 pr-7 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-['Space_Grotesk'] font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="price-desc" className="bg-[#0B1017]">{ts('sell.sortPriceDesc')}</option>
                    <option value="price-asc" className="bg-[#0B1017]">{ts('sell.sortPriceAsc')}</option>
                    <option value="float-asc" className="bg-[#0B1017]">{ts('sell.sortFloatAsc')}</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Error / Private Inventory Notice */}
            {syncMessage && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            {/* SKINS GRID */}
            {filteredSkins.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/[0.06] text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-['Space_Grotesk'] font-semibold">{ts('sell.errEmpty')}</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-emerald-400 border border-white/[0.08] cursor-pointer"
                >
                  {ts('sell.deselectAll')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredSkins.map((skin) => {
                  const isSelected = selectedIds.has(skin.id);
                  const bonusPerSkin = isPromoApplied ? skin.price * (promoBonusPercent / 100) : 0;
                  const finalSkinPrice = skin.price + bonusPerSkin;

                  return (
                    <motion.div
                      key={skin.id}
                      whileHover={{ y: -3 }}
                      onClick={() => toggleSelectSkin(skin.id)}
                      className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'bg-slate-900/90 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                          : 'bg-slate-900/50 border-white/[0.07] hover:border-white/20 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Top Bar: Wear Badge & Inspect button */}
                      <div className="flex items-center justify-between text-[10px] mb-1 font-['JetBrains_Mono']">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-white/[0.06]">
                          {skin.wear}
                        </span>

                        <div className="flex items-center gap-1">
                          {skin.isStatTrak && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px]">
                              ST
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectingSkin(skin);
                            }}
                            className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                            title={ts('sell.inspect')}
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Skin Weapon Image */}
                      <div className="relative h-20 my-1 flex items-center justify-center">
                        <SkinImage
                          src={skin.image}
                          fallback={skin.fallbackImage}
                          alt={skin.name}
                          className="max-h-18 w-auto object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Bottom Info: Name & Price */}
                      <div className="pt-2 border-t border-white/[0.06]">
                        <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-slate-400 truncate">
                          {skin.weapon}
                        </div>
                        <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate" title={skin.skinName}>
                          {skin.skinName}
                        </div>

                        {/* Price & Selection Indicator */}
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black font-['JetBrains_Mono'] text-emerald-400">
                              {formatPrice(finalSkinPrice)}
                            </span>
                            {isPromoApplied && (
                              <span className="block text-[9px] text-emerald-500/80 font-['JetBrains_Mono']">
                                +{formatPrice(bonusPerSkin)}
                              </span>
                            )}
                          </div>

                          {/* Checkbox badge */}
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                : 'border border-white/20 bg-white/[0.02]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY CHECKOUT & CASHOUT PANEL (4 COLS) */}
          <div className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
            
            <div className="p-5 rounded-3xl bg-[#0B1017]/95 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4">
              
              {/* Card Header: Selected Items Summary */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    {ts('sell.payoutMethodTitle')}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-['Space_Grotesk']">
                    {ts('sell.instantPayoutBadge')}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-xs font-bold font-['JetBrains_Mono'] text-emerald-400 border border-white/[0.06]">
                  {selectedSkinsList.length} {ts('sell.items')}
                </span>
              </div>

              {/* Selected Skins Horizontal Thumbnail Scroll */}
              {selectedSkinsList.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {selectedSkinsList.map(s => (
                    <div
                      key={s.id}
                      className="relative w-14 h-14 rounded-xl bg-slate-900 border border-emerald-500/40 p-1 shrink-0 flex items-center justify-center group/thumb"
                      title={`${s.weapon} | ${s.skinName}`}
                    >
                      <img src={s.image} alt={s.name} className="max-h-10 w-auto object-contain" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectSkin(s.id);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-white/[0.08] rounded-2xl font-['Space_Grotesk']">
                  {ts('sell.selectAtLeastOne')}
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="text-[11px] font-bold font-['Space_Grotesk'] uppercase text-slate-300 block mb-2">
                  {ts('sell.payoutMethodTitle')}:
                </label>

                {/* Method Category Switcher */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2.5">
                  <button
                    onClick={() => setPaymentTab('all')}
                    className={`py-1 rounded-lg text-[10px] font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                      paymentTab === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts('sell.tabAllMethods')}
                  </button>
                  <button
                    onClick={() => setPaymentTab('cards')}
                    className={`py-1 rounded-lg text-[10px] font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                      paymentTab === 'cards' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts('sell.tabCards')}
                  </button>
                  <button
                    onClick={() => setPaymentTab('crypto')}
                    className={`py-1 rounded-lg text-[10px] font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                      paymentTab === 'crypto' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts('sell.tabCrypto')}
                  </button>
                </div>

                {/* Payment Methods Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredPaymentMethods.slice(0, 8).map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        selectedPaymentMethod.id === method.id
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <PaymentMethodIcon id={method.icon} size={18} className="rounded-sm shrink-0" />
                      <div className="overflow-hidden">
                        <div className="font-bold font-['Space_Grotesk'] truncate text-[11px] leading-tight">
                          {method.name === 'Карта МИР (РФ)' ? 'МИР' : method.name}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-['JetBrains_Mono'] truncate">
                          {method.speed}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Input (Card Number / Crypto Address) */}
              <div>
                <label className="text-[11px] font-bold font-['Space_Grotesk'] uppercase text-slate-300 block mb-1.5">
                  {ts('sell.destinationLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder={
                      selectedPaymentMethod.category === 'crypto'
                        ? ts('sell.destCryptoPlaceholder')
                        : selectedPaymentMethod.id === 'sbp'
                        ? ts('sell.destSbpPlaceholder')
                        : ts('sell.destCardPlaceholder')
                    }
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 py-3 border-y border-white/[0.08] text-xs font-['JetBrains_Mono']">
                <div className="flex justify-between text-slate-400">
                  <span>{ts('sell.baseValueLabel')}</span>
                  <span className="text-slate-200">{formatPrice(baseGrossValue)}</span>
                </div>

                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>{ts('sell.bonusLabel', { percent: promoBonusPercent })}</span>
                    <span>+{formatPrice(promoBonusAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>{t('metrics.fee') || 'Fee:'}</span>
                  <span className="text-emerald-400 font-bold">0.00%</span>
                </div>

                <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-white/[0.08]">
                  <span className="font-['Space_Grotesk'] text-sm">{ts('sell.totalPayoutLabel')}</span>
                  <span className="text-emerald-400 text-lg font-['JetBrains_Mono'] font-extrabold">
                    {formatPrice(totalCashoutValue)}
                  </span>
                </div>
              </div>

              {/* Big CTA: Cashout Button */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedSkinsList.length === 0}
                  onClick={() => setIsTradeModalOpen(true)}
                  className={`w-full py-4 rounded-xl font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    selectedSkinsList.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.65)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    {selectedSkinsList.length > 0
                      ? `${ts('sell.getCashoutBtn')} (${formatPrice(totalCashoutValue)})`
                      : ts('sell.selectAtLeastOne')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-['Space_Grotesk']">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ts('sell.securityGuarantee')}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* 3D SKIN INSPECT MODAL */}
      <SkinInspectModal
        skin={inspectingSkin}
        onClose={() => setInspectingSkin(null)}
        isSelected={inspectingSkin ? selectedIds.has(inspectingSkin.id) : false}
        onSelectAndClose={(skin) => {
          toggleSelectSkin(skin.id);
          setInspectingSkin(null);
        }}
      />

      {/* STEAM BOT DEPOSIT TRADE OFFER MODAL */}
      <TradeOfferModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        selectedSkins={selectedSkinsList}
        totalPayout={totalCashoutValue}
        paymentMethod={selectedPaymentMethod}
        destinationAddress={destinationInput || (selectedPaymentMethod.category === 'crypto' ? 'USDT Wallet' : 'Bank Card')}
        userTradeUrl={user?.tradeUrl || undefined}
        onTradeCompleted={handleTradeCompleted}
      />

    </div>
  );
};
