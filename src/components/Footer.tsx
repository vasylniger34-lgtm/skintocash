import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  ArrowUp 
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onNavigateReviews?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onNavigateReviews }) => {
  const { t, language } = useLanguage();

  const handleReviewsClick = () => {
    if (onNavigateReviews) {
      onNavigateReviews();
    } else {
      window.history.pushState({}, '', '/reviews');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070B] border-t border-white/[0.07] pt-16 pb-12 relative overflow-hidden text-slate-400">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Live Network & Bot Operational Status Bar */}
        <div className="mb-12 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-['JetBrains_Mono']">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-bold">{t('footer.networkOperational')}</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('footer.botsOnline')}</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="text-slate-400">
              {t('footer.avgLatency')}
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer.steamHealthy')}</span>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <LogoIcon size={34} />
              </div>
              <div className="font-['Space_Grotesk'] tracking-tight font-extrabold text-xl text-white">
                SkinTo<span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">Cash</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.brandDesc')}
            </p>

            {/* Compliance & Security Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-[10px] font-['JetBrains_Mono'] text-slate-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-[10px] font-['JetBrains_Mono'] text-slate-300">
                PCI-DSS Level 1
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-[10px] font-['JetBrains_Mono'] text-slate-300">
                Cloudflare DDoS Defense
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-white">
              {t('footer.platform')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onScrollToSection('inventory-sandbox')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('nav.instantSell')}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('live-payouts')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('nav.liveDeals')}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('why-us')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('nav.trustSecurity')}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('nav.howItWorks')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleReviewsClick} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>{t('nav.steamReviews')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-['JetBrains_Mono'] font-bold">299+</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Payouts */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Space_Grotesk'] uppercase tracking-wider font-bold text-white">
              {t('footer.payoutMethods')}
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
              {t('footer.legalSupport')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.terms')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.privacy')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.cookies')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.bugBounty')}</a>
              </li>
              <li>
                <button onClick={scrollToTop} className="text-emerald-400 flex items-center gap-1 hover:underline mt-2 cursor-pointer">
                  <span>{t('footer.backToTop')}</span>
                  <ArrowUp className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-white/[0.06] text-[11px] leading-relaxed text-slate-500 space-y-2">
          <p>
            {t('footer.disclaimer')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 text-slate-500 font-['JetBrains_Mono']">
            <div>
              {t('footer.rights')}
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
