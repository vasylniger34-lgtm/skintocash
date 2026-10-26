import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  ExternalLink, 
  Zap, 
  Check, 
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CS2Skin, PaymentOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';
import { OFFICIAL_STEAM_BOT, createDepositTradeSession, type DepositTradeSession } from '../data/steamBot';

interface TradeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkins: CS2Skin[];
  totalPayout: number;
  paymentMethod?: PaymentOption;
  destinationAddress?: string;
  onTradeCompleted?: (session: DepositTradeSession) => void;
}

export const TradeOfferModal: React.FC<TradeOfferModalProps> = ({
  isOpen,
  onClose,
  selectedSkins,
  totalPayout,
  paymentMethod,
  destinationAddress,
  onTradeCompleted,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [step, setStep] = useState<'sent' | 'confirming' | 'completed'>('sent');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 min trade offer expiration

  // Generate unique trade session for the current selection
  const session = useMemo(() => {
    return createDepositTradeSession(
      selectedSkins,
      totalPayout,
      destinationAddress,
      paymentMethod?.name || 'Виплата на баланс'
    );
  }, [selectedSkins, totalPayout, destinationAddress, paymentMethod]);

  useEffect(() => {
    if (isOpen) {
      setStep('sent');
      setCountdown(300);

      // Trigger initial celebration
      confetti({
        particleCount: 70,
        spread: 60,
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

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateConfirm = () => {
    setStep('confirming');
    setTimeout(() => {
      setStep('completed');
      if (onTradeCompleted) {
        onTradeCompleted(session);
      }
      confetti({
        particleCount: 140,
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
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1017] border border-white/[0.08] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.15)] z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {step === 'completed' ? 'Депозит успішно підтверджено!' : 'Офіційний Steam Трейд сформовано'}
                </h3>
                <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 font-semibold">
                  Транзакція: {session.txId}
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/40 shadow-inner space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-['Space_Grotesk'] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Секретний перевірочний код:</span>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(session.securityCode, 'code')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-['JetBrains_Mono'] font-extrabold text-base hover:bg-emerald-500/30 transition-all shrink-0 cursor-pointer"
                  >
                    <span>🔐 {session.securityCode}</span>
                    {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Звірте цей 4-значний код у повідомленні трейду в Steam. Якщо в отриманому обміні код <strong>відрізняється</strong> — відхиліть обмін, це може бути фішинг або підміна!
                </p>
              </div>

              {/* Bot Identity Card: SkinToCash.com | Bot #1 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={OFFICIAL_STEAM_BOT.avatar}
                        alt={OFFICIAL_STEAM_BOT.personaName}
                        className="w-10 h-10 rounded-xl border border-emerald-500/40 object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
                        <span>Офіційний бот: {OFFICIAL_STEAM_BOT.personaName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[9px] font-['JetBrains_Mono'] text-emerald-300 border border-emerald-500/30">
                          VERIFIED BOT
                        </span>
                      </div>
                      <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 mt-0.5">
                        SteamID: {OFFICIAL_STEAM_BOT.steamId64} • Рівень {OFFICIAL_STEAM_BOT.level}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-slate-400 text-[10px]">{t('trade.expiresIn')}</div>
                    <div className="text-amber-400 font-bold flex items-center gap-1 justify-end font-['JetBrains_Mono'] text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                    </div>
                  </div>
                </div>

                {/* Steam Message Preview Box */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-[11px] font-['JetBrains_Mono'] text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase mb-0.5">
                    Повідомлення в трейді від бота:
                  </span>
                  <span className="text-emerald-300/90 break-words">
                    {session.tradeMessage}
                  </span>
                </div>
              </div>

              {/* Items in Transaction */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  <span>{t('trade.itemsInTx')} ({selectedSkins.length})</span>
                  <span className="text-emerald-400 font-['JetBrains_Mono']">
                    Сума: {formatPrice(totalPayout)}
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {selectedSkins.map((s) => (
                    <div
                      key={s.id}
                      className="shrink-0 w-28 p-2 rounded-xl bg-white/[0.02] border border-white/[0.07] text-center"
                    >
                      <SkinImage 
                        src={s.image} 
                        fallbackSrc={s.fallbackImage} 
                        alt={s.name} 
                        className="h-10 mx-auto object-contain my-1 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" 
                      />
                      <div className="text-[10px] font-bold text-slate-200 truncate font-['Space_Grotesk']">
                        {s.name}
                      </div>
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
                  <span className="text-slate-400 block text-[10px] uppercase font-['JetBrains_Mono']">
                    Куди надходять кошти ({paymentMethod?.name || 'Баланс'}):
                  </span>
                  <span className="text-white font-['JetBrains_Mono'] font-medium truncate max-w-[260px] inline-block">
                    {destinationAddress || 'Внутрішній баланс кабінету'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-['JetBrains_Mono']">
                    {t('trade.totalPayout')}
                  </span>
                  <span className="text-base font-extrabold text-emerald-400 font-['JetBrains_Mono']">
                    {formatPrice(totalPayout)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Open Trade in Steam + Confirm Action */}
              <div className="space-y-2 pt-1">
                {/* 1. Primary Action: Open Trade in Steam */}
                <a
                  href={OFFICIAL_STEAM_BOT.tradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>Відкрити трейд у Steam (Бот: {OFFICIAL_STEAM_BOT.personaName})</span>
                </a>

                {/* 2. Simulation Confirm Button */}
                <button
                  disabled={step === 'confirming'}
                  onClick={handleSimulateConfirm}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-['Space_Grotesk'] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {step === 'confirming' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Перевірка Steam Guard та зарахування коштів...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Я прийняв трейд у Steam Guard (Підтвердити)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            /* STEP: COMPLETED STATE */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white font-['Space_Grotesk']">
                  Скіни прийнято, кошти виплачено!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Бот <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> успішно отримав ваші предмети CS2. Виплата надіслана за вказаними реквізитами.
                </p>
              </div>

              {/* Receipt Capsule */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-['JetBrains_Mono'] space-y-1.5 text-slate-300 max-w-md mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Транзакція:</span>
                  <span className="text-white font-bold">{session.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сума виплати:</span>
                  <span className="text-emerald-400 font-bold">{formatPrice(totalPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Одержувач:</span>
                  <span className="text-white">{destinationAddress || 'Баланс SkinToCash'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Офіційний бот:</span>
                  <span className="text-emerald-400 font-semibold">{OFFICIAL_STEAM_BOT.personaName} ({OFFICIAL_STEAM_BOT.steamId64})</span>
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-['Space_Grotesk'] cursor-pointer transition-all"
              >
                Закрити вікно
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
