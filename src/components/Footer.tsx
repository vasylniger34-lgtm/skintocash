import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  Server, 
  ArrowUp 
} from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070B] border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden text-slate-400">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Live Network & Bot Operational Status Bar */}
        <div className="mb-12 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-['JetBrains_Mono']">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-bold">Network Status: Operational</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>32 Trading Bots Online (0 in cooldown)</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="text-slate-400">
              Avg Cashout Latency: <span className="text-emerald-400 font-bold">38s</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Steam Community API v2: 100% HEALTHY</span>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-400/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Zap className="w-5 h-5 fill-emerald-400" />
              </div>
              <div className="font-['Space_Grotesk'] tracking-tight font-extrabold text-xl text-white">
                SKIN<span className="text-emerald-400">TOCASH</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier instant CS2 skin cashout engine. We bridge high-tier gaming inventories with global fintech and crypto payout rails in under 120 seconds.
            </p>

            {/* Compliance & Security Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-['JetBrains_Mono'] text-slate-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-['JetBrains_Mono'] text-slate-300">
                PCI-DSS Level 1
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-['JetBrains_Mono'] text-slate-300">
                Cloudflare DDoS Defense
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onScrollToSection('inventory-sandbox')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Instant Sell Skins
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('live-payouts')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Live Deals & Payouts
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('why-us')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-emerald-400 transition-colors">
                  Trustpilot Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Payouts */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-white">
              Payout Methods
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Tether (USDT TRC20/ERC20)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Visa / Mastercard Direct</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Bitcoin (BTC) & Solana</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Revolut & Apple Pay</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>SEPA Instant EUR</span>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-white">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy & AML Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Preferences</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Bug Bounty Program</a>
              </li>
              <li>
                <button onClick={scrollToTop} className="text-emerald-400 flex items-center gap-1 hover:underline mt-2 cursor-pointer">
                  <span>Back to top</span>
                  <ArrowUp className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-slate-900 text-[11px] leading-relaxed text-slate-500 space-y-2">
          <p>
            SkinToCash is an independent secondary marketplace and instant trade cashout service. SkinToCash is not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Valve Corporation, Steam, or any of its subsidiaries or its affiliates. Counter-Strike, Counter-Strike 2, CS:GO, and the Counter-Strike logos are trademarks and/or registered trademarks of Valve Corporation. All other trademarks are property of their respective owners.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 text-slate-500 font-['JetBrains_Mono']">
            <div>
              © 2026 SkinToCash Technologies Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              <span>Engineered with</span>
              <span className="text-emerald-400">⚡</span>
              <span>for the global CS2 trading community</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
