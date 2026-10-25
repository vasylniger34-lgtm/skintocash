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

    // Festive celebration
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#10B981', '#FBBF24', '#ffffff'],
    });

    onApplyBonus(8); // +8% bonus

    setTimeout(() => {
      onClose();
    }, 1100);
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

        {/* Modal Card - Styled faithfully to the user's reference with dark gaming luxury */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[560px] rounded-3xl bg-[#0D1219]/95 border border-amber-500/30 p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.18)] z-10 overflow-hidden backdrop-blur-2xl"
        >
          {/* Subtle Top Gold Highlight Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

          {/* Ambient Amber Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-44 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:border-amber-400/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Tag Pill */}
          <div className="text-center mb-3">
            <span className="font-['JetBrains_Mono'] text-[12px] sm:text-xs font-bold tracking-[0.22em] text-[#E0A838] uppercase">
              {t('bonus.badge')}
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-['Space_Grotesk'] text-white text-center tracking-tight leading-snug mb-4">
            {t('bonus.title')}
          </h2>

          {/* Description Text matching user reference */}
          <p className="text-xs sm:text-sm text-slate-300/90 text-center leading-relaxed max-w-lg mx-auto mb-7 font-normal">
            {t('bonus.desc')}
          </p>

          {/* Large Gold Action Button */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActivate}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#F59E0B] hover:brightness-110 text-slate-950 font-['Space_Grotesk'] font-bold text-base tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-slate-950" />
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
                className="text-xs text-slate-500 hover:text-slate-400 font-medium transition-colors cursor-pointer"
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
