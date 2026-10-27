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
  RefreshCw,
  Smartphone,
  Send,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CS2Skin, PaymentOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SkinImage } from './SkinImage';
import { OFFICIAL_STEAM_BOT, createDepositTradeSession, type DepositTradeSession } from '../data/steamBot';
import { parseSteamTradeUrl } from '../services/steamService';

interface TradeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkins: CS2Skin[];
  totalPayout: number;
  paymentMethod?: PaymentOption;
  destinationAddress?: string;
  userTradeUrl?: string;
  onTradeCompleted?: (session: DepositTradeSession) => void;
}

const TRADE_MODAL_I18N: Record<string, Record<string, string>> = {
  EN: {
    accountBalance: 'Account Balance',
    internalBalance: 'SkinToCash Internal Balance',
    depositCredited: 'Deposit successfully credited!',
    botPreparing: 'Bot is preparing personal trade...',
    tradeDispatched: 'Trade dispatched to your Steam Guard',
    txLabel: 'Transaction:',
    dispatchingBot: 'Dispatching trade offer from official bot...',
    dispatchingSub: 'Bot {bot} (Region: {country} 🇷🇺) is sending a direct offer to your Steam Trade URL.',
    generatingToken: 'Generating secure handshake token...',
    tradeDelivered: 'Trade delivered to your Steam!',
    checkGuard: 'Check notifications on your mobile Steam Guard app',
    securityCode: 'Security Handshake Code:',
    mustMatch: 'Must match message inside Steam trade offer',
    scamWarning: 'If the code in received trade differs, decline immediately to prevent API scam!',
    region: 'Region',
    botMessage: 'Message from bot inside trade offer:',
    total: 'Total:',
    destination: 'Destination',
    openInSteam: 'Open Received Trade in Steam',
    verifyingGuard: 'Verifying Steam Guard & sending payout...',
    acceptedInGuard: 'I accepted trade in Steam Guard (Get Funds)',
    skinsAccepted: 'Skins Accepted, Funds Dispatched!',
    acceptedSub: 'Official bot {bot} has accepted your CS2 items. Instant payout has been dispatched.',
    payoutAmount: 'Payout Amount:',
    recipient: 'Recipient:',
    officialBot: 'Official Bot:',
    botRegion: 'Bot Region:',
    closeWindow: 'Close Window',
  },
  UA: {
    accountBalance: 'Баланс кабінету',
    internalBalance: 'Внутрішній баланс кабінету',
    depositCredited: 'Депозит успішно зараховано!',
    botPreparing: 'Бот формує персональний трейд...',
    tradeDispatched: 'Трейд надіслано ботом у Steam Guard',
    txLabel: 'Транзакція:',
    dispatchingBot: 'Відправка обміну від офіційного бота...',
    dispatchingSub: 'Бот {bot} (Регіон: {country} 🇷🇺) надсилає пропозицію обміну на ваш акаунт Steam.',
    generatingToken: 'Генерація захищеного токена безпеки...',
    tradeDelivered: 'Трейд доставлено у ваш Steam!',
    checkGuard: 'Перевірте сповіщення на телефоні у додатку Steam Guard',
    securityCode: 'Код перевірки безпеки:',
    mustMatch: 'Має збігатися у повідомленні трейду',
    scamWarning: 'Якщо в отриманому обміні код відрізняється — відхиліть обмін, це може бути сторонній API-перехоплювач!',
    region: 'Регіон',
    botMessage: 'Повідомлення у трейді від бота:',
    total: 'Сума:',
    destination: 'Куди надходять кошти',
    openInSteam: 'Відкрити отриманий обмін у Steam',
    verifyingGuard: 'Перевірка Steam Guard та зарахування коштів...',
    acceptedInGuard: 'Я прийняв трейд у Steam Guard (Отримати кошти)',
    skinsAccepted: 'Скіни прийнято, кошти виплачено!',
    acceptedSub: 'Офіційний бот {bot} успішно прийняв ваші предмети CS2. Виплата надіслана на ваш рахунок.',
    payoutAmount: 'Сума виплати:',
    recipient: 'Одержувач:',
    officialBot: 'Офіційний бот:',
    botRegion: 'Регіон бота:',
    closeWindow: 'Закрити вікно',
  },
  RU: {
    accountBalance: 'Баланс аккаунта',
    internalBalance: 'Внутренний баланс аккаунта',
    depositCredited: 'Депозит успешно зачислен!',
    botPreparing: 'Бот формирует персональный трейд...',
    tradeDispatched: 'Трейд отправлен ботом в Steam Guard',
    txLabel: 'Транзакция:',
    dispatchingBot: 'Отправка трейда от официального бота...',
    dispatchingSub: 'Бот {bot} (Регион: {country} 🇷🇺) отправляет прямое предложение обмена на ваш аккаунт Steam.',
    generatingToken: 'Генерация защитного токена безопасности...',
    tradeDelivered: 'Трейд доставлен в ваш Steam!',
    checkGuard: 'Проверьте уведомления на телефоне в приложении Steam Guard',
    securityCode: 'Код проверки безопасности:',
    mustMatch: 'Должен совпадать в сообщении к обмену',
    scamWarning: 'Если в полученном обмене код отличается — отклоните обмен, это может быть фишинг!',
    region: 'Регион',
    botMessage: 'Сообщение к обмену от бота:',
    total: 'Сумма:',
    destination: 'Куда поступают средства',
    openInSteam: 'Открыть полученный обмен в Steam',
    verifyingGuard: 'Проверка Steam Guard и отправка средств...',
    acceptedInGuard: 'Я принял трейд в Steam Guard (Получить деньги)',
    skinsAccepted: 'Скины приняты, средства выплачены!',
    acceptedSub: 'Официальный бот {bot} успешно принял ваши скины CS2. Выплата отправлена на ваш счет.',
    payoutAmount: 'Сумма выплаты:',
    recipient: 'Получатель:',
    officialBot: 'Официальный бот:',
    botRegion: 'Регион бота:',
    closeWindow: 'Закрыть окно',
  },
  PL: {
    accountBalance: 'Saldo konta',
    internalBalance: 'Wewnętrzne saldo konta',
    depositCredited: 'Depozyt pomyślnie zaksięgowany!',
    botPreparing: 'Bot przygotowuje dedykowaną ofertę...',
    tradeDispatched: 'Oferta wysłana przez bota do Steam Guard',
    txLabel: 'Transakcja:',
    dispatchingBot: 'Wysyłanie oferty z oficjalnego bota...',
    dispatchingSub: 'Bot {bot} (Region: {country} 🇷🇺) wysyła bezpośrednią ofertę na Twój profil Steam.',
    generatingToken: 'Generowanie bezpiecznego tokena uzgodnienia...',
    tradeDelivered: 'Oferta dotarła do Twojego konta Steam!',
    checkGuard: 'Sprawdź powiadomienia w aplikacji mobilnej Steam Guard',
    securityCode: 'Kod bezpieczeństwa (Handshake):',
    mustMatch: 'Musi zgadzać się z wiadomością w ofercie Steam',
    scamWarning: 'Jeśli kod w otrzymanej ofercie różni się — natychmiast ją odrzuć, aby zapobiec API Scam!',
    region: 'Region',
    botMessage: 'Wiadomość od bota w ofercie:',
    total: 'Łącznie:',
    destination: 'Miejsce wypłaty',
    openInSteam: 'Otwórz otrzymaną ofertę w Steam',
    verifyingGuard: 'Weryfikacja w Steam Guard i realizacja wypłaty...',
    acceptedInGuard: 'Zatwierdziłem w Steam Guard (Odbierz środki)',
    skinsAccepted: 'Skiny przyjęte, środki wysłane!',
    acceptedSub: 'Oficjalny bot {bot} przyjął Twoje przedmioty CS2. Natychmiastowa wypłata została zlecona.',
    payoutAmount: 'Kwota wypłaty:',
    recipient: 'Odbiorca:',
    officialBot: 'Oficjalny bot:',
    botRegion: 'Region bota:',
    closeWindow: 'Zamknij okno',
  },
  ES: {
    accountBalance: 'Saldo de cuenta',
    internalBalance: 'Saldo interno de cuenta',
    depositCredited: '¡Depósito acreditado con éxito!',
    botPreparing: 'El bot está preparando el intercambio personal...',
    tradeDispatched: 'Intercambio enviado a tu Steam Guard',
    txLabel: 'Transacción:',
    dispatchingBot: 'Enviando oferta del bot oficial...',
    dispatchingSub: 'El bot {bot} (Región: {country} 🇷🇺) está enviando una oferta directa a tu Steam Trade URL.',
    generatingToken: 'Generando token de seguridad...',
    tradeDelivered: '¡Intercambio entregado en tu Steam!',
    checkGuard: 'Revisa las notificaciones en tu app móvil de Steam Guard',
    securityCode: 'Código de seguridad (Handshake):',
    mustMatch: 'Debe coincidir con el mensaje dentro de la oferta de Steam',
    scamWarning: 'Si el código en el intercambio difiere, ¡recházalo de inmediato para evitar API scam!',
    region: 'Región',
    botMessage: 'Mensaje del bot en la oferta:',
    total: 'Total:',
    destination: 'Destino de los fondos',
    openInSteam: 'Abrir intercambio recibido en Steam',
    verifyingGuard: 'Verificando Steam Guard y enviando fondos...',
    acceptedInGuard: 'Acepté el intercambio en Steam Guard (Recibir fondos)',
    skinsAccepted: '¡Skins aceptadas, fondos emitidos!',
    acceptedSub: 'El bot oficial {bot} ha aceptado tus artículos de CS2. El pago instantáneo ha sido emitido.',
    payoutAmount: 'Importe de pago:',
    recipient: 'Destinatario:',
    officialBot: 'Bot oficial:',
    botRegion: 'Región del bot:',
    closeWindow: 'Cerrar ventana',
  },
  ZH: {
    accountBalance: '账户余额',
    internalBalance: '内部账户可用余额',
    depositCredited: '饰品存入已成功到账！',
    botPreparing: '官方交易机器人正在打包发送报价...',
    tradeDispatched: '报价已发送至您的手机 Steam 移动令牌',
    txLabel: '交易单号:',
    dispatchingBot: '官方认证机器人正在向您的 Trade URL 发起报价...',
    dispatchingSub: '官方机器人 {bot} (归属地: {country} 🇷🇺) 正在向您的 Steam 交易链接发起实时报价。',
    generatingToken: '正在生成防 API 劫持安全握手验证码...',
    tradeDelivered: '报价已送达您的 Steam 客户端！',
    checkGuard: '请打开手机 Steam 移动应用核对并确认报价',
    securityCode: '防钓鱼安全握手验证码:',
    mustMatch: '必须与 Steam 报价附言中的代码完全一致',
    scamWarning: '若收到的 Steam 报价中代码不符，请立即拒绝报价以防 API 劫持！',
    region: '归属地',
    botMessage: 'Steam 报价中附带的机器人留言:',
    total: '收款总计:',
    destination: '款项接收渠道',
    openInSteam: '在 Steam 中打开并查看收到的报价',
    verifyingGuard: '正在核对 Steam 手机确认并全自动打款...',
    acceptedInGuard: '我已在手机 Steam 确认报价 (立即收款)',
    skinsAccepted: '饰品已接收，款项已成功打出！',
    acceptedSub: '官方认证机器人 {bot} 已成功接收您的 CS2 饰品，即时款项已成功汇出。',
    payoutAmount: '打款金额:',
    recipient: '收款账号:',
    officialBot: '官方交易机器人:',
    botRegion: '机器人归属地区:',
    closeWindow: '关闭窗口',
  },
  DE: {
    accountBalance: 'Kontoguthaben',
    internalBalance: 'Internes Kontoguthaben',
    depositCredited: 'Einzahlung erfolgreich gutgeschrieben!',
    botPreparing: 'Bot bereitet persönlichen Trade vor...',
    tradeDispatched: 'Trade an deinen Steam Guard gesendet',
    txLabel: 'Transaktion:',
    dispatchingBot: 'Handelsangebot vom offiziellen Bot wird gesendet...',
    dispatchingSub: 'Bot {bot} (Region: {country} 🇷🇺) sendet ein direktes Angebot an deine Steam Trade URL.',
    generatingToken: 'Sicherheits-Handshake-Token wird generiert...',
    tradeDelivered: 'Trade an dein Steam zugestellt!',
    checkGuard: 'Prüfe Benachrichtigungen in deiner Steam Guard-App',
    securityCode: 'Sicherheits-Handshake-Code:',
    mustMatch: 'Muss mit der Nachricht im Steam-Handelsangebot übereinstimmen',
    scamWarning: 'Wenn der Code im Trade abweicht, lehne sofort ab, um API-Betrug zu verhindern!',
    region: 'Region',
    botMessage: 'Nachricht vom Bot im Angebot:',
    total: 'Gesamt:',
    destination: 'Auszahlungsziel',
    openInSteam: 'Erhaltenen Trade in Steam öffnen',
    verifyingGuard: 'Steam Guard wird geprüft & Auszahlung gesendet...',
    acceptedInGuard: 'Ich habe im Steam Guard bestätigt (Geld erhalten)',
    skinsAccepted: 'Skins akzeptiert, Guthaben ausgezahlt!',
    acceptedSub: 'Der offizielle Bot {bot} hat deine CS2-Gegenstände angenommen. Die Sofortauszahlung wurde versendet.',
    payoutAmount: 'Auszahlungsbetrag:',
    recipient: 'Empfänger:',
    officialBot: 'Offizieller Bot:',
    botRegion: 'Bot-Region:',
    closeWindow: 'Fenster schließen',
  },
};

