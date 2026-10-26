import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
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
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { FIAT_PAYMENT_METHODS } from '../data/paymentMethods';
import { parseSteamTradeUrl } from '../services/steamService';

interface UserCabinetModalProps {
  onLoadInventoryToSandbox?: (tradeUrlOrSteamId: string) => void;
}

type CabinetTab = 'wallet' | 'trade' | 'history' | 'security';

export const UserCabinetModal: React.FC<UserCabinetModalProps> = ({ onLoadInventoryToSandbox }) => {
  const { user, isCabinetOpen, closeCabinet, logout, updateTradeUrl, updateBalance, transactions, addTransaction } = useAuth();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<CabinetTab>('wallet');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(user?.tradeUrl || '');
  const [tradeUrlSaved, setTradeUrlSaved] = useState(false);

  // Cashout / Withdraw state inside cabinet
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawMethod, setWithdrawMethod] = useState(FIAT_PAYMENT_METHODS[0].name);
  const [withdrawDestination, setWithdrawDestination] = useState('5375 **** **** 1290');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  if (!isCabinetOpen || !user) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveTradeUrl = () => {
    const parsed = parseSteamTradeUrl(tradeUrlInput);
    updateTradeUrl(tradeUrlInput);
    setTradeUrlSaved(true);
    setTimeout(() => setTradeUrlSaved(false), 2500);

    if (parsed.isValid && onLoadInventoryToSandbox) {
      // Also update active trade URL
    }
  };

  const handleExecuteWithdraw = () => {
    const currentBalance = user.balance || 0;
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B'],
      });
    }, 1000);
  };

  const handleLoadInventoryShortcut = () => {
    const target = user.tradeUrl || user.steamId64;
    if (onLoadInventoryToSandbox && target) {
      onLoadInventoryToSandbox(target);
      closeCabinet();
    }
  };

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCabinet}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0B1017] border border-white/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.12)] z-10 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Modal Header Profile Banner */}
          <div className="relative border-b border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-7 shrink-0">
            <button
              onClick={closeCabinet}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pr-10">
              
              {/* User Avatar + Nickname + Steam ID */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-teal-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] overflow-hidden">
                    <img
                      src={user.avatarfull || user.avatar}
                      alt={user.personaname}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  {/* Status Indicator */}
                  <span 
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B1017] ${statusColor} shadow-[0_0_10px_rgba(16,185,129,0.8)]`} 
                    title={statusLabel}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
                      {user.personaname}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 font-['JetBrains_Mono']">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Steam Verified
                    </span>
                    {user.loccountrycode && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] font-['JetBrains_Mono'] text-slate-300 uppercase">
                        🇺🇦 {user.loccountrycode}
                      </span>
                    )}
                  </div>

                  {/* SteamID and Profile URL */}
                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
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
                      <span>Профіль Steam</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>

                  {/* Badges line: Steam Level, VAC Clean, Member since */}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 font-['JetBrains_Mono']">
                      <Award className="w-3 h-3 text-amber-400" />
                      Рівень Steam {user.steamLevel || 1}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 font-['JetBrains_Mono']">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      VAC: Без блокувань
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-['JetBrains_Mono']">
                      З нами з {user.joinedAt || '2024'} р.
                    </span>
                  </div>
                </div>
              </div>

              {/* Log out button */}
              <button
                onClick={logout}
                className="self-end sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-xs font-['Space_Grotesk'] font-medium text-red-400 hover:text-red-300 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Вийти</span>
              </button>

            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-white/[0.05] pt-4">
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-semibold transition-all cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Гаманець & Баланс</span>
              </button>

              <button
                onClick={() => setActiveTab('trade')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-semibold transition-all cursor-pointer ${
                  activeTab === 'trade'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>Steam Trade URL</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-semibold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Історія угод ({transactions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-semibold transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Безпека</span>
              </button>
            </div>
          </div>

          {/* Modal Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

            {/* TAB 1: WALLET & BALANCES */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                
                {/* Master Balance Card */}
                <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-[#0F172A] border border-emerald-500/30 p-6 sm:p-7 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Wallet className="w-36 h-36 text-emerald-400" />
                  </div>

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        Доступний баланс SkinToCash
                      </div>
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['JetBrains_Mono'] text-white tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        {formatPrice(user.balance || 0)}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Гроші доступні до миттєвого виведення на банківську карту чи криптовалютний гаманець.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        onClick={() => setIsWithdrawing(!isWithdrawing)}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        <span>Вивести кошти</span>
                      </button>

                      <button
                        onClick={handleLoadInventoryShortcut}
                        className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white font-['Space_Grotesk'] font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>Продати скіни CS2</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Cashout Drawer */}
                  <AnimatePresence>
                    {isWithdrawing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-white/[0.08]"
                      >
                        <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-3">
                          Швидке виведення коштів:
                        </h4>

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
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-['JetBrains_Mono'] text-slate-400 mb-1.5">
                              Метод виплати
                            </label>
                            <select
                              value={withdrawMethod}
                              onChange={(e) => setWithdrawMethod(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                            >
                              <option value="Monobank (UAH)">Monobank (UAH ₴)</option>
                              <option value="PrivatBank (UAH)">ПриватБанк (UAH ₴)</option>
                              <option value="Visa / Mastercard (UAH)">Будь-яка карта України (Visa/MC)</option>
                              <option value="Tether USDT (TRC-20)">Tether USDT (TRC-20)</option>
                              <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-xs font-['JetBrains_Mono'] text-slate-400 mb-1.5">
                            Номер картки або USDT гаманець:
                          </label>
                          <input
                            type="text"
                            value={withdrawDestination}
                            onChange={(e) => setWithdrawDestination(e.target.value)}
                            placeholder="5375 0000 0000 0000 або TWK8..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-sm focus:border-emerald-500/50 outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setIsWithdrawing(false)}
                            className="px-4 py-2 text-xs font-['Space_Grotesk'] text-slate-400 hover:text-white"
                          >
                            Скасувати
                          </button>

                          <button
                            disabled={isProcessingWithdraw || (user.balance || 0) < withdrawAmount}
                            onClick={handleExecuteWithdraw}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                      <span>Всього виведено:</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] text-white">
                      {formatPrice(user.totalWithdrawn || 420.00)}
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-1 font-['JetBrains_Mono']">
                      100% успішних розрахунків
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                      <span>Успішних угод:</span>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] text-white">
                      {user.totalSales || 7} угод
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-['JetBrains_Mono']">
                      Середній час: 42 сек
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-['Space_Grotesk'] mb-2">
                      <span>Комісія платформи:</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] text-emerald-400">
                      0.0% (VIP)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-['JetBrains_Mono']">
                      Акційний промокод активний
                    </div>
                  </div>
                </div>

                {/* Referral Program Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-emerald-950/20 border border-cyan-500/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold font-['Space_Grotesk'] text-cyan-400 mb-1">
                      <Flame className="w-4 h-4 text-cyan-400" />
                      Реферальна програма SkinToCash
                    </div>
                    <p className="text-xs text-slate-300">
                      Діліться вашим реферальним посиланням та отримуйте <strong className="text-emerald-400">+1.5%</strong> з кожного трейду ваших друзів довічно!
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(`https://skintocash.com/ref/${user.steamId64}`, 'ref')}
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-['Space_Grotesk'] font-bold text-cyan-300 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedField === 'ref' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Посилання скопійовано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопіювати реф-лінк</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: STEAM TRADE URL SETTINGS */}
            {activeTab === 'trade' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-5">
                  <div>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mb-1">
                      Ваш Steam Trade URL (Посилання на обмін)
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Трейд-посилання необхідне для автоматичної відправки вам трейд-оферів від наших ботів у Steam. Воно не дає доступу до акаунту та є абсолютно безпечним.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] text-slate-300 mb-2 font-medium">
                      Введіть або оновіть Trade URL:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={tradeUrlInput}
                        onChange={(e) => setTradeUrlInput(e.target.value)}
                        placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-['JetBrains_Mono'] text-xs sm:text-sm focus:border-emerald-500/50 outline-none"
                      />
                      <button
                        onClick={handleSaveTradeUrl}
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                      >
                        {tradeUrlSaved ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                        <span>{tradeUrlSaved ? 'Збережено!' : 'Зберегти'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/[0.05]">
                    <a
                      href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium font-['Space_Grotesk']"
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

                  {/* Immediate Action Shortcut */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-emerald-300 font-['Space_Grotesk']">
                        Готові оцінити або продати свій інвентар?
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Завантажте ваш реальний публічний інвентар CS2 в калькулятор в один клік.
                      </div>
                    </div>

                    <button
                      onClick={handleLoadInventoryShortcut}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Завантажити інвентар</span>
                    </button>
                  </div>

                  {/* Security Warning Notice */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-300">Памʼятка безпеки: </strong>
                      Ніколи та ні за яких умов не передавайте свій Steam Web API ключ або коди підтвердження з додатку Steam Guard. Працівники SkinToCash ніколи не пишуть в особисті повідомлення Steam.
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: TRANSACTION HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    Останні операції ({transactions.length})
                  </h3>
                  <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                    Синхронізовано з блокчейном та банком
                  </span>
                </div>

                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'payout' 
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' 
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}>
                          {tx.type === 'payout' ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="font-['Space_Grotesk'] font-bold text-sm text-white">
                            {tx.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-['JetBrains_Mono'] flex-wrap">
                            <span>ID: {tx.id}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                            <span>•</span>
                            <span className="text-slate-300">{tx.method}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                        <div className="text-base font-bold font-['JetBrains_Mono'] text-emerald-400">
                          +{formatPrice(tx.amount)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Check className="w-2.5 h-2.5" />
                          Виплачено
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY & STEAM OPENID */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    Статус безпеки вашого акаунту
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                            Valve Steam OpenID 2.0
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Авторизовано через захищений шлюз Steam
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono']">
                        Підключено
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                            Steam Mobile Authenticator Guard
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Захист від несанкціонованих обмінів увімкнено
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono']">
                        Захищено
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                          <Link2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-['Space_Grotesk']">
                            Офіційний домен SkinToCash
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Захищене 256-бітне SSL-зʼєднання
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono']">
                        Дійсно
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={logout}
                      className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Завершити сесію та вийти з акаунту</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-white/[0.07] bg-slate-950/60 shrink-0 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-['JetBrains_Mono']">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Сесія активна: {user.personaname}</span>
            </div>

            <button
              onClick={closeCabinet}
              className="px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white font-['Space_Grotesk'] cursor-pointer transition-colors"
            >
              Закрити
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
