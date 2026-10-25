import React from 'react';
import { Zap, CreditCard, CheckCircle } from 'lucide-react';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import type { PaymentOption } from '../types';

export const PaymentMarquee: React.FC = () => {
  // Render payment method icon helper
  const renderIcon = (id: string) => {
    switch (id) {
      case 'visa':
        return (
          <span className="font-['Space_Grotesk'] font-extrabold italic text-sm tracking-wider text-slate-300 group-hover:text-cyan-300">
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <div className="flex -space-x-2">
            <span className="w-4 h-4 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-4 h-4 rounded-full bg-amber-500/80 inline-block"></span>
          </div>
        );
      case 'applepay':
        return (
          <span className="font-['Space_Grotesk'] font-bold text-xs tracking-tight text-slate-300 group-hover:text-white flex items-center gap-1">
             Pay
          </span>
        );
      case 'googlepay':
        return (
          <span className="font-['Space_Grotesk'] font-bold text-xs tracking-tight text-slate-300 group-hover:text-white">
            G Pay
          </span>
        );
      case 'sepa':
        return (
          <span className="font-['JetBrains_Mono'] font-bold text-xs tracking-wider text-emerald-400">
            SEPA
          </span>
        );
      case 'revolut':
        return (
          <span className="font-['Space_Grotesk'] font-black text-sm tracking-widest text-slate-200 group-hover:text-emerald-300">
            R
          </span>
        );
      case 'privat24':
        return (
          <span className="font-['Space_Grotesk'] font-bold text-xs text-emerald-400">
            Privat24
          </span>
        );
      case 'monobank':
        return (
          <span className="font-['Space_Grotesk'] font-bold text-xs text-slate-200 group-hover:text-white">
            mono
          </span>
        );
      case 'payoneer':
        return (
          <span className="font-['Space_Grotesk'] font-bold text-xs text-amber-400">
            Payoneer
          </span>
        );
      case 'usdt-trc20':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] border border-emerald-500/40 font-['JetBrains_Mono']">
            ₮
          </div>
        );
      case 'btc':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] border border-amber-500/40 font-['JetBrains_Mono']">
            ₿
          </div>
        );
      case 'eth':
        return (
          <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] border border-cyan-400/40 font-['JetBrains_Mono']">
            Ξ
          </div>
        );
      case 'sol':
        return (
          <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] border border-purple-400/40 font-['JetBrains_Mono']">
            ◎
          </div>
        );
      case 'ltc':
        return (
          <div className="w-5 h-5 rounded-full bg-slate-500/20 text-slate-300 flex items-center justify-center font-bold text-[10px] border border-slate-400/40 font-['JetBrains_Mono']">
            Ł
          </div>
        );
      case 'binance-pay':
        return (
          <div className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[9px] border border-amber-400/40 font-['JetBrains_Mono']">
            B
          </div>
        );
      case 'ton':
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] border border-blue-400/40 font-['JetBrains_Mono']">
            💎
          </div>
        );
      default:
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
    }
  };

  const renderBadge = (method: PaymentOption) => {
    if (method.badgeType === 'free') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {method.badge}
        </span>
      );
    }
    if (method.badgeType === 'instant') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          {method.badge}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-slate-800 text-slate-300 border border-slate-700">
        {method.badge}
      </span>
    );
  };

  // Duplicate items for continuous infinite scroll
  const row1Items = [...FIAT_PAYMENT_METHODS, ...FIAT_PAYMENT_METHODS, ...FIAT_PAYMENT_METHODS];
  const row2Items = [...CRYPTO_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS, ...CRYPTO_PAYMENT_METHODS];

  return (
    <section className="relative py-8 bg-[#090D14]/90 border-y border-emerald-500/10 overflow-hidden">
      
      {/* Subtle section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase tracking-widest font-['JetBrains_Mono'] text-[11px] text-slate-400 font-semibold">
            Supported Payout Rails — 100% Guaranteed Instant Settlement
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-['JetBrains_Mono'] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3 h-3" /> 0% Platform Commission
          </span>
          <span>•</span>
          <span>Automatic Instant Execution</span>
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
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer shadow-sm min-w-[170px]"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:border-emerald-500/40 transition-colors">
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
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/40 hover:bg-slate-900 transition-all cursor-pointer shadow-sm min-w-[190px]"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-400/40 transition-colors">
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

      {/* Marquee Keyframes Inlined or via CSS */}
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