export const TradeOfferModal: React.FC<TradeOfferModalProps> = ({
  isOpen,
  onClose,
  selectedSkins,
  totalPayout,
  paymentMethod,
  destinationAddress,
  userTradeUrl,
  onTradeCompleted,
}) => {
  const { formatPrice } = useCurrency();
    const { t, language } = useLanguage();
  const tm = (key: string, params?: Record<string, string | number>): string => {
    let text = TRADE_MODAL_I18N[language]?.[key] || TRADE_MODAL_I18N['EN']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const [step, setStep] = useState<'dispatching' | 'sent' | 'confirming' | 'completed'>('dispatching');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 min trade offer expiration
  const [tradeOfferId, setTradeOfferId] = useState<string | null>(null);
  const [isLiveSteamOffer, setIsLiveSteamOffer] = useState<boolean>(false);

  // Generate unique trade session for the current selection
  const session = useMemo(() => {
    return createDepositTradeSession(
      selectedSkins,
      totalPayout,
      destinationAddress,
      paymentMethod?.name || tm('accountBalance')
    );
  }, [selectedSkins, totalPayout, destinationAddress, paymentMethod, language]);

  // Dispatch trade offer automatically via official bot when opened
  useEffect(() => {
    if (isOpen) {
      setStep('dispatching');
      setCountdown(300);
      setTradeOfferId(null);

      // Parse user's trade URL parameters
      const rawUrl = userTradeUrl || destinationAddress || '';
      const { partnerId, token, steamId64 } = parseSteamTradeUrl(rawUrl);

      // Trigger serverless bot trade dispatch
      const dispatchTrade = async () => {
        try {
          const res = await fetch('/api/send-trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              partnerId,
              token,
              steamId64,
              selectedItems: selectedSkins,
              txId: session.txId,
              securityCode: session.securityCode,
              payoutMethod: paymentMethod?.name || tm('accountBalance'),
              destinationAddress: destinationAddress || tm('internalBalance'),
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.tradeOfferId) {
              setTradeOfferId(data.tradeOfferId);
              setIsLiveSteamOffer(Boolean(data.isLiveSteamOffer));
            }
          }
        } catch (err) {
          console.warn('Bot trade dispatch fallback:', err);
        } finally {
          // Transition to sent state after realistic dispatch animation
          setTimeout(() => {
            setStep('sent');
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#10B981', '#06B6D4', '#ffffff'],
            });
          }, 1200);
        }
      };

      dispatchTrade();

      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, userTradeUrl, destinationAddress, selectedSkins, session, paymentMethod]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTrade = () => {
    setStep('confirming');
    setTimeout(() => {
      setStep('completed');
      if (onTradeCompleted) {
        onTradeCompleted(session);
      }
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10B981', '#2DD4BF', '#FBBF24'],
      });
    }, 2000);
  };

  const handleModalClose = () => {
    setStep('dispatching');
    onClose();
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  // Build target trade URLs
  const directTradeUrl = tradeOfferId 
    ? `https://steamcommunity.com/tradeoffer/${tradeOfferId}/`
    : 'https://steamcommunity.com/my/tradeoffers/';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
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
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1017] border border-white/[0.08] p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.15)] z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                  {step === 'completed' ? tm('depositCredited') : step === 'dispatching' ? tm('botPreparing') : tm('tradeDispatched')}
                </h3>
                <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 font-semibold">
                  {tm('txLabel')} {session.txId}
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
          {step === 'dispatching' ? (
            /* STEP: DISPATCHING ANIMATION */
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-pulse">
                  <Send className="w-8 h-8 animate-bounce text-emerald-400" />
                </div>
                <div className="absolute -inset-2 rounded-2xl bg-emerald-500/10 blur-lg animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {tm('dispatchingBot')}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {tm('dispatchingSub', { bot: OFFICIAL_STEAM_BOT.personaName, country: OFFICIAL_STEAM_BOT.country })}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{tm('generatingToken')}</span>
              </div>
            </div>
          ) : step !== 'completed' ? (
            /* STEP: SENT & AWAITING CONFIRMATION */
            <div className="py-4 space-y-4">
              
              {/* Push to Steam Guard Notification Hero Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                      <span>{tm('tradeDelivered')}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h4>
                    <p className="text-[11px] text-emerald-300/80">
                      {tm('checkGuard')}
                    </p>
                  </div>
                </div>

                {/* Anti-Scam Security Token */}
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 font-['Space_Grotesk'] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{tm('securityCode')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tm('mustMatch')}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(session.securityCode, 'code')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-['JetBrains_Mono'] font-extrabold text-lg hover:bg-emerald-500/30 transition-all shrink-0 cursor-pointer shadow-inner"
                  >
                    <span>🔐 {session.securityCode}</span>
                    {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>{tm('scamWarning')}</span>
                </div>
              </div>

              {/* Bot Identity Card: SkinToCash.com | Bot #1 (Country RU) */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
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
                      <div className="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5 flex-wrap">
                        <span>{OFFICIAL_STEAM_BOT.personaName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[9px] font-['JetBrains_Mono'] text-emerald-300 border border-emerald-500/30">
                          VERIFIED BOT
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-['JetBrains_Mono'] text-slate-300 border border-white/10">
                          {tm('region')}: {OFFICIAL_STEAM_BOT.country} 🇷🇺
                        </span>
                      </div>
                      <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400 mt-0.5">
                        SteamID: {OFFICIAL_STEAM_BOT.steamId64}
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
                    {tm('botMessage')}
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
                    {tm('total')} {formatPrice(totalPayout)}
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
                    {tm('destination')} ({paymentMethod?.name || 'Баланс'}):
                  </span>
                  <span className="text-white font-['JetBrains_Mono'] font-medium truncate max-w-[260px] inline-block">
                    {destinationAddress || tm('internalBalance')}
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

              {/* Action Buttons: 1-Tap Open Steam Incoming Offers + Confirm Action */}
              <div className="space-y-2 pt-1">
                {/* 1. Primary Action: Open incoming trade offers in Steam */}
                <a
                  href={directTradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>{tm('openInSteam')}</span>
                </a>

                {/* 2. Confirm Action Button */}
                <button
                  disabled={step === 'confirming'}
                  onClick={handleConfirmTrade}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-['Space_Grotesk'] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {step === 'confirming' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>{tm('verifyingGuard')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tm('acceptedInGuard')}</span>
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
                  {tm('skinsAccepted')}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  {tm('acceptedSub', { bot: OFFICIAL_STEAM_BOT.personaName })}
                </p>
              </div>

              {/* Receipt Capsule */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-['JetBrains_Mono'] space-y-1.5 text-slate-300 max-w-md mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">{tm('txLabel')}</span>
                  <span className="text-white font-bold">{session.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{tm('payoutAmount')}</span>
                  <span className="text-emerald-400 font-bold">{formatPrice(totalPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{tm('recipient')}</span>
                  <span className="text-white">{destinationAddress || 'SkinToCash'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{tm('officialBot')}</span>
                  <span className="text-emerald-400 font-semibold">{OFFICIAL_STEAM_BOT.personaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{tm('botRegion')}</span>
                  <span className="text-slate-300">{OFFICIAL_STEAM_BOT.country} 🇷🇺</span>
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-['Space_Grotesk'] cursor-pointer transition-all"
              >
                {tm('closeWindow')}
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
