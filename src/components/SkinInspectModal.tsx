import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Tag } from 'lucide-react';
import type { CS2Skin } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface SkinInspectModalProps {
  skin: CS2Skin | null;
  onClose: () => void;
  onSelectAndClose: (skin: CS2Skin) => void;
  isSelected: boolean;
}

export const SkinInspectModal: React.FC<SkinInspectModalProps> = ({
  skin,
  onClose,
  onSelectAndClose,
  isSelected,
}) => {
  const { formatPrice } = useCurrency();

  if (!skin) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0B1017] border border-emerald-500/30 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.2)] z-10 overflow-hidden"
        >
          {/* Subtle top rarity bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5 opacity-90 shadow-[0_0_15px_currentColor]"
            style={{ backgroundColor: skin.rarityColor, color: skin.rarityColor }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span 
              className="px-2.5 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold border"
              style={{
                backgroundColor: `${skin.rarityColor}20`,
                borderColor: `${skin.rarityColor}50`,
                color: skin.rarityColor,
              }}
            >
              {skin.rarity.toUpperCase()}
            </span>

            {skin.isStatTrak && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                StatTrak™
              </span>
            )}

            {skin.phase && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {skin.phase}
              </span>
            )}

            <span className="px-2.5 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] text-slate-400 bg-slate-900 border border-slate-800">
              Pattern #{skin.patternIndex || 415}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mb-1">
            {skin.name}
          </h2>
          <p className="text-xs text-slate-400 font-['JetBrains_Mono'] mb-6">
            Category: <span className="text-slate-300">{skin.category}</span> • Paint Index: {skin.patternIndex}
          </p>

          {/* Centerpiece Weapon Render with Glow */}
          <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 flex items-center justify-center p-4 mb-6 overflow-hidden">
            <div 
              className="absolute w-64 h-40 blur-3xl rounded-full opacity-30"
              style={{ backgroundColor: skin.rarityColor }}
            />
            <motion.img
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              src={skin.image}
              alt={skin.name}
              className="max-h-48 sm:max-h-56 w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] relative z-10"
            />
          </div>

          {/* Wear & Float Spectrum Breakdown */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 mb-6">
            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] mb-2">
              <span className="text-slate-400">Exterior Wear:</span>
              <span className="text-white font-bold">{skin.wearName} ({skin.wear})</span>
            </div>

            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] mb-1">
              <span className="text-slate-400">Exact Float Value:</span>
              <span className="text-emerald-400 font-bold">{skin.float.toFixed(6)}</span>
            </div>

            {/* Float Bar */}
            <div className="relative mt-2">
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="w-[7%] bg-emerald-500" title="Factory New (0.00 - 0.07)" />
                <div className="w-[8%] bg-teal-500" title="Minimal Wear (0.07 - 0.15)" />
                <div className="w-[23%] bg-amber-500" title="Field-Tested (0.15 - 0.38)" />
                <div className="w-[7%] bg-orange-500" title="Well-Worn (0.38 - 0.45)" />
                <div className="w-[55%] bg-red-600" title="Battle-Scarred (0.45 - 1.00)" />
              </div>
              
              {/* Marker pin */}
              <div 
                className="absolute -top-1 w-2 h-4 bg-white rounded-full shadow-[0_0_8px_#fff]"
                style={{ left: `${Math.min(skin.float * 100, 98)}%` }}
              />
            </div>
          </div>

          {/* Applied Stickers if any */}
          {skin.stickers && skin.stickers.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 mb-2 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Applied Tournament Stickers ({skin.stickers.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {skin.stickers.map((st, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-['JetBrains_Mono']"
                  >
                    <img src={st.image} alt={st.name} className="w-6 h-6 object-contain" />
                    <div>
                      <div className="text-slate-200 font-medium text-[11px] truncate max-w-[150px]">{st.name}</div>
                      <div className="text-emerald-400 text-[10px]">+${st.price} value</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Comparison Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6 font-['JetBrains_Mono']">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Steam Market</span>
              <span className="text-sm font-semibold text-slate-300 line-through">
                {formatPrice(skin.steamPrice)}
              </span>
              <span className="text-[10px] text-red-400 block mt-0.5">-15% Valve Fee</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Buff163 Base</span>
              <span className="text-sm font-semibold text-slate-300">
                {formatPrice(skin.buffPrice)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Reference P2P</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-[10px] text-emerald-400 block uppercase font-bold">SkinToCash Direct</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatPrice(skin.price)}
              </span>
              <span className="text-[10px] text-cyan-300 block mt-0.5 font-bold">0% Fee Instant</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div>
              <div className="text-[10px] font-['JetBrains_Mono'] text-slate-400">Total Valuation</div>
              <div className="text-xl font-bold font-['JetBrains_Mono'] text-white">
                {formatPrice(skin.price)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => onSelectAndClose(skin)}
                className={`px-5 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isSelected 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                }`}
              >
                {isSelected ? (
                  <>
                    <X className="w-4 h-4" />
                    Deselect from Cashout
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Add to Cashout Cart
                  </>
                )}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
