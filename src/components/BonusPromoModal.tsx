import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface BonusPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBonus: (bonusPercentage: number) => void;
}

export const BonusPromoModal: React.FC<BonusPromoModalProps> = ({
  isOpen,
  onClose,
  onApplyBonus,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    // Copy code to clipboard
    const promoCode = 'Новичок';
    try {
      navigator.clipboard.writeText(promoCode);
    } catch {
      // fallback
    }
    setCopied(true);

    // Festive celebration with emerald and cyan sparkles
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#10B981', '#06B6D4', '#34D399', '#ffffff'],
    });

    onApplyBonus(8); // +8% bonus

    setTimeout(() => {
      onClose();
    }, 1200);
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
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Card - Strictly in our site's Emerald & Cyan Obsidian theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[560px] rounded-3xl bg-[#0B1017]/95 border border-emerald-500/30 p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.2)] z-10 overflow-hidden backdrop-blur-2xl"
        >
          {/* Top Glowing Emerald Highlight Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-90 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />

          {/* Ambient Emerald & Cyan Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-44 bg-emerald-500/15 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-60 h-40 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Tag Pill in Emerald */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-['JetBrains_Mono'] text-xs font-bold tracking-[0.18em] uppercase">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {t('bonus.badge')}
            </span>
          </div>

          {/* Main Headline with Emerald-to-Cyan gradient */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-['Space_Grotesk'] text-white text-center tracking-tight leading-snug mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              +8%
            </span>{' '}
            <span>{t('bonus.title').replace('+8% ', '').replace('+8%', '')}</span>
          </h2>

          {/* Description Text */}
          <p className="text-xs sm:text-sm text-slate-300/90 text-center leading-relaxed max-w-lg mx-auto mb-7 font-normal">
            {t('bonus.desc')}
          </p>

          {/* Large Action Button in site's Emerald Gradient */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActivate}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 font-['Space_Grotesk'] font-bold text-base tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
                  <span>{t('bonus.applied')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950" />
                  <span>{t('bonus.activateBtn')}</span>
                  <Copy className="w-4 h-4 text-slate-950 opacity-70 ml-1" />
                </>
              )}
            </motion.button>

            {/* Skip / Continue button */}
            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors cursor-pointer"
              >
                {t('bonus.skip')}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BonusPromoModal;
