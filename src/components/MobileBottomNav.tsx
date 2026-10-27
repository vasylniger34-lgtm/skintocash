import React from 'react';
import { 
  Zap, 
  Layers, 
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentPath?: string;
  onNavigateHome: () => void;
  onNavigateSell?: () => void;
  onScrollToInventory: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath = '/',
  onNavigateHome,
  onNavigateSell,
  onScrollToInventory,
}) => {
  const { user, openCabinet, loginWithSteam } = useAuth();
  const { t, language } = useLanguage();

  const isHome = currentPath === '/';
  const isSell = currentPath === '/sell';
  const isCabinet = currentPath === '/cabinet' || currentPath === '/profile';

  const handleSellClick = () => {
    if (user) {
      if (onNavigateSell) {
        onNavigateSell();
      } else {
        window.history.pushState({}, '', '/sell');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else {
      loginWithSteam();
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070A0E]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
      <div className="grid grid-cols-3 items-center gap-1 max-w-md mx-auto">
        
        {/* Tab 1: Home / Valuation */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            isHome && !isSell && !isCabinet
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isHome && !isSell && !isCabinet && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          )}
          <Layers className="w-5 h-5 mb-0.5 fill-current" />
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            Оцінка
          </span>
        </button>

        {/* Tab 2: Sell Page / Instant Cashout */}
        <button
          onClick={handleSellClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            isSell
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isSell && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          )}
          <Zap className="w-5 h-5 mb-0.5 text-emerald-400 fill-emerald-400" />
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            {t('nav.instantSell') || 'Продаж'}
          </span>
        </button>

        {/* Tab 3: Cabinet / Profile */}
        <button
          onClick={() => {
            if (user) {
              openCabinet();
            } else {
              loginWithSteam();
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            isCabinet
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isCabinet && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          )}
          
          {user ? (
            <div className="relative mb-0.5">
              <img
                src={user.avatar}
                alt={user.personaname}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400/80"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-slate-950" />
            </div>
          ) : (
            <Wallet className="w-5 h-5 mb-0.5" />
          )}
          
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            {user ? t('nav.cabinet') : t('nav.signInCompact')}
          </span>
        </button>

      </div>
    </div>
  );
};
