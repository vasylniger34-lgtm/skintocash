import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Plus,
  X,
  ChevronDown,
  Check,
  Globe,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Clock,
  Send,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/LogoIcon';
import { STEAM_REVIEWS_DATA, type SteamReview } from '../data/steamReviewsData';
import { getReviewsText } from '../data/pagesTranslations';
import type { Currency } from '../types';

interface ReviewsPageProps {
  onNavigateHome: () => void;
  onOpenLogin?: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigateHome, onOpenLogin }) => {
  const { user } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { language, setLanguage, currentOption } = useLanguage();
  const tr = (key: string, params?: Record<string, string | number>) => getReviewsText(language, key, params);

  // Reviews state with optimistic local reviews support
  const [reviewsList, setReviewsList] = useState<SteamReview[]>(STEAM_REVIEWS_DATA);
  
  // Header dropdowns
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '10' | '9' | '8' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Leave Review Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState<number>(10);
  const [newAuthor, setNewAuthor] = useState('');
  const [newSteamId, setNewSteamId] = useState('');
  const [newSkinSold, setNewSkinSold] = useState('AK-47 | Ice Coaled (FN)');
  const [newText, setNewText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Currencies list
  const currencies: { code: Currency; label: string; icon: string }[] = [
    { code: 'USD', label: 'USD ($)', icon: '$' },
    { code: 'EUR', label: 'EUR (€)', icon: '€' },
    { code: 'UAH', label: 'UAH (₴)', icon: '₴' },
    { code: 'RUB', label: 'RUB (₽)', icon: '₽' },
    { code: 'CRYPTO', label: 'USDT (₮)', icon: '₮' },
  ];

  // Summary statistics calculated dynamically
  const stats = useMemo(() => {
    const total = reviewsList.length;
    const avgRating = (reviewsList.reduce((acc, r) => acc + r.rating, 0) / (total || 1)).toFixed(1);
    const count10 = reviewsList.filter(r => r.rating === 10).length;
    const count9 = reviewsList.filter(r => r.rating === 9).length;
    const count8 = reviewsList.filter(r => r.rating === 8).length;
    const countLow = reviewsList.filter(r => r.rating < 8).length;
    
    return {
      total,
      avgRating,
      count10,
      count9,
      count8,
      countLow,
      pct10: Math.round((count10 / total) * 100),
      pct9: Math.round((count9 / total) * 100),
      pct8: Math.round((count8 / total) * 100),
      pctLow: Math.round((countLow / total) * 100),
    };
  }, [reviewsList]);

  // Filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviewsList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.author.toLowerCase().includes(q) || 
        r.text.toLowerCase().includes(q) ||
        r.steamId.includes(q) ||
        r.skinSold.toLowerCase().includes(q)
      );
    }

    // Rating filter
    if (ratingFilter === '10') {
      result = result.filter(r => r.rating === 10);
    } else if (ratingFilter === '9') {
      result = result.filter(r => r.rating === 9);
    } else if (ratingFilter === '8') {
      result = result.filter(r => r.rating === 8);
    } else if (ratingFilter === 'low') {
      result = result.filter(r => r.rating < 8);
    }

    // Sorting
    if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }
    // 'newest' retains original order (which is newest first from scraper)

    return result;
  }, [reviewsList, searchQuery, ratingFilter, sortBy]);

  // Total pages
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleOpenReviewModal = () => {
    if (user) {
      setNewAuthor(user.personaname || '');
      setNewSteamId(user.steamId64 || '');
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const steamId = newSteamId.trim() || (user?.steamId64 || '76561198000000000');
    const authorName = newAuthor.trim() || (user?.personaname || 'CS2 Trader');
    const userAvatar = user?.avatarmedium || 'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';

    const newRev: SteamReview = {
      id: `rev-${Date.now()}`,
      steamId,
      profileUrl: `https://steamcommunity.com/profiles/${steamId}`,
      avatar: userAvatar,
      author: authorName,
      date: tr('reviews.justNow'),
      rating: newRating,
      text: newText.trim(),
      skinSold: newSkinSold || 'AK-47 | Ice Coaled (FN)',
      payoutAmount: '$85.00',
      payoutMethod: 'Visa/Mastercard Direct',
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setFormSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setNewText('');
      setCurrentPage(1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 pb-20">
      
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#070A0E]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Brand & Page Badge */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="relative flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <LogoIcon size={34} />
              </div>
              <div className="font-['Space_Grotesk'] tracking-tight font-extrabold text-lg sm:text-xl text-white">
                SkinTo<span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">Cash</span>
              </div>
            </button>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            {/* Reviews Badge */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{tr('reviews.steamReviews')}</span>
              </span>

              <button
                onClick={onNavigateHome}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-['Space_Grotesk'] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tr('reviews.home')}</span>
              </button>
            </div>
          </div>

          {/* Right: Currency + Lang + Action Buttons */}
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

            {/* "Залишити відгук" Header CTA */}
            <button
              onClick={handleOpenReviewModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold font-['Space_Grotesk'] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">
                {tr('reviews.leaveReview')}
              </span>
              <span className="sm:hidden">
                {tr('reviews.review')}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION WITH OVERALL TRUST SCORE & BREAKDOWN */}
      <section className="relative pt-8 sm:pt-12 pb-8 border-b border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Sub-badge */}
          <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-slate-400 mb-4">
            <button onClick={onNavigateHome} className="hover:text-emerald-400 transition-colors">
              SkinToCash
            </button>
            <span>/</span>
            <span className="text-emerald-400">
              {tr('reviews.reviewsTitle')}
            </span>
          </div>

          {/* Grid Layout: Title & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {tr('reviews.verifiedBadge')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight leading-tight">
                <>{tr('reviews.headlineRealPlayers')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{tr('reviews.headlineAccent')}</span></>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {tr('reviews.heroDesc')}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{stats.total}+ {tr('reviews.statsCount')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-slate-200">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{tr('reviews.avgPayout')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{tr('reviews.steamApiVerified')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Score & Rating Distribution Box (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1017] to-[#0E1520] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-6 border-b border-white/[0.08]">
                {/* Big Score */}
                <div className="text-center sm:text-left shrink-0">
                  <div className="text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight flex items-baseline justify-center sm:justify-start gap-1">
                    <span>{stats.avgRating}</span>
                    <span className="text-xl text-slate-400 font-bold">/ 10</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-400 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-['JetBrains_Mono'] mt-1">
                    {tr('reviews.excellentRating')}
                  </div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 w-full space-y-2 text-xs font-['JetBrains_Mono']">
                  {/* 10 / 10 */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-400 text-right">10 ★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats.pct10}%` }} />
                    </div>
                    <span className="w-8 text-slate-300 font-bold">{stats.pct10}%</span>
                  </div>

                  {/* 9 / 10 */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-400 text-right">9 ★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: `${stats.pct9}%` }} />
                    </div>
                    <span className="w-8 text-slate-300 font-bold">{stats.pct9}%</span>
                  </div>

                  {/* 8 / 10 */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-400 text-right">8 ★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-teal-500/70 rounded-full" style={{ width: `${stats.pct8}%` }} />
                    </div>
                    <span className="w-8 text-slate-300 font-bold">{stats.pct8}%</span>
                  </div>

                  {/* 1-7 / 10 */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-400 text-right">≤ 7 ★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-slate-500/60 rounded-full" style={{ width: `${stats.pctLow}%` }} />
                    </div>
                    <span className="w-8 text-slate-300 font-bold">{stats.pctLow}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Inside Box */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                  {tr('reviews.madeTradeRecently')}
                </span>
                <button
                  onClick={handleOpenReviewModal}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tr('reviews.writeReview')}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FILTER & SEARCH TOOLBAR */}
      <section className="sticky top-16 z-30 bg-[#070A0E]/95 backdrop-blur-md py-4 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Filter Pills (All, 10, 9, 8, Low) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <button
                onClick={() => { setRatingFilter('all'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  ratingFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                {tr('reviews.allReviews')} ({stats.total})
              </button>

              <button
                onClick={() => { setRatingFilter('10'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  ratingFilter === '10'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>10 / 10 ({stats.count10})</span>
              </button>

              <button
                onClick={() => { setRatingFilter('9'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  ratingFilter === '9'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>9 / 10 ({stats.count9})</span>
              </button>

              <button
                onClick={() => { setRatingFilter('8'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  ratingFilter === '8'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>8 / 10 ({stats.count8})</span>
              </button>

              <button
                onClick={() => { setRatingFilter('low'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  ratingFilter === 'low'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                ≤ 7 / 10 ({stats.countLow})
              </button>
            </div>

            {/* Right: Search Box & Sort dropdown */}
            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder={tr('reviews.searchPlaceholder')}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-['Space_Grotesk']"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all font-['Space_Grotesk'] cursor-pointer"
                >
                  <option value="newest" className="bg-[#0B1017]">
                    {tr('reviews.sortNewest')}
                  </option>
                  <option value="highest" className="bg-[#0B1017]">
                    {tr('reviews.sortHighest')}
                  </option>
                  <option value="lowest" className="bg-[#0B1017]">
                    {tr('reviews.sortLowest')}
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS GRID LIST */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results counter */}
        <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400 mb-6">
          <div>
            <>{tr('reviews.showing', { from: String(filteredReviews.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1), to: String(Math.min(currentPage * itemsPerPage, filteredReviews.length)), total: String(filteredReviews.length) })}</>
          </div>

          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setRatingFilter('all'); }}
              className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>{tr('reviews.resetFilters')}</span>
            </button>
          )}
        </div>

        {/* Empty state if search found nothing */}
        {filteredReviews.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-2">
              {tr('reviews.noFound')}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              {tr('reviews.noFoundDesc')}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setRatingFilter('all'); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs font-['Space_Grotesk'] cursor-pointer"
            >
              {tr('reviews.showAll')}
            </button>
          </div>
        ) : (
          /* Cards Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentReviews.map((rev) => {
              const isHighRating = rev.rating >= 9;
              return (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-emerald-500/35 transition-all flex flex-col justify-between shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden"
                >
                  {/* Glowing accent border top */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all ${
                    isHighRating 
                      ? 'bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent' 
                      : 'bg-gradient-to-r from-transparent via-teal-500/30 to-transparent'
                  }`} />

                  <div>
                    {/* Header: Avatar, Name, Steam Link & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Steam Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            onError={(e) => {
                              // Fallback default avatar if Steam fastly CDN blocks or expires
                              (e.target as HTMLImageElement).src = 'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';
                            }}
                            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-400 transition-colors"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#070A0E] flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                          </span>
                        </div>

                        {/* Nickname & Steam Profile Link */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold font-['Space_Grotesk'] text-white truncate max-w-[140px] sm:max-w-[160px]">
                              {rev.author}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          </div>

                          {/* Direct clickable Steam Profile link */}
                          <a
                            href={rev.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-slate-400 hover:text-emerald-400 transition-colors mt-0.5 group/link"
                            title={tr('reviews.openProfile', { id: rev.steamId })}
                          >
                            <span>Steam ID: {rev.steamId.slice(-6)}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                          </a>
                        </div>
                      </div>

                      {/* Rating Score Badge */}
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-['JetBrains_Mono'] font-extrabold flex items-center gap-1 border shrink-0 ${
                        rev.rating >= 9
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                          : rev.rating >= 8
                          ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}>
                        <Star className="w-3 h-3 fill-current" />
                        <span>{rev.rating}/10</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 mb-2.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rev.date}</span>
                    </div>

                    {/* Review text comment */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-4 min-h-[44px]">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Transaction metadata verified footer */}
                  <div className="pt-3 border-t border-white/[0.06] font-['JetBrains_Mono'] text-[11px] space-y-1.5">
                    {/* Item sold */}
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        {tr('reviews.traded')}
                      </span>
                      <span className="text-slate-200 font-semibold truncate max-w-[170px]" title={rev.skinSold}>
                        {rev.skinSold}
                      </span>
                    </div>

                    {/* Payout */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">{rev.payoutMethod}:</span>
                      <span className="text-emerald-400 font-bold">{rev.payoutAmount}</span>
                    </div>

                    {/* Steam verified confirmation */}
                    <div className="pt-1.5 flex items-center justify-between text-[10px] text-emerald-400/90 font-bold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {tr('reviews.dealVerifiedSteam')}
                        </span>
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase">CS2 Instant</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
            
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.08] text-xs font-['Space_Grotesk'] font-bold text-white transition-all cursor-pointer"
            >
              ← {tr('reviews.previous')}
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-slate-600 text-xs font-mono">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-['JetBrains_Mono'] font-bold transition-all cursor-pointer ${
                          currentPage === p
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.08] text-xs font-['Space_Grotesk'] font-bold text-white transition-all cursor-pointer"
            >
              {tr('reviews.next')} →
            </button>

          </div>
        )}

      </main>

      {/* MODAL: "ЗАЛИШИТИ ВІДГУК" */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#0B1017] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {formSubmitted ? (
                /* Success screen */
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-black font-['Space_Grotesk'] text-white">
                    {tr('reviews.thankYou')}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    {tr('reviews.thankYouDesc')}
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-['JetBrains_Mono'] font-bold mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{tr('reviews.steamVerification')}</span>
                    </div>
                    <h3 className="text-xl font-black font-['Space_Grotesk'] text-white">
                      {tr('reviews.modalTitle')}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {tr('reviews.modalDesc')}
                    </p>
                  </div>

                  {/* Rating Selector (1 to 10) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-['Space_Grotesk'] font-bold text-slate-300 flex justify-between">
                      <span>{tr('reviews.ratingLabel')}</span>
                      <span className="text-emerald-400 font-['JetBrains_Mono'] font-extrabold">{newRating} / 10 ★</span>
                    </label>

                    <div className="grid grid-cols-10 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewRating(num)}
                          className={`py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold transition-all cursor-pointer ${
                            newRating >= num
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nickname & Steam ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-['Space_Grotesk'] text-slate-300">
                        {tr('reviews.yourNick')}
                      </label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="s1mple_fan_99"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-['Space_Grotesk']"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-['Space_Grotesk'] text-slate-300">
                        {tr('reviews.steamIdOrLink')}
                      </label>
                      <input
                        type="text"
                        value={newSteamId}
                        onChange={(e) => setNewSteamId(e.target.value)}
                        placeholder="76561198..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-['JetBrains_Mono']"
                      />
                    </div>
                  </div>

                  {/* Traded Skin */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-['Space_Grotesk'] text-slate-300">
                      {tr('reviews.skinsTraded')}
                    </label>
                    <input
                      type="text"
                      value={newSkinSold}
                      onChange={(e) => setNewSkinSold(e.target.value)}
                      placeholder="★ Karambit | Doppler (FN)"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-['Space_Grotesk']"
                    />
                  </div>

                  {/* Review Textarea */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-['Space_Grotesk'] text-slate-300">
                      {tr('reviews.yourFeedback')}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder={tr('reviews.feedbackPlaceholder')}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans resize-none"
                    />
                  </div>

                  {/* Security badge note */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {tr('reviews.apiVerifyNote')}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs font-['Space_Grotesk'] shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{tr('reviews.publishBtn')}</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
