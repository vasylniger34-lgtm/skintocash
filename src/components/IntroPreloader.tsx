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
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[100] bg-[#05080B] flex flex-col items-center justify-center overflow-hidden ${
          isLoading ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Subtle Radial Emerald Pulse Background */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.65, 0.95, 0.65],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Faint Tactical Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
          }}
        />

        {/* Tactical Crosshair / Corner brackets */}
        <div className="absolute inset-8 sm:inset-16 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
        </div>

        {/* Centered Vault Area */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Centered Logo (Shared Layout Target during Phase 1) */}
          <div className="h-16 sm:h-20 flex items-center justify-center">
            {isLoading && (
              <motion.div
                key="intro-center-logo"
                layoutId="skintocash-brand-logo"
                transition={{
                  type: 'spring',
                  stiffness: 65,
                  damping: 16,
                  mass: 1,
                }}
                className="flex items-center gap-3 sm:gap-3.5 select-none origin-center scale-[1.3] sm:scale-[1.6]"
              >
                {/* Logo Icon with animated stroke draw & neon emerald charge */}
                <div className="relative flex items-center justify-center filter drop-shadow-[0_0_35px_rgba(16,185,129,0.85)]">
                  <LogoIcon size={38} animated={true} />
                  
                  {/* Surrounding Neon Charge Ring */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 0.6], scale: [0.7, 1.25, 1.1] }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md pointer-events-none -z-10"
                  />
                </div>

                {/* Brand Text with Clip-path slide out & light-shimmer */}
                <div className="overflow-hidden py-1">
                  <motion.div
                    initial={{ x: -28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl tracking-tight text-white flex items-center shrink-0 relative"
                  >
                    <span>SkinTo</span>
                    <span className="text-emerald-400 drop-shadow-[0_0_18px_rgba(16,185,129,0.7)] ml-0.5">
                      Cash
                    </span>

                    {/* Light-shimmer sweep across the letters */}
                    <motion.div
                      initial={{ x: '-120%' }}
                      animate={{ x: '240%' }}
                      transition={{ duration: 1.0, delay: 0.45, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none -skew-x-12"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Minimalist Fintech Telemetry Counter (Below the Centered Logo) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isLoading ? 1 : 0,
              y: isLoading ? 0 : 12,
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col items-center mt-7 space-y-2.5"
          >
            {/* Razor-thin 1px progress line filling with emerald-to-cyan gradient */}
            <div className="w-52 sm:w-64 h-[1.5px] bg-white/[0.08] rounded-full overflow-hidden relative shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_18px_rgba(16,185,129,0.9)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>

            {/* Telemetry info row in JetBrains Mono */}
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
