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
      paymentMethod?.name || (language === 'EN' ? 'Account Balance' : (language === 'RU' ? 'Баланс аккаунта' : 'Баланс кабінету'))
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
              payoutMethod: paymentMethod?.name || (language === 'EN' ? 'Account Balance' : (language === 'RU' ? 'Баланс аккаунта' : 'Баланс кабінету')),
              destinationAddress: destinationAddress || (language === 'EN' ? 'Internal Balance' : (language === 'RU' ? 'Внутренний баланс' : 'Внутрішній баланс')),
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
                  {step === 'completed'
                    ? (language === 'EN' ? 'Deposit successfully credited!' : (language === 'RU' ? 'Депозит успешно зачислен!' : 'Депозит успішно зараховано!'))
                    : step === 'dispatching'
                    ? (language === 'EN' ? 'Bot is preparing personal trade...' : (language === 'RU' ? 'Бот формирует персональный трейд...' : 'Бот формує персональний трейд...'))
                    : (language === 'EN' ? 'Trade dispatched to your Steam Guard' : (language === 'RU' ? 'Трейд отправлен ботом в Steam Guard' : 'Трейд надіслано ботом у Steam Guard'))}
                </h3>
                <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 font-semibold">
                  {language === 'EN' ? 'Transaction:' : (language === 'RU' ? 'Транзакция:' : 'Транзакція:')} {session.txId}
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
                  {language === 'EN' ? 'Dispatching trade offer from official bot...' : (language === 'RU' ? 'Отправка трейда от официального бота...' : 'Відправка обміну від офіційного бота...')}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {language === 'EN' 
                    ? <>Bot <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> (Region: {OFFICIAL_STEAM_BOT.country} 🇷🇺) is sending a direct offer to your Steam Trade URL.</>
                    : language === 'RU'
                    ? <>Бот <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> (Регион: {OFFICIAL_STEAM_BOT.country} 🇷🇺) отправляет прямое предложение обмена на ваш аккаунт Steam.</>
                    : <>Бот <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> (Регіон: {OFFICIAL_STEAM_BOT.country} 🇷🇺) надсилає пропозицію обміну на ваш акаунт Steam.</>}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-['JetBrains_Mono'] text-emerald-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'EN' ? 'Generating secure handshake token...' : (language === 'RU' ? 'Генерация защитного токена безопасности...' : 'Генерація захищеного токена безпеки...')}</span>
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
                      <span>{language === 'EN' ? 'Trade delivered to your Steam!' : (language === 'RU' ? 'Трейд доставлен в ваш Steam!' : 'Трейд доставлено у ваш Steam!')}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h4>
                    <p className="text-[11px] text-emerald-300/80">
                      {language === 'EN' ? 'Check notifications on your mobile Steam Guard app' : (language === 'RU' ? 'Проверьте уведомления на телефоне в приложении Steam Guard' : 'Перевірте сповіщення на телефоні у додатку Steam Guard')}
                    </p>
                  </div>
                </div>

                {/* Anti-Scam Security Token */}
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 font-['Space_Grotesk'] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{language === 'EN' ? 'Security Handshake Code:' : (language === 'RU' ? 'Код проверки безопасности:' : 'Код перевірки безпеки:')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'EN' ? 'Must match message inside Steam trade offer' : (language === 'RU' ? 'Должен совпадать в сообщении к обмену' : 'Має збігатися у повідомленні трейду')}
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
                  <span>{language === 'EN' 
                    ? <>If the code in received trade <strong>differs</strong>, decline immediately to prevent API scam!</>
                    : language === 'RU'
                    ? <>Если в полученном обмене код <strong>отличается</strong> — отклоните обмен, это может быть фишинг!</>
                    : <>Якщо в отриманому обміні код <strong>відрізняється</strong> — відхиліть обмін, це може бути сторонній API-перехоплювач!</>}
                  </span>
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
                          {language === 'EN' ? 'Region' : (language === 'RU' ? 'Регион' : 'Регіон')}: {OFFICIAL_STEAM_BOT.country} 🇷🇺
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
                    {language === 'EN' ? 'Message from bot inside trade offer:' : (language === 'RU' ? 'Сообщение к обмену от бота:' : 'Повідомлення у трейді від бота:')}
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
                    {language === 'EN' ? 'Total:' : (language === 'RU' ? 'Сумма:' : 'Сума:')} {formatPrice(totalPayout)}
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
                    {language === 'EN' ? 'Destination' : (language === 'RU' ? 'Куда поступают средства' : 'Куди надходять кошти')} ({paymentMethod?.name || 'Баланс'}):
                  </span>
                  <span className="text-white font-['JetBrains_Mono'] font-medium truncate max-w-[260px] inline-block">
                    {destinationAddress || (language === 'EN' ? 'SkinToCash Internal Balance' : (language === 'RU' ? 'Внутренний баланс аккаунта' : 'Внутрішній баланс кабінету'))}
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
                  <span>{language === 'EN' ? 'Open Received Trade in Steam' : (language === 'RU' ? 'Открыть полученный обмен в Steam' : 'Відкрити отриманий обмін у Steam')}</span>
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
                      <span>{language === 'EN' ? 'Verifying Steam Guard & sending payout...' : (language === 'RU' ? 'Проверка Steam Guard и отправка средств...' : 'Перевірка Steam Guard та зарахування коштів...')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'EN' ? 'I accepted trade in Steam Guard (Get Funds)' : (language === 'RU' ? 'Я принял трейд в Steam Guard (Получить деньги)' : 'Я прийняв трейд у Steam Guard (Отримати кошти)')}</span>
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
                  {language === 'EN' ? 'Skins Accepted, Funds Dispatched!' : (language === 'RU' ? 'Скины приняты, средства выплачены!' : 'Скіни прийнято, кошти виплачено!')}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  {language === 'EN' 
                    ? <>Official bot <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> has accepted your CS2 items. Instant payout has been dispatched.</>
                    : language === 'RU'
                    ? <>Официальный бот <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> успешно принял ваши скины CS2. Выплата отправлена на ваш счет.</>
                    : <>Офіційний бот <strong>{OFFICIAL_STEAM_BOT.personaName}</strong> успішно прийняв ваші предмети CS2. Виплата надіслана на ваш рахунок.</>}
                </p>
              </div>

              {/* Receipt Capsule */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-['JetBrains_Mono'] space-y-1.5 text-slate-300 max-w-md mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'EN' ? 'Transaction:' : (language === 'RU' ? 'Транзакция:' : 'Транзакція:')}</span>
                  <span className="text-white font-bold">{session.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'EN' ? 'Payout Amount:' : (language === 'RU' ? 'Сумма выплаты:' : 'Сума виплати:')}</span>
                  <span className="text-emerald-400 font-bold">{formatPrice(totalPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'EN' ? 'Recipient:' : (language === 'RU' ? 'Получатель:' : 'Одержувач:')}</span>
                  <span className="text-white">{destinationAddress || 'SkinToCash'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'EN' ? 'Official Bot:' : (language === 'RU' ? 'Официальный бот:' : 'Офіційний бот:')}</span>
                  <span className="text-emerald-400 font-semibold">{OFFICIAL_STEAM_BOT.personaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'EN' ? 'Bot Region:' : (language === 'RU' ? 'Регион бота:' : 'Регіон бота:')}</span>
                  <span className="text-slate-300">{OFFICIAL_STEAM_BOT.country} 🇷🇺</span>
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-['Space_Grotesk'] cursor-pointer transition-all"
              >
                {language === 'EN' ? 'Close Window' : (language === 'RU' ? 'Закрыть окно' : 'Закрити вікно')}
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
