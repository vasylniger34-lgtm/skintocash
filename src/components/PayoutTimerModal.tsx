import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  ArrowUpRight, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export interface PayoutSession {
  txId: string;
  amount: number;
  methodName: string;
  methodId: string;
  destination: string;
  timestamp: number;
}

interface PayoutTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: PayoutSession | null;
}

export const PayoutTimerModal: React.FC<PayoutTimerModalProps> = ({
  isOpen,
  onClose,
  session
}) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  // Initial duration in seconds (105 seconds ~ 1m 45s)
  const totalDuration = 105;
  const [secondsLeft, setSecondsLeft] = useState(totalDuration);
  const [isCopied, setIsCopied] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isOpen || !session) return;
    setSecondsLeft(totalDuration);
    setIsComplete(false);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsComplete(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.min(100, Math.round(((totalDuration - secondsLeft) / totalDuration) * 100));

  const copyTxId = () => {
    navigator.clipboard.writeText(session.txId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Determine current active step based on progress
  let activeStep = 1;
  if (progressPercent >= 25 && progressPercent < 65) activeStep = 2;
  else if (progressPercent >= 65 && progressPercent < 95) activeStep = 3;
  else if (progressPercent >= 95 || isComplete) activeStep = 4;

  const t = {
    title: language === 'EN' ? 'Instant Payout Processing' : (language === 'RU' ? 'Обработка моментальной выплаты' : 'Обробка миттєвої виплати'),
    subtitle: language === 'EN' ? 'Automated banking gateway is settling your transfer.' : (language === 'RU' ? 'Автоматический банковский шлюз отправляет средства на ваши реквизиты.' : 'Автоматичний банківський шлюз відправляє кошти на ваші реквізити.'),
    timerLabel: language === 'EN' ? 'Estimated arrival time:' : (language === 'RU' ? 'Расчетное время зачисления:' : 'Орієнтовний час надходження:'),
    amountLabel: language === 'EN' ? 'Amount to receive:' : (language === 'RU' ? 'Сумма к получению:' : 'Сума до зарахування:'),
    methodLabel: language === 'EN' ? 'Payout method:' : (language === 'RU' ? 'Способ вывода:' : 'Спосіб виводу:'),
    destLabel: language === 'EN' ? 'Recipient account:' : (language === 'RU' ? 'Реквизиты получателя:' : 'Реквізити одержувача:'),
    txLabel: language === 'EN' ? 'Transaction ID:' : (language === 'RU' ? 'Номер транзакции:' : 'Номер транзакції:'),
    speedNotice: language === 'EN' ? 'Average transfer time is 30-90 seconds. You can safely minimize this window; the transfer executes automatically.' : (language === 'RU' ? 'Среднее время перевода — от 30 до 90 секунд. Окно можно закрыть, средства будут зачислены автоматически.' : 'Середній час переказу — від 30 до 90 секунд. Вікно можна закрити, кошти будуть зараховані автоматично.'),
    step1: language === 'EN' ? 'Order verified & signed' : (language === 'RU' ? 'Заявка проверена и подписана' : 'Заявка перевірена та підписана'),
    step2: language === 'EN' ? 'Interbank gateway authorized' : (language === 'RU' ? 'Авторизация в шлюзе (МИР / СБП / Банк)' : 'Авторизація у шлюзі (МИР / СБП / Банк)'),
    step3: language === 'EN' ? 'Funds dispatched to card / wallet' : (language === 'RU' ? 'Отправка средств на карту / кошелек' : 'Відправка коштів на картку / гаманець'),
    step4: language === 'EN' ? 'Settlement successful' : (language === 'RU' ? 'Выплата успешно завершена' : 'Виплата успішно завершена'),
    btnDone: language === 'EN' ? 'Close & Continue' : (language === 'RU' ? 'Закрыть окно' : 'Закрити вікно'),
    btnBackground: language === 'EN' ? 'Minimize (runs in background)' : (language === 'RU' ? 'Свернуть (работает в фоне)' : 'Згорнути (працює у фоні)'),
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        {/* Backdrop click to minimize */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#0B1017] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden"
        >
          {/* Subtle glowing ambient lighting */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Close / Minimize button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Zap className="w-6 h-6 fill-current animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                {isComplete ? t.step4 : t.title}
              </h3>
              <p className="text-xs text-slate-400 font-['Space_Grotesk']">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* COUNTDOWN TIMER DISPLAY */}
          <div className="my-5 p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-emerald-500/25 relative overflow-hidden text-center">
            <div className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t.timerLabel}</span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-['JetBrains_Mono'] tracking-tight text-white my-2 flex items-center justify-center gap-2">
              <span className={isComplete ? 'text-emerald-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400'}>
                {isComplete ? '00:00' : timeFormatted}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden mt-3">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                style={{ width: `${progressPercent}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-slate-400 mt-2">
              <span>{progressPercent}% {language === 'EN' ? 'Processed' : (language === 'RU' ? 'Выполнено' : 'Виконано')}</span>
              <span className="text-emerald-400 font-bold">
                {isComplete 
                  ? (language === 'EN' ? '100% Completed' : (language === 'RU' ? '100% Завершено' : '100% Завершено'))
                  : (language === 'EN' ? '~ 42s avg latency' : (language === 'RU' ? '~ 42 сек задержка' : '~ 42 сек затримка'))}
              </span>
            </div>
          </div>

          {/* Details Capsule */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2 text-xs font-['JetBrains_Mono'] text-slate-300 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.amountLabel}</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatPrice(session.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.methodLabel}</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <PaymentMethodIcon id={session.methodId || session.methodName} size={20} />
                <span>{session.methodName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.destLabel}</span>
              <span className="text-slate-200 font-bold truncate max-w-[200px]">
                {session.destination}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <span className="text-slate-400">{t.txLabel}</span>
              <button
                onClick={copyTxId}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer group"
              >
                <span>{session.txId}</span>
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* 4 Interactive Process Steps */}
          <div className="space-y-2 mb-5">
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs transition-all ${
              activeStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. {t.step1}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs transition-all ${
              activeStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                activeStep >= 2 ? 'border-emerald-400 text-emerald-400' : 'border-slate-600 text-slate-600'
              }`}>
                {activeStep > 2 ? <Check className="w-2.5 h-2.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <span>2. {t.step2}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs transition-all ${
              activeStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                activeStep >= 3 ? 'border-emerald-400 text-emerald-400' : 'border-slate-600 text-slate-600'
              }`}>
                {activeStep > 3 ? <Check className="w-2.5 h-2.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <span>3. {t.step3}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs transition-all ${
              activeStep >= 4 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                activeStep >= 4 ? 'border-emerald-400 text-emerald-400' : 'border-slate-600 text-slate-600'
              }`}>
                {activeStep >= 4 ? <Check className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
              </div>
              <span>4. {t.step4}</span>
            </div>
          </div>

          {/* Notice info */}
          <p className="text-[11px] text-slate-400 leading-relaxed text-center mb-5">
            {t.speedNotice}
          </p>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-['Space_Grotesk'] text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isComplete ? t.btnDone : t.btnBackground}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
