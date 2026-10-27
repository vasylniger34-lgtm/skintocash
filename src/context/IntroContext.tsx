import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type IntroPhase = 'loading' | 'flying' | 'revealing' | 'completed';

interface IntroContextType {
  phase: IntroPhase;
  progress: number;
  statusText: string;
  replayIntro: () => void;
  isIntroActive: boolean;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<IntroPhase>('loading');
  const [progress, setProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Status message based on percentage
  const getStatusText = (pct: number) => {
    if (pct < 40) return 'CONNECTING STEAM API NODES...';
    if (pct < 80) return 'SYNCING LIVE LIQUIDITY POOLS...';
    return 'INSTANT PAYOUT ENGINE READY';
  };

  const statusText = getStatusText(progress);

  // Body scroll lock during loading and initial flight
  useEffect(() => {
    if (phase === 'loading' || phase === 'flying') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // Main Intro Choreography Driver
  const startIntroTimeline = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setPhase('loading');
    setProgress(0);
    startTimeRef.current = null;

    const DURATION_LOADING = 1400; // Phase 1: 0 to 1400ms

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progressRatio = Math.min(1, elapsed / DURATION_LOADING);

      // Smooth custom easing for fintech telemetry counter
      // S-curve ease with brisk initial jump and crisp snap to 100%
      const ease = progressRatio < 0.5 
        ? 2 * progressRatio * progressRatio 
        : 1 - Math.pow(-2 * progressRatio + 2, 2) / 2;

      const currentPct = Math.min(100, Math.round(ease * 100));
      setProgress(currentPct);

      if (progressRatio < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Counter reached 100% -> Trigger Phase 2 (Flight to Navbar) at ~1.4s
        setProgress(100);
        
        setTimeout(() => {
          setPhase('flying');

          // Trigger Phase 3 (Hero & Navbar Items Reveal) around ~1.7s
          setTimeout(() => {
            setPhase('revealing');

            // Complete everything and unlock DOM around ~2.2s
            setTimeout(() => {
              setPhase('completed');
            }, 550);

          }, 300);

        }, 80);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Run on mount
  useEffect(() => {
    startIntroTimeline();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [startIntroTimeline]);

  // Dev Replay Trigger
  const replayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    startIntroTimeline();
  }, [startIntroTimeline]);

  const isIntroActive = phase !== 'completed';

  return (
    <IntroContext.Provider value={{ phase, progress, statusText, replayIntro, isIntroActive }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = (): IntroContextType => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
};
