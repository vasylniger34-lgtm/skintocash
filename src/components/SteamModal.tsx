import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Zap, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface SteamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
}

export const SteamModal: React.FC<SteamModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tradeUrl, setTradeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { loginWithSteam, loginWithSteamId } = useAuth();

  if (!isOpen) return null;

  const handleSteamOpenIdLogin = () => {
    setIsLoading(true);
    loginWithSteam();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const target = tradeUrl.trim() || 'demo';

    if (target !== 'demo') {
      const res = await loginWithSteamId(target);
      if (!res.success) {
        // If profile fetch fails, still allow sandbox valuation
        console.warn('Could not authenticate SteamID profile, continuing to sandbox:', res.message);
      }
    }

    setIsLoading(false);
    onSuccess(target);
    onClose();
  };

  const handleUseDemo = () => {
    setTradeUrl('https://steamcommunity.com/tradeoffer/new/?partner=184920412&token=9X4bK2sM');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0B1017] border border-white/[0.08] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.15)] z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Steam Header Icon */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mb-5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <svg className="w-6 h-6 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
            {t('steamModal.title')}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {t('steamModal.desc')}
          </p>

          {/* Option 1: Official Steam OpenID Button */}
          <button
            onClick={handleSteamOpenIdLogin}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center gap-3 transition-all mb-4 shadow-[0_0_25px_rgba(16,185,129,0.35)] group cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <svg className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.24 11.44l3.19-4.38a4.48 4.48 0 0 1-.93-.84l-4.52 1.87a9.6 9.6 0 0 1-1.07-5.09c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6c0 5.28-4.28 9.57-9.56 9.6l-3.32 4.56c.49.03.98.05 1.48.05 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
              </svg>
            )}
            <span>{t('steamModal.signInSteam')}</span>
            <ExternalLink className="w-4 h-4 text-slate-950" />
          </button>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.07]"></div>
            </div>
            <span className="relative px-3 bg-[#0B1017] text-[11px] font-['JetBrains_Mono'] text-slate-500 uppercase tracking-wider">
              {t('steamModal.orTradeUrl')}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Option 2: Enter Trade URL Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-['JetBrains_Mono']">
                <label className="text-slate-300 font-bold">{t('steamModal.tradeUrlLabel')}</label>
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  {t('steamModal.useDemo')}
                </button>
              </div>

              <input
                type="text"
                value={tradeUrl}
                onChange={(e) => setTradeUrl(e.target.value)}
                placeholder={t('steamModal.tradeUrlPlaceholder')}
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-emerald-400 transition-colors"
              />

              <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                <a
                  href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 flex items-center gap-1 underline"
                >
                  {t('steamModal.findMyUrl')}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>{t('steamModal.mustBePublic')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-['Space_Grotesk'] font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  {t('steamModal.loading')}
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>{t('steamModal.quickLogin')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee */}
          <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{t('steamModal.nonCustodial')}</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
