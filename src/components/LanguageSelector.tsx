import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES, type Language } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'footer' | 'pill';
  showCode?: boolean;
  className?: string;
  align?: 'left' | 'right';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  showCode = true,
  className = '',
  align = 'right',
}) => {
  const { language, setLanguage, currentOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('nav.selectLanguage') || 'Select Language'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer font-['JetBrains_Mono'] text-xs select-none ${
          isOpen
            ? 'bg-slate-800 text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
            : 'bg-slate-900/80 hover:bg-slate-800/90 border-white/10 hover:border-emerald-500/40 text-slate-200'
        }`}
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        {showCode && <span className="font-bold tracking-wider">{currentOption.code}</span>}
        <ChevronDown
          className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-2xl bg-[#0B1017] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-1.5 z-50 backdrop-blur-2xl`}
          >
            <div className="px-2.5 py-1.5 text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 font-bold border-b border-white/[0.06] mb-1 flex items-center justify-between">
              <span>{t('nav.selectLanguage') || 'Select Language'}</span>
              <Globe className="w-3 h-3 text-emerald-400" />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-0.5">
              {LANGUAGES.map((item) => {
                const isActive = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{item.flag}</span>
                      <span className="font-['Space_Grotesk'] font-medium">{item.nativeName}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="text-[10px] font-['JetBrains_Mono'] text-slate-500">
                        {item.code}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
