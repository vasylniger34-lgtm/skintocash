import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './LogoIcon';
import { useIntro } from '../context/IntroContext';

export const IntroPreloader: React.FC = () => {
  const { phase, progress, statusText } = useIntro();

  // If already completed, remove from DOM
  if (phase === 'completed') {
    return null;
  }

  const isLoading = phase === 'loading';

  return (
    <AnimatePresence>
      <motion.div
        key="skintocash-intro-curtain"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-0 z-[100] bg-[#05080B] flex flex-col items-center justify-center overflow-hidden ${
          isLoading ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Velvety Deep Radial Emerald Glow Background (No harsh square grids) */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.7, 0.95, 0.7],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Ambient Dark Obsidian Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080B]/80 via-transparent to-[#05080B] pointer-events-none" />

        {/* Centered Vault Area (Zero rectangular clipping) */}
        <div className="relative z-10 flex flex-col items-center overflow-visible">
          
          {/* Centered Logo (Shared Layout Target during Phase 1) */}
          <div className="h-16 sm:h-20 flex items-center justify-center overflow-visible">
            {isLoading && (
              <motion.div
                key="intro-center-logo"
                layoutId="skintocash-brand-logo"
                transition={{
                  type: 'spring',
                  stiffness: 60,
                  damping: 18,
                  mass: 1,
                }}
                className="flex items-center gap-3 sm:gap-3.5 select-none origin-center scale-[1.3] sm:scale-[1.6] overflow-visible"
              >
                {/* Logo Icon with animated stroke draw & pure organic neon glow */}
                <div className="relative flex items-center justify-center overflow-visible">
                  <LogoIcon size={38} animated={true} />
                  
                  {/* Organic Neon Pulse Glow Ring */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.8, 0.4], scale: [0.8, 1.3, 1.15] }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute -inset-2 rounded-full bg-emerald-400/20 blur-xl pointer-events-none -z-10"
                  />
                </div>

                {/* Brand Text (No overflow-hidden, no clipping boxes, clean organic typography) */}
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl tracking-tight text-white flex items-center shrink-0 relative overflow-visible"
                >
                  <span className="text-white">SkinTo</span>
                  <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)] ml-0.5">
                    Cash
                  </span>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Minimalist Fintech Telemetry Counter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isLoading ? 1 : 0,
              y: isLoading ? 0 : 10,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center mt-7 space-y-2.5"
          >
            {/* Razor-thin 1.5px progress line */}
            <div className="w-52 sm:w-64 h-[1.5px] bg-white/[0.08] rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_16px_rgba(16,185,129,0.85)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>

            {/* Telemetry status in JetBrains Mono */}
            <div className="w-52 sm:w-64 flex items-center justify-between text-[10px] sm:text-[11px] font-['JetBrains_Mono'] tracking-wider">
              <span className="text-emerald-400/90 uppercase font-medium truncate max-w-[190px]">
                {statusText}
              </span>
              <span className="text-white font-extrabold ml-2">
                {String(progress).padStart(2, '0')}%
              </span>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </AnimatePresence>
  );
};
