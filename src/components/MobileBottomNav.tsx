import React from 'react';
import { 
  Zap, 
  ArrowLeftRight, 
  Layers, 
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentPath?: string;
  onNavigateHome: () => void;
  onNavigateP2P: () => void;
  onScrollToInventory: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath = '/',
  onNavigateHome,
  onNavigateP2P,
  onScrollToInventory,
}) => {
  const { user, openCabinet, loginWithSteam } = useAuth();
  const { t, language } = useLanguage();

  const isHome = currentPath === '/';
  const isP2P = currentPath === '/p2p';
  const isCabinet = currentPath === '/cabinet' || currentPath === '/profile';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070A0E]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
      <div className="grid grid-cols-4 items-center gap-1 max-w-md mx-auto">
        
        {/* Tab 1: Home / Instant Sell */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            isHome && !isP2P && !isCabinet
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isHome && !isP2P && !isCabinet && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          )}
          <Zap className="w-5 h-5 mb-0.5 fill-current" />
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            {t('nav.instantSell') || 'Продаж'}
          </span>
        </button>

        {/* Tab 2: P2P Marketplace */}
        <button
          onClick={onNavigateP2P}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            isP2P
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isP2P && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          )}
          <div className="relative">
            <ArrowLeftRight className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </div>
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            {t('nav.p2pMarket')}
          </span>
        </button>

        {/* Tab 3: Inventory / Skins */}
        <button
          onClick={onScrollToInventory}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <Layers className="w-5 h-5 mb-0.5 text-slate-300" />
          <span className="text-[10px] font-['Space_Grotesk'] tracking-tight">
            {t('tab.inventory') || 'Inventory'}
          </span>
        </button>

        {/* Tab 4: Cabinet / Profile */}
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
