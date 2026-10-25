import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  ExternalLink, 
  ArrowRight, 
  Zap, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CS2Skin, PaymentOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';

interface TradeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkins: CS2Skin[];
  totalPayout: number;
  paymentMethod: PaymentOption;
  destinationAddress: string;
}

export const TradeOfferModal: React.FC<TradeOfferModalProps> = ({
  isOpen,
  onClose,
  selectedSkins,
  totalPayout,
  paymentMethod,
  destinationAddress,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [step, setStep] = useState<'sent' | 'confirming' | 'completed'>('sent');
  const [tokenCopied, setTokenCopied] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min trade offer expiration
  const securityToken = 'SKC-9824';
  const tradeOfferId = '8492041289';

  useEffect(() => {
    if (isOpen) {
      // Trigger festive celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#34D399', '#ffffff'],
      });

      const timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateConfirm = () => {
    setStep('confirming');
    setTimeout(() => {
      setStep('completed');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10B981', '#2DD4BF', '#FBBF24'],
      });
    }, 2200);
  };

  const handleModalClose = () => {
    setStep('sent');
    onClose();
  };

  const copyToken = () => {
    navigator.clipboard.writeText(securityToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0B1017] border border-white/[0.08] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.15)] z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {step === 'completed' ? t('trade.payoutDispatched') : t('trade.offerSent')}
                </h3>
                <span className="text-[11px] font-['JetBrains_Mono'] text-slate-400">
                  {t('trade.tradeOfferId')} #{tradeOfferId}
                </span>
              </div>
            </div>

            <button
              onClick={handleModalClose}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content based on state */}
          {step !== 'completed' ? (
            <div className="py-4 space-y-4">
              
              {/* Anti-Scam Security Token Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-inner">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-['Space_Grotesk'] uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      {t('trade.antiScamToken')}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {t('trade.checkGuard')}
                    </p>
                  </div>
                  
                  <button
                    onClick={copyToken}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-['JetBrains_Mono'] font-bold text-sm hover:bg-emerald-500/30 transition-all shrink-0 cursor-pointer"
                  >
                    <span>{securityToken}</span>
                    {tokenCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Bot Details */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.07] text-xs font-['JetBrains_Mono']">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center font-bold text-emerald-400 border border-white/[0.08]">
                    🤖
                  </div>
                  <div>
                    <div className="text-white font-semibold">SkinToCash Bot #08</div>
                    <div className="text-slate-400 text-[10px]">Steam Level 128 • Member since 2016</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">{t('trade.expiresIn')}</div>
                  <div className="text-amber-400 font-bold flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </div>
                </div>
              </div>

              {/* Selected Skins Preview */}
              <div>
                <div className="text-[11px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t('trade.itemsInTx')} ({selectedSkins.length})
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {selectedSkins.map((s) => (
                    <div
                      key={s.id}
                      className="shrink-0 w-24 p-2 rounded-xl bg-white/[0.02] border border-white/[0.07] text-center"
                    >
                      <SkinImage 
                        src={s.image} 
                        fallbackSrc={s.fallbackImage} 
                        alt={s.name} 
                        className="h-10 mx-auto object-contain my-1" 
                      />
                      <div className="text-[10px] font-bold text-slate-200 truncate font-['Space_Grotesk']">{s.skinName}</div>
                      <div className="text-[9px] text-emerald-400 font-['JetBrains_Mono'] font-bold">
                        {formatPrice(s.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout Destination Info */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-['JetBrains_Mono']">{t('trade.payoutTarget')} ({paymentMethod.name})</span>
                  <span className="text-white font-['JetBrains_Mono'] font-medium truncate max-w-[260px] inline-block">
                    {destinationAddress || 'Wallet / Card linked'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-['JetBrains_Mono']">{t('trade.totalPayout')}</span>
                  <span className="text-base font-extrabold text-emerald-400 font-['JetBrains_Mono']">
                    {formatPrice(totalPayout)}
                  </span>
                </div>
              </div>

              {/* Interactive Simulation Action */}
              <div className="pt-2">
                <button
                  disabled={step === 'confirming'}
                  onClick={handleSimulateConfirm}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {step === 'confirming' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{t('trade.verifying')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('trade.simulateConfirm')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  {t('trade.liveModeHint')} <strong className="text-emerald-400 font-['JetBrains_Mono']">{securityToken}</strong>.
                </p>
              </div>

            </div>
          ) : (
            /* Completed Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  {t('trade.successTitle')}
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                  {t('trade.successDesc')} <strong className="text-emerald-400">{paymentMethod.name}</strong>.
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/[0.07] text-left space-y-2.5 font-['JetBrains_Mono'] text-xs">
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-slate-400">{t('trade.netDispatched')}</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatPrice(totalPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('trade.txId')}</span>
                  <span className="text-slate-200">TX-8924018241940</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blockchain / Bank Ref:</span>
                  <span className="text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline">
                    0x7d92...e4a1 <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('trade.speed')}</span>
                  <span className="text-emerald-400 font-bold">34 seconds</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold font-['Space_Grotesk'] transition-colors cursor-pointer border border-white/[0.08]"
                >
                  {t('trade.sellMore')}
                </button>
                <a
                  href="#reviews-section"
                  onClick={handleModalClose}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-['Space_Grotesk'] shadow-md transition-colors flex items-center justify-center gap-1"
                >
                  {t('trade.leaveReview')}
                </a>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
