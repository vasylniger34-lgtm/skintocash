import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useIntro } from '../context/IntroContext';

export const ReplayIntroButton: React.FC = () => {
  const { phase, replayIntro } = useIntro();

  // Show only once intro has completed
  if (phase !== 'completed') {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 10 }}
      transition={{ duration: 0.3 }}
      onClick={replayIntro}
      title="Replay cinematic intro animation"
      className="fixed bottom-20 md:bottom-5 left-4 md:left-5 z-40 px-3 py-1.5 rounded-full bg-[#0B1017]/85 hover:bg-[#0E1520] backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 text-[11px] font-['Space_Grotesk'] font-bold shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center gap-1.5 cursor-pointer group select-none"
    >
      <RotateCcw className="w-3 h-3 text-emerald-400 group-hover:-rotate-180 transition-transform duration-500 shrink-0" />
      <span className="tracking-wide">Replay Intro</span>
    </motion.button>
  );
};
