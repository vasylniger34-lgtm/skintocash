import React from 'react';
import { Zap, CreditCard, CheckCircle } from 'lucide-react';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import { useLanguage } from '../context/LanguageContext';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import type { PaymentOption } from '../types';

export const PaymentMarquee: React.FC = () => {
  const { t } = useLanguage();

  const renderIcon = (id: string) => {
    return <PaymentMethodIcon id={id} size={22} />;
  };

  const renderBadge = (method: PaymentOption) => {
    if (method.badgeType === 'free') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {method.badge}
        </span>
      );
    }
    if (method.badgeType === 'instant') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          {method.badge}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-slate-800 text-slate-300 border border-slate-700">
        {method.badge}
      </span>
    );
  };

  const row1Items = [...FIAT_PAYMENT_METHODS, ...FIAT_PAYMENT_METHODS, ...FIAT_PAYMENT_METHODS];
  const row2Items = [...CRYPTO_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS];

  return (
    <section className="relative py-8 bg-[#080C12]/90 border-y border-white/[0.06] overflow-hidden">
      
      {/* Subtle section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase tracking-widest font-['JetBrains_Mono'] text-[11px] text-slate-400 font-semibold">
            {t('marquee.supportedRails')}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-['JetBrains_Mono'] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3 h-3" /> {t('marquee.zeroFee')}
          </span>
          <span>•</span>
          <span>{t('marquee.autoExec')}</span>
        </div>
      </div>

      {/* Masked Marquee Container with dark faded edges */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        
        {/* Row 1: Fiat / Cards / Banking (Moves Left) */}
        <div className="flex gap-3 py-1.5 w-max animate-[marqueeLeft_40s_linear_infinite] hover:[animation-play-state:paused]">
          {row1Items.map((item, idx) => (
            <div
              key={`row1-${item.id}-${idx}`}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer shadow-sm min-w-[170px]"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 border border-white/[0.06] group-hover:border-emerald-500/40 transition-colors">
                {renderIcon(item.id)}
              </div>
              
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 font-['Space_Grotesk'] transition-colors">
                    {item.name}
                  </span>
                  {renderBadge(item)}
                </div>
                <span className="text-[10px] font-['JetBrains_Mono'] text-slate-400">
                  Speed: <strong className="text-slate-300">{item.speed}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Crypto / Web3 (Moves Right) */}
        <div className="flex gap-3 py-1.5 w-max animate-[marqueeRight_45s_linear_infinite] hover:[animation-play-state:paused] mt-2">
          {row2Items.map((item, idx) => (
            <div
              key={`row2-${item.id}-${idx}`}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] hover:border-cyan-400/40 hover:bg-slate-900 transition-all cursor-pointer shadow-sm min-w-[190px]"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 border border-white/[0.06] group-hover:border-cyan-400/40 transition-colors">
                {renderIcon(item.id)}
              </div>
              
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 font-['Space_Grotesk'] transition-colors">
                    {item.name}
                  </span>
                  {renderBadge(item)}
                </div>
                <span className="text-[10px] font-['JetBrains_Mono'] text-slate-400">
                  Fee: <strong className="text-emerald-400">{item.fee}</strong> • {item.speed}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </section>
  );
};
