import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Search,
  Plus,
  X,
  Copy,
  Check,
  ChevronDown,
  Globe,
  Star,
  Users,
  Lock,
  Flame,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/LogoIcon';
import { SkinImage } from '../components/SkinImage';
import { MOCK_CS2_INVENTORY } from '../data/skinsData';
import { INITIAL_P2P_ORDERS, P2P_PAYMENT_METHODS } from '../data/p2pData';
import { getP2PText } from '../data/pagesTranslations';
import type { P2POrder, P2POrderType, P2PPaymentMethodId, P2PPaymentOption } from '../types/p2p';
import type { Currency } from '../types';

interface P2PPageProps {
  onNavigateHome: () => void;
  onOpenLogin: () => void;
}

export const P2PPage: React.FC<P2PPageProps> = ({ onNavigateHome, onOpenLogin }) => {
  const { user } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, currentOption } = useLanguage();
  const pt = (key: string) => getP2PText(language, key);

  // Orders State
  const [orders, setOrders] = useState<P2POrder[]>(INITIAL_P2P_ORDERS);
  const [myOrderIds, setMyOrderIds] = useState<Set<string>>(new Set());

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'sell' | 'buy' | 'my'>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');

  // UI Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDealOrder, setActiveDealOrder] = useState<P2POrder | null>(null);
  const [dealStep, setDealStep] = useState<1 | 2 | 3 | 4>(1);
  const [dealSelectedPayment, setDealSelectedPayment] = useState<P2PPaymentOption>(P2P_PAYMENT_METHODS[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessingDeal, setIsProcessingDeal] = useState(false);

  // New Order Form State
  const [newOrderType, setNewOrderType] = useState<P2POrderType>('sell');
  const [newOrderSkinId, setNewOrderSkinId] = useState<string>(MOCK_CS2_INVENTORY[0].id);
  const [newOrderPrice, setNewOrderPrice] = useState<string>('1200');
  const [newOrderPaymentMethods, setNewOrderPaymentMethods] = useState<P2PPaymentMethodId[]>(['monobank', 'privatbank']);
  const [newOrderRequisites, setNewOrderRequisites] = useState<string>('4441 1144 8829 3312');
  const [newOrderNote, setNewOrderNote] = useState<string>('');

  // Dropdowns in Header
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      if (activeTab === 'sell' && order.type !== 'sell') return false;
      if (activeTab === 'buy' && order.type !== 'buy') return false;
      if (activeTab === 'my' && !myOrderIds.has(order.id)) return false;

      // Payment method filter
      if (selectedPaymentFilter !== 'all') {
        if (!order.paymentMethods.includes(selectedPaymentFilter as P2PPaymentMethodId)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryFilter !== 'all') {
        const hasCategory = order.skins.some(s => {
          if (selectedCategoryFilter === 'Knife' || selectedCategoryFilter === 'Gloves') {
            return s.category === selectedCategoryFilter;
          }
          if (selectedCategoryFilter === 'Sniper') return s.category === 'Sniper' || s.weapon === 'AWP';
          if (selectedCategoryFilter === 'Rifle') return s.category === 'Rifle';
          if (selectedCategoryFilter === 'Pistol') return s.category === 'Pistol';
          return true;
        });
        if (!hasCategory) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSkin = order.skins.some(s => 
          s.name.toLowerCase().includes(q) || s.weapon.toLowerCase().includes(q)
        );
        const matchesCreator = order.creator.name.toLowerCase().includes(q);
        const matchesNote = order.note?.toLowerCase().includes(q);
        if (!matchesSkin && !matchesCreator && !matchesNote) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'price-desc') return b.priceUsd - a.priceUsd;
      if (sortBy === 'rating') return b.creator.rating - a.creator.rating;
      return 0; // default newest
    });
  }, [orders, activeTab, myOrderIds, selectedPaymentFilter, selectedCategoryFilter, searchQuery, sortBy]);

  // Handle Order Creation
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const skin = MOCK_CS2_INVENTORY.find(s => s.id === newOrderSkinId) || MOCK_CS2_INVENTORY[0];
    const price = parseFloat(newOrderPrice) || skin.price;

    const newOrder: P2POrder = {
      id: `p2p-user-${Date.now().toString().slice(-4)}`,
      type: newOrderType,
      creator: {
        name: user?.personaname || (language === 'EN' ? 'You (My account)' : (language === 'RU' ? 'Вы (Мой аккаунт)' : 'Ви (Мій акаунт)')),
        avatar: user?.avatarfull || 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        steamId64: user?.steamId64 || '76561198000000000',
        rating: 5.0,
        totalTrades: 1,
        successRate: 100,
        avgResponseMinutes: 1,
        isOnline: true,
        isVerified: true,
      },
      skins: [skin],
      priceUsd: price,
      paymentMethods: newOrderPaymentMethods.length > 0 ? newOrderPaymentMethods : ['monobank'],
      paymentDetailsSummary: newOrderRequisites,
      tradeHoldDays: 0,
      steamMarketDiffPercent: -Math.round(((skin.steamPrice - price) / skin.steamPrice) * 100),
      note: newOrderNote || (language === 'EN' ? 'P2P Escrow deal via SkinToCash' : (language === 'RU' ? 'P2P сделка через гарант SkinToCash' : 'P2P угода через гарант SkinToCash')),
      createdAt: language === 'EN' ? 'Just now' : (language === 'RU' ? 'Только что' : 'Щойно'),
      status: 'active',
    };

    setOrders([newOrder, ...orders]);
    setMyOrderIds(prev => new Set([...prev, newOrder.id]));
    setIsCreateModalOpen(false);
    setActiveTab('my');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Open Deal Room
  const handleOpenDeal = (order: P2POrder) => {
    setActiveDealOrder(order);
    setDealStep(1);
    const defaultMethod = P2P_PAYMENT_METHODS.find(m => order.paymentMethods.includes(m.id)) || P2P_PAYMENT_METHODS[0];
    setDealSelectedPayment(defaultMethod);
  };

  // Step advancement in Deal Room
  const handleProceedDealStep = () => {
    if (dealStep === 1) {
      setDealStep(2);
    } else if (dealStep === 2) {
      setIsProcessingDeal(true);
      setTimeout(() => {
        setIsProcessingDeal(false);
        setDealStep(3);
        // Simulate Escrow confirming payment and sending Steam offer
        setTimeout(() => {
          setDealStep(4);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 }
          });
        }, 3000);
      }, 1500);
    } else if (dealStep === 4) {
      setActiveDealOrder(null);
      setDealStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-[#070A0E]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-nowrap w-full">
          
          {/* Left: Brand Logo + Back to Home */}
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

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 text-xs font-['Space_Grotesk'] font-bold text-emerald-400">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{pt("p2p.title")}</span>
              </span>

              <button
                onClick={onNavigateHome}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['Space_Grotesk'] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pt("p2p.home")}</span>
              </button>
            </div>
          </div>

          {/* Right: Currency + Lang + Action Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['JetBrains_Mono'] font-bold text-white transition-all cursor-pointer"
              >
                <span className="text-emerald-400 font-extrabold">{currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 bg-[#0B1017] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    {currencies.map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-['JetBrains_Mono'] flex items-center justify-between transition-colors cursor-pointer ${
                          currency === curr.code
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span>{curr.label}</span>
                        {currency === curr.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-white transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentOption.flag}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 bg-[#0B1017] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-['Space_Grotesk'] flex items-center justify-between transition-colors cursor-pointer ${
                          language === lang.code
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button: Create Order */}
            <button
              onClick={() => {
                if (!user) {
                  onOpenLogin();
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{pt("p2p.createOrder")}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Banner with Escrow Security & Live Metrics */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pt("p2p.secureEscrow")}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
                {pt("p2p.heroTitle1")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  {pt("p2p.heroTitle2")}
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {pt("p2p.heroDesc")}
              </p>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#0B1017] border border-white/[0.08] text-center">
                <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>{pt("p2p.statVol")}</span>
                </div>
                <div className="text-lg font-black font-['JetBrains_Mono'] text-emerald-400">
                  $142,850+
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1017] border border-white/[0.08] text-center">
                <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{pt("p2p.statTime")}</span>
                </div>
                <div className="text-lg font-black font-['JetBrains_Mono'] text-cyan-400">
                  ~85s
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1017] border border-white/[0.08] text-center col-span-2 sm:col-span-1">
                <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  <span>{pt("p2p.statFee")}</span>
                </div>
                <div className="text-lg font-black font-['JetBrains_Mono'] text-white">
                  {pt("p2p.statFeeVal")}
                </div>
              </div>
            </div>
          </div>

          {/* Toggle How It Works Explanation */}
          <div className="pt-2">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-xs font-['Space_Grotesk'] text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer underline"
            >
              <span>{showHowItWorks ? pt("p2p.hideHowItWorks") : pt("p2p.howItWorks")}</span>
            </button>

            <AnimatePresence>
              {showHowItWorks && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-5 rounded-3xl bg-[#0B1017] border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                >
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center font-['JetBrains_Mono']">
                      1
                    </div>
                    <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                      {pt("p2p.step1Title")}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {pt("p2p.step1Desc")}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center font-['JetBrains_Mono']">
                      2
                    </div>
                    <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                      {pt("p2p.step2Title")}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {pt("p2p.step2Desc")}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center font-['JetBrains_Mono']">
                      3
                    </div>
                    <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                      {pt("p2p.step3Title")}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {pt("p2p.step3Desc")}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center font-['JetBrains_Mono']">
                      4
                    </div>
                    <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                      {pt("p2p.step4Title")}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {pt("p2p.step4Desc")}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Main Filter & Navigation Strip */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Tabs: Всі / Купити (Ордери на продаж) / Продати (Ордери на купівлю) / Мої ордери */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{pt("p2p.tabAll")}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-['JetBrains_Mono']">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sell')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'sell'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pt("p2p.tabBuy")}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-['JetBrains_Mono']">
                {orders.filter(o => o.type === 'sell').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'buy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{pt("p2p.tabSell")}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-['JetBrains_Mono']">
                {orders.filter(o => o.type === 'buy').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-['Space_Grotesk'] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'my'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{pt("p2p.tabMy")} ({myOrderIds.size})</span>
            </button>
          </div>

          {/* Quick Create Button in Toolbar */}
          <button
            onClick={() => {
              if (!user) {
                onOpenLogin();
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{pt("p2p.createOrder")}</span>
          </button>
        </div>

        {/* Second Filter Bar: Search + Category + Payment Method + Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Payment Method Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedPaymentFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedPaymentFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {pt("p2p.allPayments")}
            </button>

            {P2P_PAYMENT_METHODS.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentFilter(method.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedPaymentFilter === method.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <span>{method.icon}</span>
                <span>{method.name.split(' (')[0]}</span>
              </button>
            ))}
          </div>

          {/* Search Input & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={pt("p2p.searchPlaceholder")}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-['JetBrains_Mono'] focus:border-emerald-500 outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'rating')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-['Space_Grotesk'] outline-none cursor-pointer"
            >
              <option value="newest">{pt("p2p.sortNewest")}</option>
              <option value="price-asc">{pt("p2p.sortPriceAsc")}</option>
              <option value="price-desc">{pt("p2p.sortPriceDesc")}</option>
              <option value="rating">{pt("p2p.sortRating")}</option>
            </select>
          </div>

        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#0B1017] border border-white/[0.08] space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              {pt("p2p.emptyTitle")}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {pt("p2p.emptyDesc")}
            </p>
            <button
              onClick={() => {
                setSelectedPaymentFilter('all');
                setSelectedCategoryFilter('all');
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs font-['Space_Grotesk'] cursor-pointer"
            >
              {pt("p2p.resetFilters")}
            </button>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map(order => {
            const primarySkin = order.skins[0];
            const isSell = order.type === 'sell';

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-3xl bg-[#0B1017] border border-white/[0.08] hover:border-emerald-500/40 p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] flex flex-col justify-between gap-4"
              >
                {/* Card Top: Order Type Badge + Steam Difference */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-['Space_Grotesk'] font-bold uppercase tracking-wider ${
                      isSell 
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                    }`}>
                      {isSell ? <Zap className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      <span>{isSell ? pt("p2p.sellBadge") : pt("p2p.buyBadge")}</span>
                    </span>

                    <span className={`text-[11px] font-['JetBrains_Mono'] font-bold ${
                      order.steamMarketDiffPercent < 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {order.steamMarketDiffPercent < 0 
                        ? `${order.steamMarketDiffPercent}% ${pt("p2p.cheaper")}`
                        : `+${order.steamMarketDiffPercent}% ${pt("p2p.above")}`}
                    </span>
                  </div>

                  {/* Skin Showcase Visual */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-white/[0.04] p-3 flex flex-col items-center justify-center overflow-hidden group-hover:border-emerald-500/20 transition-all">
                    {/* Background glow by rarity */}
                    <div 
                      className="absolute inset-0 opacity-20 filter blur-2xl transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: primarySkin.rarityColor }}
                    />

                    <div className="relative z-10 w-full h-28 flex items-center justify-center">
                      <SkinImage
                        src={primarySkin.image}
                        fallbackSrc={primarySkin.fallbackImage}
                        alt={primarySkin.name}
                        className="max-h-28 max-w-[85%] object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Skin Name & Wear */}
                    <div className="relative z-10 text-center w-full mt-2">
                      <div className="text-xs font-bold text-white font-['Space_Grotesk'] truncate">
                        {primarySkin.name}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-0.5 text-[10px] font-['JetBrains_Mono'] text-slate-400">
                        <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300 font-bold">
                          {primarySkin.wear}
                        </span>
                        <span>Float: {primarySkin.float.toFixed(4)}</span>
                        {primarySkin.phase && (
                          <span className="text-emerald-400 font-semibold">{primarySkin.phase}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 uppercase tracking-wider">
                        {isSell ? pt("p2p.sellerPrice") : pt("p2p.buyerBudget")}
                      </div>
                      <div className="text-xl font-extrabold font-['JetBrains_Mono'] text-white">
                        {formatPrice(order.priceUsd)}
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-['JetBrains_Mono'] text-slate-400">
                      <div>Steam: ~{formatPrice(primarySkin.steamPrice)}</div>
                    </div>
                  </div>

                  {/* Accepted Payment Badges */}
                  <div className="mt-3 flex items-center gap-1 flex-wrap">
                    {order.paymentMethods.map(methodId => {
                      const method = P2P_PAYMENT_METHODS.find(m => m.id === methodId);
                      if (!method) return null;
                      return (
                        <span
                          key={methodId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-['JetBrains_Mono'] text-slate-300"
                        >
                          <span>{method.icon}</span>
                          <span>{method.name.split(' (')[0]}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Note from creator */}
                  {order.note && (
                    <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 italic bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
                      "{order.note}"
                    </p>
                  )}
                </div>

                {/* Card Bottom: Trader Info + Action CTA */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={order.creator.avatar}
                          alt={order.creator.name}
                          className="w-7 h-7 rounded-full border border-emerald-500/40 object-cover"
                        />
                        {order.creator.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate font-['Space_Grotesk']">
                          {order.creator.name}
                        </div>
                        <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 flex items-center gap-1">
                          <span className="text-amber-400">★ {order.creator.rating.toFixed(2)}</span>
                          <span>•</span>
                          <span>{order.creator.totalTrades} {pt("p2p.tradesCount")}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-['JetBrains_Mono'] text-slate-500 whitespace-nowrap">
                      {order.createdAt}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleOpenDeal(order)}
                    className={`w-full py-2.5 rounded-2xl font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSell
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    }`}
                  >
                    <span>{isSell ? pt("p2p.buyBtn") : pt("p2p.sellBtn")}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* CREATE P2P ORDER MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B1017] border border-white/10 p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                      {pt("p2p.createTitle")}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {pt("p2p.createSubtitle")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-5">
                
                {/* 1. Order Type Switcher */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {pt("p2p.opType")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewOrderType('sell')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        newOrderType === 'sell'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold font-['Space_Grotesk'] text-sm text-emerald-400 mb-0.5">
                        <Zap className="w-4 h-4" />
                        <span>{pt("p2p.iSell")}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {pt("p2p.iSellDesc")}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewOrderType('buy')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        newOrderType === 'buy'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold font-['Space_Grotesk'] text-sm text-cyan-400 mb-0.5">
                        <Users className="w-4 h-4" />
                        <span>{pt("p2p.iBuy")}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {pt("p2p.iBuyDesc")}
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Select Skin */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {pt("p2p.chooseItem")}
                  </label>
                  <select
                    value={newOrderSkinId}
                    onChange={(e) => {
                      setNewOrderSkinId(e.target.value);
                      const skin = MOCK_CS2_INVENTORY.find(s => s.id === e.target.value);
                      if (skin) setNewOrderPrice(skin.price.toString());
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs font-['JetBrains_Mono'] outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {MOCK_CS2_INVENTORY.map(skin => (
                      <option key={skin.id} value={skin.id}>
                        {skin.name} ({skin.wear}) — Steam: ~${skin.steamPrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Desired Price */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {pt("p2p.desiredPrice")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-['JetBrains_Mono']">
                      $
                    </span>
                    <input
                      type="number"
                      value={newOrderPrice}
                      onChange={(e) => setNewOrderPrice(e.target.value)}
                      placeholder="1200"
                      className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm font-['JetBrains_Mono'] font-bold outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-400 font-['JetBrains_Mono']">
                    ≈ {formatPrice(parseFloat(newOrderPrice) || 0)} {language === 'EN' ? 'in selected currency' : (language === 'RU' ? 'в выбранной валюте' : 'у вибраній валюті')}
                  </div>
                </div>

                {/* 4. Payment Methods */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {newOrderType === 'sell' ? pt("p2p.destPayLabelSell") : pt("p2p.destPayLabelBuy")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {P2P_PAYMENT_METHODS.slice(0, 4).map(method => {
                      const isSelected = newOrderPaymentMethods.includes(method.id);
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setNewOrderPaymentMethods(newOrderPaymentMethods.filter(id => id !== method.id));
                            } else {
                              setNewOrderPaymentMethods([...newOrderPaymentMethods, method.id]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-['Space_Grotesk'] flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{method.icon}</span>
                          <span>{method.name.split(' (')[0]}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Requisites / Card */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {newOrderType === 'sell' ? pt("p2p.reqLabelSell") : pt("p2p.reqLabelBuy")}
                  </label>
                  <input
                    type="text"
                    value={newOrderRequisites}
                    onChange={(e) => setNewOrderRequisites(e.target.value)}
                    placeholder="4441 •••• •••• 1234 (Monobank)"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs font-['JetBrains_Mono'] outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* 6. Optional Note */}
                <div>
                  <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                    {pt("p2p.commentLabel")}
                  </label>
                  <input
                    type="text"
                    value={newOrderNote}
                    onChange={(e) => setNewOrderNote(e.target.value)}
                    placeholder={pt("p2p.commentPlaceholder")}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs font-['Space_Grotesk'] outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{pt("p2p.publishOrder")}</span>
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE P2P DEAL ROOM MODAL (STEP-BY-STEP SIMULATION) */}
      <AnimatePresence>
        {activeDealOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDealOrder(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1017] border border-white/10 p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 font-bold uppercase tracking-wider">
                      {pt("p2p.dealTitle")} #{activeDealOrder.id}
                    </div>
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                      {activeDealOrder.type === 'sell' ? pt("p2p.buyBtn") : pt("p2p.sellBtn")}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveDealOrder(null)}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Tracker Indicator */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-['Space_Grotesk']">
                <div className={`p-2 rounded-xl border ${
                  dealStep >= 1 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}>
                  {pt("p2p.step1")}
                </div>
                <div className={`p-2 rounded-xl border ${
                  dealStep >= 2 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}>
                  {pt("p2p.step2")}
                </div>
                <div className={`p-2 rounded-xl border ${
                  dealStep >= 3 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}>
                  {pt("p2p.step3")}
                </div>
                <div className={`p-2 rounded-xl border ${
                  dealStep >= 4 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}>
                  {pt("p2p.step4")}
                </div>
              </div>

              {/* STEP 1: CONFIRM TERMS */}
              {dealStep === 1 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-4">
                    <SkinImage
                      src={activeDealOrder.skins[0].image}
                      fallbackSrc={activeDealOrder.skins[0].fallbackImage}
                      alt={activeDealOrder.skins[0].name}
                      className="w-20 h-16 object-contain shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {activeDealOrder.skins[0].name}
                      </div>
                      <div className="text-xs text-slate-400 font-['JetBrains_Mono']">
                        {activeDealOrder.skins[0].wearName} • Float: {activeDealOrder.skins[0].float.toFixed(4)}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-400 font-['JetBrains_Mono'] mt-1">
                        {formatPrice(activeDealOrder.priceUsd)}
                      </div>
                    </div>
                  </div>

                  {/* Payment method selection */}
                  <div>
                    <label className="text-xs font-bold font-['Space_Grotesk'] text-slate-300 mb-2 block">
                      {pt("p2p.choosePayMethod")}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {P2P_PAYMENT_METHODS.filter(m => activeDealOrder.paymentMethods.includes(m.id)).map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setDealSelectedPayment(method)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                            dealSelectedPayment.id === method.id
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            <span className="text-xs font-bold font-['Space_Grotesk']">{method.name}</span>
                          </div>
                          {dealSelectedPayment.id === method.id && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Escrow Guarantee Notice */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 font-['Space_Grotesk']">
                      <Lock className="w-4 h-4" />
                      <span>{pt("p2p.escrowProtected")}</span>
                    </div>
                    <p className="leading-relaxed">
                      {pt("p2p.escrowProtectedDesc")}
                    </p>
                  </div>

                  <button
                    onClick={handleProceedDealStep}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{pt("p2p.openDealBtn")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT REQUISITES */}
              {dealStep === 2 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300 font-['JetBrains_Mono']">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>{pt("p2p.timeToPay")}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{language === 'EN' ? '14:59 min' : '14:59 мин'}</span>
                  </div>

                  {/* Requisites Card */}
                  <div className="p-5 rounded-2xl bg-[#070A0E] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{pt("p2p.dealMethod")}</span>
                      <strong className="text-white flex items-center gap-1.5 font-['Space_Grotesk']">
                        <span>{dealSelectedPayment.icon}</span>
                        <span>{dealSelectedPayment.name}</span>
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{pt("p2p.sumToPay")}</span>
                      <strong className="text-lg text-emerald-400 font-['JetBrains_Mono']">
                        {formatPrice(activeDealOrder.priceUsd)}
                      </strong>
                    </div>

                    <div className="pt-2 border-t border-white/[0.08]">
                      <div className="text-xs text-slate-400 mb-1.5">{pt("p2p.destDetails")}</div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold font-['JetBrains_Mono'] text-white">
                          {activeDealOrder.paymentDetailsSummary}
                        </span>
                        <button
                          onClick={() => handleCopy(activeDealOrder.paymentDetailsSummary, 'req')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {copiedField === 'req' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'req' ? pt("p2p.copied") : pt("p2p.copy")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isProcessingDeal}
                    onClick={handleProceedDealStep}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingDeal ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin text-slate-950" />
                        <span>{pt("p2p.verifyingEscrow")}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{pt("p2p.confirmPaid")}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 3: STEAM TRADE OFFER */}
              {dealStep === 3 && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40 animate-pulse">
                    <ArrowLeftRight className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {pt("p2p.tradeGen")}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    <>{pt("p2p.tradeGenDesc")}</>
                  </p>
                  <div className="text-xs text-emerald-400 font-['JetBrains_Mono']">
                    {pt("p2p.steamGuardWait")}
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {dealStep === 4 && (
                <div className="p-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-black text-white font-['Space_Grotesk']">
                    {pt("p2p.dealDone")}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    <>{pt("p2p.dealDoneDesc")}</>
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-['JetBrains_Mono'] space-y-1 text-slate-400">
                    <div>{pt("p2p.dealAmount")} <span className="text-emerald-400 font-bold">{formatPrice(activeDealOrder.priceUsd)}</span></div>
                    <div>{pt("p2p.dealMethod")} <span className="text-white">{dealSelectedPayment.name}</span></div>
                    <div>Escrow ID: <span className="text-slate-300">SC-{activeDealOrder.id.toUpperCase()}</span></div>
                  </div>

                  <button
                    onClick={handleProceedDealStep}
                    className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-['Space_Grotesk'] cursor-pointer transition-all"
                  >
                    {pt("p2p.returnToList")}
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
