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

  const PAYOUT_MODAL_I18N: Record<string, Record<string, string>> = {
    EN: {
      title: 'Instant Payout Processing',
      subtitle: 'Automated banking gateway is settling your transfer.',
      timerLabel: 'Estimated arrival time:',
      amountLabel: 'Amount to receive:',
      methodLabel: 'Payout method:',
      destLabel: 'Recipient account:',
      txLabel: 'Transaction ID:',
      speedNotice: 'Average transfer time is 30-90 seconds. You can safely minimize this window; the transfer executes automatically.',
      step1: 'Order verified & signed',
      step2: 'Interbank gateway authorized',
      step3: 'Funds dispatched to card / wallet',
      step4: 'Settlement successful',
      btnDone: 'Close & Continue',
      btnBackground: 'Minimize (runs in background)',
      processed: 'Processed',
      completed: '100% Completed',
      avgLatency: '~ 42s avg latency',
    },
    UA: {
      title: 'Обробка миттєвої виплати',
      subtitle: 'Автоматичний банківський шлюз відправляє кошти на ваші реквізити.',
      timerLabel: 'Орієнтовний час надходження:',
      amountLabel: 'Сума до зарахування:',
      methodLabel: 'Спосіб виводу:',
      destLabel: 'Реквізити одержувача:',
      txLabel: 'Номер транзакції:',
      speedNotice: 'Середній час переказу — від 30 до 90 секунд. Вікно можна закрити, кошти будуть зараховані автоматично.',
      step1: 'Заявка перевірена та підписана',
      step2: 'Авторизація у шлюзі (Банк / Крипто)',
      step3: 'Відправка коштів на картку / гаманець',
      step4: 'Виплата успішно завершена',
      btnDone: 'Закрити вікно',
      btnBackground: 'Згорнути (працює у фоні)',
      processed: 'Виконано',
      completed: '100% Завершено',
      avgLatency: '~ 42 сек затримка',
    },
    RU: {
      title: 'Обработка моментальной выплаты',
      subtitle: 'Автоматический банковский шлюз отправляет средства на ваши реквизиты.',
      timerLabel: 'Расчетное время зачисления:',
      amountLabel: 'Сумма к получению:',
      methodLabel: 'Способ вывода:',
      destLabel: 'Реквизиты получателя:',
      txLabel: 'Номер транзакции:',
      speedNotice: 'Среднее время перевода — от 30 до 90 секунд. Окно можно закрыть, средства будут зачислены автоматически.',
      step1: 'Заявка проверена и подписана',
      step2: 'Авторизация в шлюзе (МИР / СБП / Банк)',
      step3: 'Отправка средств на карту / кошелек',
      step4: 'Выплата успешно завершена',
      btnDone: 'Закрыть окно',
      btnBackground: 'Свернуть (работает в фоне)',
      processed: 'Выполнено',
      completed: '100% Завершено',
      avgLatency: '~ 42 сек задержка',
    },
    PL: {
      title: 'Przetwarzanie natychmiastowej wypłaty',
      subtitle: 'Automatyczna bramka bankowa realizuje przelew na Twoje konto.',
      timerLabel: 'Szacowany czas nadejścia:',
      amountLabel: 'Kwota do odbioru:',
      methodLabel: 'Metoda wypłaty:',
      destLabel: 'Konto odbiorcy:',
      txLabel: 'ID transakcji:',
      speedNotice: 'Średni czas przelewu wynosi 30-90 sekund. Możesz zminimalizować to okno; transfer wykona się automatycznie.',
      step1: 'Zlecenie zweryfikowane i podpisane',
      step2: 'Autoryzacja w bramce płatniczej',
      step3: 'Środki wysłane na kartę / portfel',
      step4: 'Wypłata zakończona sukcesem',
      btnDone: 'Zamknij i kontynuuj',
      btnBackground: 'Zminimalizuj (działa w tle)',
      processed: 'Ukończono',
      completed: '100% Ukończono',
      avgLatency: '~ 42s śr. opóźnienie',
    },
    ES: {
      title: 'Procesamiento de retiro instantáneo',
      subtitle: 'La pasarela bancaria automatizada está liquidando tu transferencia.',
      timerLabel: 'Tiempo estimado de llegada:',
      amountLabel: 'Importe a recibir:',
      methodLabel: 'Método de cobro:',
      destLabel: 'Cuenta de destino:',
      txLabel: 'ID de transacción:',
      speedNotice: 'El tiempo medio de transferencia es de 30-90 segundos. Puedes minimizar esta ventana; el pago se procesa automáticamente.',
      step1: 'Orden verificada y firmada',
      step2: 'Pasarela de pagos autorizada',
      step3: 'Fondos emitidos a tarjeta / billetera',
      step4: 'Liquidación completada con éxito',
      btnDone: 'Cerrar y continuar',
      btnBackground: 'Minimizar (funciona en segundo plano)',
      processed: 'Completado',
      completed: '100% Completado',
      avgLatency: '~ 42s latencia media',
    },
    ZH: {
      title: '即时提现结算处理中',
      subtitle: '全自动银行与区块链清算网关正在汇出您的款项。',
      timerLabel: '预计到账倒计时:',
      amountLabel: '应收总金额:',
      methodLabel: '提现渠道:',
      destLabel: '收款账号:',
      txLabel: '交易凭证单号:',
      speedNotice: '平均打款时效为 30-90 秒。您可以放心最小化此窗口，款项将由后台全自动打出。',
      step1: '订单已核验并签名',
      step2: '清算网关授权通过',
      step3: '款项已汇出至卡号 / 钱包',
      step4: '到账结算成功',
      btnDone: '关闭窗口并继续',
      btnBackground: '最小化 (后台自动进行)',
      processed: '已完成',
      completed: '100% 全部完成',
      avgLatency: '~ 42 秒平均时延',
    },
    DE: {
      title: 'Verarbeitung der Sofortauszahlung',
      subtitle: 'Das automatisierte Bank-Gateway wickelt deine Überweisung ab.',
      timerLabel: 'Geschätzte Ankunftszeit:',
      amountLabel: 'Auszahlungsbetrag:',
      methodLabel: 'Auszahlungsmethode:',
      destLabel: 'Empfängerkonto:',
      txLabel: 'Transaktions-ID:',
      speedNotice: 'Die durchschnittliche Überweisungszeit beträgt 30-90 Sekunden. Du kannst dieses Fenster minimieren; die Überweisung erfolgt automatisch.',
      step1: 'Auftrag geprüft und signiert',
      step2: 'Zahlungsgateway autorisiert',
      step3: 'Guthaben an Karte / Wallet gesendet',
      step4: 'Auszahlung erfolgreich abgeschlossen',
      btnDone: 'Schließen und fortfahren',
      btnBackground: 'Minimieren (läuft im Hintergrund)',
      processed: 'Ausgeführt',
      completed: '100% Abgeschlossen',
      avgLatency: '~ 42s durchschn. Latenz',
    },
  };

  const t = PAYOUT_MODAL_I18N[language] || PAYOUT_MODAL_I18N['EN'];

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
              <span>{progressPercent}% {t.processed}</span>
              <span className="text-emerald-400 font-bold">
                {isComplete ? t.completed : t.avgLatency}
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
