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
  CheckSquare,
  Square,
  RefreshCw,
  Gift,
  Lock,
  ExternalLink,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { MOCK_CS2_INVENTORY } from '../data/skinsData';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import type { CS2Skin, PaymentOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getCabinetText } from '../data/pagesTranslations';
import { SkinInspectModal } from './SkinInspectModal';
import { TradeOfferModal } from './TradeOfferModal';
import { SkinImage } from './SkinImage';
import { fetchSteamInventory, parseSteamTradeUrl } from '../services/steamService';
import { useAuth } from '../context/AuthContext';
import { type DepositTradeSession } from '../data/steamBot';

interface InventorySandboxProps {
  tradeUrl?: string;
  isBonusApplied?: boolean;
  onOpenBonusModal?: () => void;
  onTradeUrlChange?: (url: string) => void;
}

export const InventorySandbox: React.FC<InventorySandboxProps> = ({
  tradeUrl: initialTradeUrl,
  isBonusApplied = false,
  onOpenBonusModal,
  onTradeUrlChange,
}) => {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const { user, openCabinet, updateBalance, addTransaction } = useAuth();

  // Trade URL input state
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(initialTradeUrl || '');
  const [skins, setSkins] = useState<CS2Skin[]>(MOCK_CS2_INVENTORY);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(['skin-karambit-gamma-emerald', 'skin-m4a1-printstream', 'skin-butterfly-fade'])
  );

  // Steam API Sync Status & Player Info
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'success' | 'private' | 'rate_limited' | 'error' | 'demo' | 'empty'>('demo');
  const [playerInfo, setPlayerInfo] = useState<{ personaname: string; avatar: string; profileurl?: string } | null>(null);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const lastLoadedUrlRef = React.useRef<string>('');

  // 30-second cooldown timer for Steam rate limit mitigation
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);
  
  // Filtering & Sorting
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'float-asc'>('price-desc');

  // Modals & Payout Setup
  const [inspectingSkin, setInspectingSkin] = useState<CS2Skin | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption>(CRYPTO_PAYMENT_METHODS[0]); // USDT TRC20 default
  const [destinationInput, setDestinationInput] = useState('0x71C...b92F4 (TRC-20)');
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);

  // Fetch Inventory logic
  const loadInventory = useCallback(async (targetUrl: string, force = false) => {
    if (!targetUrl || !targetUrl.trim()) return;

    setIsSyncing(true);
    setSyncStatusMessage(null);

    try {
      const res = await fetchSteamInventory(targetUrl, force);
      setIsSyncing(false);
      setSyncStatus(res.status);

      if (res.player) {
        setPlayerInfo(res.player);
      }

      if (res.status === 'success' && res.items.length > 0) {
        setSkins(res.items);
        setSelectedIds(new Set(res.items.slice(0, 3).map(s => s.id)));
        setSyncStatusMessage(`${res.items.length} ${t('sandbox.items')} synchronized`);
      } else if (res.status === 'rate_limited') {
        // When Steam rate limits, load verified items and activate 30s backoff cooldown
        if (res.items && res.items.length > 0) {
          setSkins(res.items);
          setSelectedIds(new Set(res.items.slice(0, 3).map(s => s.id)));
        }
        setCooldown(30);
        setSyncStatusMessage(res.message || 'Steam rate limit active. Valuation mode enabled.');
      } else if (res.status === 'private') {
        setSkins([]);
        setSelectedIds(new Set());
        setSyncStatusMessage(res.message || 'Steam inventory is Private');
      } else if (res.status === 'empty') {
        setSkins([]);
        setSelectedIds(new Set());
        setSyncStatusMessage('No tradable CS2 skins found');
      } else if (res.status === 'demo') {
        setSkins(MOCK_CS2_INVENTORY);
        setSelectedIds(new Set(['skin-karambit-gamma-emerald', 'skin-m4a1-printstream', 'skin-butterfly-fade']));
        setSyncStatusMessage('Demo inventory active');
      } else {
        setSyncStatusMessage(res.message || 'Error connecting to Steam');
      }
    } catch (err: any) {
      setIsSyncing(false);
      setSyncStatus('error');
      setSyncStatusMessage(err?.message || 'Error connecting to Steam');
    }
  }, [t]);

  // Sync with prop when tradeUrl changes from outside (e.g. Hero section)
  useEffect(() => {
    if (initialTradeUrl && initialTradeUrl !== lastLoadedUrlRef.current) {
      lastLoadedUrlRef.current = initialTradeUrl;
      setTradeUrlInput(initialTradeUrl);
      loadInventory(initialTradeUrl);
    }
  }, [initialTradeUrl, loadInventory]);

  const handleManualScan = (e?: React.FormEvent, force = false) => {
    if (e) e.preventDefault();
    if (cooldown > 0 && !force) return;
    if (!tradeUrlInput.trim()) return;
    lastLoadedUrlRef.current = tradeUrlInput;
    if (onTradeUrlChange) {
      onTradeUrlChange(tradeUrlInput);
    }
    loadInventory(tradeUrlInput, force);
  };

  const handleLoadDemo = () => {
    setTradeUrlInput('demo');
    lastLoadedUrlRef.current = 'demo';
    if (onTradeUrlChange) {
      onTradeUrlChange('demo');
    }
    loadInventory('demo');
  };

  // Toggle skin selection
  const toggleSelect = (id: string) => {
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
    if (selectedIds.size === filteredSkins.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSkins.map(s => s.id)));
    }
  };

  // Filtered and sorted skins
  const filteredSkins = useMemo(() => {
    return skins
      .filter(skin => {
        if (activeCategory === 'knives-gloves') {
          return skin.category === 'Knife' || skin.category === 'Gloves';
        }
        if (activeCategory === 'rifles') {
          return skin.category === 'Rifle' || skin.category === 'Sniper';
        }
        if (activeCategory === 'pistols') {
          return skin.category === 'Pistol';
        }
        if (activeCategory === 'stattrak') {
          return !!skin.isStatTrak;
        }
        return true;
      })
      .filter(skin => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return skin.name.toLowerCase().includes(query) || skin.skinName.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'float-asc') return a.float - b.float;
        return 0;
      });
  }, [skins, activeCategory, searchQuery, sortBy]);

  // Calculations for selected items
  const selectedSkinsList = useMemo(() => {
    return skins.filter(s => selectedIds.has(s.id));
  }, [skins, selectedIds]);

  const baseGrossValue = useMemo(() => {
    return selectedSkinsList.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedSkinsList]);

  const bonusAmount = useMemo(() => {
    return isBonusApplied ? baseGrossValue * 0.08 : 0;
  }, [baseGrossValue, isBonusApplied]);

  const totalCashoutValue = useMemo(() => {
    return baseGrossValue + bonusAmount;
  }, [baseGrossValue, bonusAmount]);

  const allAvailablePaymentMethods = useMemo(() => {
    return [...CRYPTO_PAYMENT_METHODS.slice(0, 4), ...FIAT_PAYMENT_METHODS.slice(0, 4)];
  }, []);

  const handleTriggerCashout = () => {
    if (selectedSkinsList.length === 0) return;

    if (!isBonusApplied && onOpenBonusModal) {
      onOpenBonusModal();
    } else {
      setIsCashoutModalOpen(true);
    }
  };

  const handleTradeCompleted = (tradeSession: DepositTradeSession) => {
    if (user) {
      updateBalance(tradeSession.totalValue);
      addTransaction({
        type: 'sale',
        title: getCabinetText(language, 'cabinet.depositTitle', { count: tradeSession.skins.length, bot: tradeSession.bot.personaName }),
        amount: tradeSession.totalValue,
        status: 'completed',
        method: selectedPaymentMethod.name,
        destinationMasked: destinationInput || getCabinetText(language, 'cabinet.availableBalance'),
        itemsCount: tradeSession.skins.length,
        txHash: tradeSession.txId,
        tradeOfferId: tradeSession.txId,
      });
    }
  };

  const parsedTradeInfo = useMemo(() => {
    return parseSteamTradeUrl(tradeUrlInput);
  }, [tradeUrlInput]);

  return (
    <section id="inventory-sandbox" className="py-24 sm:py-32 bg-[#070A0E] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-4">
            {t('sandbox.title')}
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            {t('sandbox.subtitle')}
          </p>

          {/* Newcomer Bonus Alert Banner (Strictly Emerald/Cyan Palette) */}
          {isBonusApplied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-['JetBrains_Mono'] font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>{t('bonus.bannerActive')}</span>
            </motion.div>
          )}
        </div>

        {/* 1. Interactive Trade URL Command Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="p-4 rounded-3xl bg-[#0B1017]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            <form onSubmit={handleManualScan} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Input field with Steam Icon */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center justify-center pointer-events-none">
                  {syncStatus === 'private' ? (
                    <Lock className="w-4 h-4 text-amber-400" />
                  ) : syncStatus === 'success' ? (
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Zap className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <input
                  type="text"
                  value={tradeUrlInput}
                  onChange={(e) => setTradeUrlInput(e.target.value)}
                  placeholder={t('sandbox.tradeUrlInput')}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-['JetBrains_Mono'] text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: cooldown > 0 ? 1 : 1.02 }}
                  whileTap={{ scale: cooldown > 0 ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSyncing || cooldown > 0}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-['Space_Grotesk'] font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cooldown > 0 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  } disabled:opacity-70`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncing 
                      ? 'Loading...' 
                      : cooldown > 0 
                      ? t('sandbox.cooldownWait', { seconds: cooldown })
                      : t('sandbox.loadInventoryBtn')}
                  </span>
                </motion.button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-3.5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-white font-['Space_Grotesk'] font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Demo
                </button>
              </div>

            </form>

            {/* Sub-bar with Live Steam Status & Find URL Helper */}
            <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-3 text-xs font-['JetBrains_Mono'] text-slate-400">
              
              {/* Left: Player info & Steam Connection Status */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {(playerInfo?.avatar || user?.avatar) ? (
                  <img
                    src={playerInfo?.avatar || user?.avatar}
                    alt={playerInfo?.personaname || user?.personaname}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400/50"
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}

                {(playerInfo?.personaname || user?.personaname) && (
                  <button
                    type="button"
                    onClick={openCabinet}
                    className="font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                    title={t('nav.openCabinet')}
                  >
                    <span>{playerInfo?.personaname || user?.personaname}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 font-['Space_Grotesk']">
                      {t('nav.cabinet')}
                    </span>
                  </button>
                )}

                {/* Status Badges */}
                {syncStatus === 'success' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    🟢 CS2 Sync Active ({skins.length} items)
                  </span>
                )}
                {syncStatus === 'private' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                    🔒 Steam Inventory Private
                  </span>
                )}
                {syncStatus === 'demo' && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                    🧪 Verified Demo Mode
                  </span>
                )}
                {syncStatus === 'rate_limited' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                    <span>⚡ Steam Rate Limit (429)</span>
                    {cooldown > 0 && <span>({cooldown}s)</span>}
                  </span>
                )}
                {syncStatus === 'empty' && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-[10px] font-bold">
                    ⚠️ 0 Tradable Skins Found
                  </span>
                )}

                {syncStatusMessage && (
                  <span className="hidden md:inline text-slate-400 text-[11px]">
                    • {syncStatusMessage}
                  </span>
                )}
              </div>

              {/* Right: Where do I find my Trade URL link */}
              <a
                href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>{t('sandbox.findTradeUrl')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

            </div>

          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Inventory Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Steam Community Rate Limit (429) Smart Notice Banner */}
            {syncStatus === 'rate_limited' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-['JetBrains_Mono'] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {playerInfo?.personaname && (
                      <strong className="text-white font-bold">{playerInfo.personaname}: </strong>
                    )}
                    {t('sandbox.rateLimitNotice')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleManualScan(undefined, true)}
                  disabled={cooldown > 0 || isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap self-end sm:self-auto"
                >
                  {cooldown > 0 ? t('sandbox.cooldownWait', { seconds: cooldown }) : t('sandbox.retryNow')}
                </button>
              </motion.div>
            )}

            {/* Control Bar: Filters, Search & Sort */}
            <div className="p-3.5 rounded-2xl glass-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Category Filter Pills (Smooth horizontal scroll on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
                {[
                  { id: 'all', label: t('sandbox.allItems') },
                  { id: 'knives-gloves', label: t('sandbox.knivesGloves') },
                  { id: 'rifles', label: t('sandbox.riflesAwp') },
                  { id: 'pistols', label: t('sandbox.pistols') },
                  { id: 'stattrak', label: t('sandbox.stattrak') },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar & Sort Dropdown */}
              <div className="flex items-center gap-2">
                
                {/* Search Input */}
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('sandbox.searchPlaceholder')}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-['JetBrains_Mono']"
                  />
                </div>

                {/* Sort selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="appearance-none pl-7 pr-7 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-['Space_Grotesk'] font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="price-desc" className="bg-[#0B1017]">{t('sandbox.sortPriceDesc')}</option>
                    <option value="price-asc" className="bg-[#0B1017]">{t('sandbox.sortPriceAsc')}</option>
                    <option value="float-asc" className="bg-[#0B1017]">{t('sandbox.sortFloatAsc')}</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

              </div>

            </div>

            {/* CONDITION 1: Private Inventory State Card */}
            {syncStatus === 'private' ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-10 rounded-3xl bg-[#0B1017]/95 border border-amber-500/30 text-center relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-[80px] pointer-events-none rounded-full" />
                
                {/* Player Profile Header if available */}
                {playerInfo && (
                  <div className="flex items-center justify-center gap-3 mb-6">
                    {playerInfo.avatar && (
                      <img
                        src={playerInfo.avatar}
                        alt={playerInfo.personaname}
                        className="w-12 h-12 rounded-2xl border-2 border-amber-400/50 shadow-lg object-cover"
                      />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
                        <span>{playerInfo.personaname}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 font-['JetBrains_Mono']">
                          SteamID: {parsedTradeInfo.steamId64?.slice(-6) || 'Online'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-400 font-['JetBrains_Mono'] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Inventory Privacy: Private / Friends-Only</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lock Icon */}
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                  {t('sandbox.privateTitle')}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
                  {t('sandbox.privateDesc')}
                </p>

                {/* 3 Step Instruction Guide */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-8 text-left">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-amber-400 font-['JetBrains_Mono'] text-xs font-bold mb-1">01</div>
                    <div className="text-xs text-slate-300 font-medium">{t('sandbox.privateStep1')}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-amber-400 font-['JetBrains_Mono'] text-xs font-bold mb-1">02</div>
                    <div className="text-xs text-slate-300 font-medium">{t('sandbox.privateStep2')}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-amber-400 font-['JetBrains_Mono'] text-xs font-bold mb-1">03</div>
                    <div className="text-xs text-slate-300 font-medium">{t('sandbox.privateStep3')}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="https://steamcommunity.com/my/edit/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('sandbox.openPrivacyBtn')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleManualScan()}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-white font-['Space_Grotesk'] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{t('sandbox.rescanBtn')}</span>
                  </button>

                  <button
                    onClick={handleLoadDemo}
                    className="w-full sm:w-auto text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-2"
                  >
                    {t('sandbox.tryDemoBtn')}
                  </button>
                </div>

              </motion.div>
            ) : syncStatus === 'empty' ? (
              /* CONDITION 2: Empty Inventory State Card */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-3xl bg-[#0B1017]/90 border border-white/[0.08] text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-2">
                  {t('sandbox.emptyTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                  {t('sandbox.emptyDesc')}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleManualScan()}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-emerald-500/40 text-white text-xs font-['Space_Grotesk'] font-bold transition-colors cursor-pointer"
                  >
                    {t('sandbox.rescanBtn')}
                  </button>
                  <button
                    onClick={handleLoadDemo}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-['Space_Grotesk'] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    {t('sandbox.tryDemoBtn')}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* CONDITION 3: Live / Demo Skin Grid */
              <>
                {/* Quick Action Bar (Select All / Item Count) */}
                <div className="flex items-center justify-between text-xs px-2 text-slate-400 font-['JetBrains_Mono']">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {selectedIds.size === filteredSkins.length ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>{t('sandbox.deselectAll')}</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4" />
                        <span>{t('sandbox.selectAll')}</span>
                      </>
                    )}
                  </button>

                  <div>
                    <span>{t('sandbox.selectedOf', { count: selectedIds.size, total: skins.length })}</span>
                    <span className="hidden sm:inline text-slate-600 ml-2">• {t('sandbox.clickHint')}</span>
                  </div>
                </div>

                {/* CS2 Inventory Item Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredSkins.map((skin) => {
                      const isSelected = selectedIds.has(skin.id);

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -4 }}
                          key={skin.id}
                          onClick={() => toggleSelect(skin.id)}
                          className={`relative rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 border select-none ${
                            isSelected
                              ? 'bg-[#0E1622] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.22)]'
                              : 'bg-white/[0.02] border-white/[0.07] hover:border-emerald-500/30 hover:bg-white/[0.04]'
                          }`}
                        >
                          {/* Top status bar: Checkbox + Float badge */}
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                                isSelected
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                  : 'bg-white/[0.04] border-white/[0.1] text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>

                            <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">
                              {skin.wear} {skin.float.toFixed(3)}
                            </span>
                          </div>

                          {/* Weapon Image Preview with ambient glow */}
                          <div className="relative h-28 my-1 flex items-center justify-center overflow-hidden">
                            <div 
                              className="absolute w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
                              style={{ backgroundColor: skin.rarityColor }}
                            />
                            <SkinImage
                              src={skin.image}
                              fallback={skin.fallbackImage}
                              alt={skin.name}
                              className="max-h-24 max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Details & Price Breakdown */}
                          <div className="pt-2 border-t border-white/[0.06]">
                            <div className="text-[10px] text-slate-400 font-['Space_Grotesk'] truncate">
                              {skin.weapon}
                            </div>
                            <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                              {skin.skinName}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                                {formatPrice(skin.price)}
                              </span>

                              {/* Inspect button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingSkin(skin);
                                }}
                                className="p-1 rounded-md hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title={t('sandbox.inspect')}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            )}

          </div>

          {/* Sticky Interactive Payout Calculation Panel (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            
            <div className="rounded-3xl glass-panel p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/[0.08]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                    {t('sandbox.payoutCalc')}
                  </h3>
                </div>

                <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {t('sandbox.feePromo')}
                </span>
              </div>

              {/* Dynamic Animated Value Counter */}
              <div className="py-5 text-center bg-white/[0.02] rounded-2xl my-4 border border-white/[0.06]">
                <span className="text-[11px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 block mb-1">
                  {t('sandbox.totalValuation')} ({selectedSkinsList.length} {t('sandbox.items')})
                </span>
                
                <div className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                  {formatPrice(totalCashoutValue)}
                </div>

                {isBonusApplied && (
                  <div className="mt-1 text-xs font-['JetBrains_Mono'] font-bold text-emerald-300">
                    Includes +8% Bonus: +{formatPrice(bonusAmount)}
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-400 font-['JetBrains_Mono'] flex items-center justify-center gap-2">
                  <span>{t('sandbox.steamEquiv')}</span>
                  <span className="text-slate-500 line-through">
                    {formatPrice(totalCashoutValue * 1.14)}
                  </span>
                </div>
              </div>

              {/* Payout Method Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-slate-300 font-bold block">
                  {t('sandbox.selectMethod')}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {allAvailablePaymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 cursor-pointer ${
                        selectedPaymentMethod.id === method.id
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                        {method.category === 'crypto' ? '₮' : '💳'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold font-['Space_Grotesk'] truncate text-[11px]">{method.name}</div>
                        <div className="text-[9px] text-emerald-400 font-['JetBrains_Mono']">{method.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Address / Account Input */}
              <div className="mb-4">
                <label className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  {selectedPaymentMethod.category === 'crypto' ? t('sandbox.yourCryptoAddress') : t('sandbox.yourCardIban')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder={
                      selectedPaymentMethod.category === 'crypto'
                        ? 'Enter TRC-20 / ERC-20 / Solana Address'
                        : 'Enter 16-digit Card number or IBAN'
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="space-y-2 py-3 border-y border-white/[0.06] text-xs font-['JetBrains_Mono']">
                <div className="flex justify-between text-slate-400">
                  <span>{t('sandbox.grossVal')}</span>
                  <span className="text-slate-200">{formatPrice(baseGrossValue)}</span>
                </div>
                {isBonusApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>+8% Новичок Bonus:</span>
                    <span>+{formatPrice(bonusAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>{t('sandbox.platformComm')}</span>
                  <span className="text-emerald-400 font-bold">0.00% ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('sandbox.gasFee')}</span>
                  <span className="text-emerald-400 font-bold">{t('sandbox.free')}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-white/[0.06]">
                  <span>{t('sandbox.finalNetPayout')}</span>
                  <span className="text-emerald-400 text-sm">{formatPrice(totalCashoutValue)}</span>
                </div>
              </div>

              {/* Glowing Cashout Action Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedSkinsList.length === 0}
                  onClick={handleTriggerCashout}
                  className={`w-full py-4 rounded-xl font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    selectedSkinsList.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.65)] animate-shimmer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    {t('sandbox.cashoutNow', { amount: formatPrice(totalCashoutValue) })}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('sandbox.verifiedDelivery')}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Cashout Action Bar (Visible on mobile when skins are selected) */}
      <AnimatePresence>
        {selectedSkinsList.length > 0 && !isCashoutModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed bottom-16 left-3 right-3 z-30 p-3 rounded-2xl bg-[#0B1017]/95 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-between gap-3"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-['Space_Grotesk'] uppercase tracking-wider font-semibold">
                Обрано: {selectedSkinsList.length} скінів
              </span>
              <span className="text-base font-extrabold font-['JetBrains_Mono'] text-emerald-400">
                {formatPrice(totalCashoutValue)}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleTriggerCashout}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Продати</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspect Skin Details Modal */}
      <SkinInspectModal
        skin={inspectingSkin}
        onClose={() => setInspectingSkin(null)}
        isSelected={inspectingSkin ? selectedIds.has(inspectingSkin.id) : false}
        onSelectAndClose={(skin) => {
          toggleSelect(skin.id);
          setInspectingSkin(null);
        }}
      />

      {/* Cashout Trade Offer Simulation Modal */}
      <TradeOfferModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        selectedSkins={selectedSkinsList}
        totalPayout={totalCashoutValue}
        paymentMethod={selectedPaymentMethod}
        destinationAddress={destinationInput}
        userTradeUrl={tradeUrlInput}
        onTradeCompleted={handleTradeCompleted}
      />

    </section>
  );
};