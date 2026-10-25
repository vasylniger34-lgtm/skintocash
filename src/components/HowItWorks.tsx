import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  CheckSquare, 
  Zap, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface HowItWorksProps {
  onScrollToSandbox: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onScrollToSandbox }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Enter Steam Trade URL',
      subtitle: 'No sign-up or Steam login required to browse valuation',
      description: 'Simply paste your Steam Trade URL or log in via official Steam OpenID. Our system safely fetches your public CS2 inventory within 1.5 seconds without ever requiring your account password or Steam API Key.',
      icon: LinkIcon,
      accent: 'emerald',
      tag: '01 / CONNECTION',
      detailSnippet: 'https://steamcommunity.com/tradeoffer/new/?partner=...',
    },
    {
      step: 2,
      title: 'Select Skins & Payout Rail',
      subtitle: 'Instant valuation with 0% platform deductions',
      description: 'Click on the skins, knives, or gloves you wish to sell. Pick your preferred payout method—Tether USDT (TRC-20), Bitcoin, Visa/Mastercard, Revolut, Apple Pay, or Bank Wire. See the exact net cash you will receive.',
      icon: CheckSquare,
      accent: 'cyan',
      tag: '02 / VALUATION',
      detailSnippet: 'Valuation calculated via real-time Buff163 orderbooks',
    },
    {
      step: 3,
      title: 'Accept Trade & Get Paid',
      subtitle: 'Funds land in under 120 seconds guaranteed',
      description: 'Our automated bot sends you a Steam Trade Offer. Verify our 6-character anti-phishing handshake code on your Steam Guard Mobile app, accept the offer, and your funds are dispatched immediately to your destination.',
      icon: Zap,
      accent: 'emerald',
      tag: '03 / SETTLEMENT',
      detailSnippet: 'Average execution time: 38 seconds',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#070A0E] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-['JetBrains_Mono'] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            3-STEP FRICTIONLESS PROCESS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-4">
            How It Works
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            From inventory to cash in your bank or crypto wallet in less than two minutes. Zero verification hassle for orders under $2,000.
          </p>
        </div>

        {/* 3 Step Interactive Grid with Connected Glowing Line */}
        <div className="relative">
          
          {/* Glowing connecting horizontal bar on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/40 to-emerald-500/20 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.step;

              return (
                <motion.div
                  key={s.step}
                  whileHover={{ y: -6 }}
                  onClick={() => setActiveStep(s.step)}
                  className={`group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-slate-900/90 border-emerald-400/60 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.25)]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  {/* Top Step Number Badge & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                            : 'bg-slate-800/80 border border-slate-700 text-slate-400 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="text-xs font-['JetBrains_Mono'] font-bold text-emerald-400/80 tracking-wider">
                        {s.tag}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono'] mb-3">
                      {s.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      {s.description}
                    </p>
                  </div>

                  {/* Micro Detail Pill */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-['JetBrains_Mono'] text-slate-400 truncate">
                    <span className="text-emerald-400 mr-1.5">✓</span>
                    {s.detailSnippet}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* CTA Banner below steps */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onScrollToSandbox}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.65)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Try Sandbox Valuation with 11 Demo Skins</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};
