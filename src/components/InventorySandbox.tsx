import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Check, 
  Eye, 
  Search, 
  Sparkles, 
  ArrowUpDown, 
  ShieldCheck, 
  ArrowRight,
  CheckSquare,
  Square
} from 'lucide-react';
import { MOCK_CS2_INVENTORY } from '../data/skinsData';
import { FIAT_PAYMENT_METHODS, CRYPTO_PAYMENT_METHODS } from '../data/paymentMethods';
import type { CS2Skin, PaymentOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { SkinInspectModal } from './SkinInspectModal';
import { TradeOfferModal } from './TradeOfferModal';

export const InventorySandbox: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [skins] = useState<CS2Skin[]>(MOCK_CS2_INVENTORY);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(['skin-karambit-gamma-emerald', 'skin-m4a1-printstream', 'skin-butterfly-fade'])
  );
  
  // Filtering & Sorting
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'float-asc'>('price-desc');

  // Modals & Payout Setup
  const [inspectingSkin, setInspectingSkin] = useState<CS2Skin | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption>(CRYPTO_PAYMENT_METHODS[0]); // USDT TRC20 default
  const [destinationInput, setDestinationInput] = useState('0x71C...b92F4 (TRC-20)');
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);

  // Toggle skin selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSkins.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSkins.map(s => s.id)));
    }
  };

  // Filtered and sorted skins
  const filteredSkins = useMemo(() => {
    return skins
      .filter(skin => {
        if (activeCategory === 'knives-gloves') {
          return skin.category === 'Knife' || skin.category === 'Gloves';
        }
        if (activeCategory === 'rifles') {
          return skin.category === 'Rifle' || skin.category === 'Sniper';
        }
        if (activeCategory === 'pistols') {
          return skin.category === 'Pistol';
        }
        if (activeCategory === 'stattrak') {
          return !!skin.isStatTrak;
        }
        return true;
      })
      .filter(skin => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return skin.name.toLowerCase().includes(query) || skin.skinName.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'float-asc') return a.float - b.float;
        return 0;
      });
  }, [skins, activeCategory, searchQuery, sortBy]);

  // Calculations for selected items
  const selectedSkinsList = useMemo(() => {
    return skins.filter(s => selectedIds.has(s.id));
  }, [skins, selectedIds]);

  const totalCashoutValue = useMemo(() => {
    return selectedSkinsList.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedSkinsList]);

  const allAvailablePaymentMethods = useMemo(() => {
    return [...CRYPTO_PAYMENT_METHODS.slice(0, 4), ...FIAT_PAYMENT_METHODS.slice(0, 4)];
  }, []);

  return (
    <section id="inventory-sandbox" className="py-16 sm:py-24 bg-[#070A0E] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            CORE FEATURE SANDBOX
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-4">
            Instant Inventory Valuation & Cashout
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Select items from the loaded demo CS2 inventory below. Watch your cashout total calculate dynamically in real-time with 0% platform fee.
          </p>
        </div>

        {/* Sandbox Content Layout: Grid (8 cols) + Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Inventory Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Control Bar: Filters, Search & Sort */}
            <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'knives-gloves', label: 'Knives & Gloves' },
                  { id: 'rifles', label: 'Rifles & AWP' },
                  { id: 'pistols', label: 'Pistols' },
                  { id: 'stattrak', label: 'StatTrak™' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skin..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="float-asc">Float: Best (Low)</option>
                  </select>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Quick Multi-Select Action Bar */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-400 font-['JetBrains_Mono']">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  {selectedIds.size === filteredSkins.length ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Select All ({filteredSkins.length})</span>
                    </>
                  )}
                </button>
                <span>•</span>
                <span>
                  Selected: <strong className="text-white">{selectedIds.size}</strong> of {filteredSkins.length}
                </span>
              </div>

              <span className="hidden sm:inline text-slate-500">
                Click any skin to add/remove from instant cashout
              </span>
            </div>

            {/* CS2 Inventory Skins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
              <AnimatePresence>
                {filteredSkins.map((skin) => {
                  const isSelected = selectedIds.has(skin.id);

                  return (
                    <motion.div
                      key={skin.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      onClick={() => toggleSelect(skin.id)}
                      className={`group relative rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                        isSelected
                          ? 'bg-slate-900/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                          : 'bg-slate-900/50 border border-slate-800 hover:border-slate-600 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Top Rarity Border Line */}
                      <div
                        className="absolute top-0 left-3 right-3 h-1 rounded-t-full"
                        style={{
                          backgroundColor: skin.rarityColor,
                          boxShadow: isSelected ? `0 0 10px ${skin.rarityColor}` : 'none',
                        }}
                      />

                      {/* Card Header: Checkbox & Badges */}
                      <div className="flex items-start justify-between gap-1 mb-2 pt-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {skin.wear}
                          </span>

                          {skin.isStatTrak && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ST™
                            </span>
                          )}

                          {skin.phase && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {skin.phase}
                            </span>
                          )}
                        </div>

                        {/* Selection Indicator Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'border border-slate-700 bg-slate-800/80 group-hover:border-slate-500'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Weapon Image Preview with hover inspect button */}
                      <div className="relative h-28 my-2 flex items-center justify-center">
                        <div
                          className="absolute inset-2 blur-xl rounded-full opacity-20 pointer-events-none"
                          style={{ backgroundColor: skin.rarityColor }}
                        />
                        <img
                          src={skin.image}
                          alt={skin.name}
                          className="max-h-24 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />

                        {/* Quick Inspect Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingSkin(skin);
                          }}
                          className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white hover:border-emerald-400 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                          title="Inspect float & stickers"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stickers Row (if present) */}
                      {skin.stickers && skin.stickers.length > 0 && (
                        <div className="flex items-center gap-1 mb-2 px-1">
                          {skin.stickers.map((stk, idx) => (
                            <img
                              key={idx}
                              src={stk.image}
                              alt={stk.name}
                              title={stk.name}
                              className="w-4 h-4 object-contain filter drop-shadow-sm"
                            />
                          ))}
                        </div>
                      )}

                      {/* Card Footer: Names, Float & Price */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-slate-400 truncate">
                          {skin.weapon}
                        </div>
                        <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                          {skin.skinName}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="text-[10px] font-['JetBrains_Mono'] text-slate-500">
                            {skin.float.toFixed(4)}
                          </span>

                          <span
                            className={`text-xs sm:text-sm font-extrabold font-['JetBrains_Mono'] ${
                              isSelected ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {formatPrice(skin.price)}
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </div>

          {/* Sticky Interactive Payout Calculation Panel (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            
            <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                    Payout Calculation
                  </h3>
                </div>

                <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  0% FEE PROMO
                </span>
              </div>

              {/* Dynamic Animated Value Counter */}
              <div className="py-5 text-center bg-slate-900/70 rounded-2xl my-4 border border-slate-800/80">
                <span className="text-[11px] font-['Space_Grotesk'] uppercase tracking-wider text-slate-400 block mb-1">
                  Total Instant Cash Valuation ({selectedSkinsList.length} items)
                </span>
                
                <div className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.45)]">
                  {formatPrice(totalCashoutValue)}
                </div>

                <div className="mt-2 text-xs text-slate-400 font-['JetBrains_Mono'] flex items-center justify-center gap-2">
                  <span>Steam Equivalent:</span>
                  <span className="text-slate-500 line-through">
                    {formatPrice(totalCashoutValue * 1.14)}
                  </span>
                </div>
              </div>

              {/* Payout Method Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-slate-300 font-bold block">
                  Select Payout Method
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {allAvailablePaymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                        selectedPaymentMethod.id === method.id
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                        {method.category === 'crypto' ? '₮' : '💳'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold font-['Space_Grotesk'] truncate text-[11px]">{method.name}</div>
                        <div className="text-[9px] text-emerald-400 font-['JetBrains_Mono']">{method.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Address / Account Input */}
              <div className="mb-4">
                <label className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  {selectedPaymentMethod.category === 'crypto' ? 'Your Crypto Wallet Address' : 'Card or IBAN Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder={
                      selectedPaymentMethod.category === 'crypto'
                        ? 'Enter TRC-20 / ERC-20 / Solana Address'
                        : 'Enter 16-digit Card number or IBAN'
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="space-y-2 py-3 border-y border-slate-800 text-xs font-['JetBrains_Mono']">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Item Valuation:</span>
                  <span className="text-slate-200">{formatPrice(totalCashoutValue)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform Commission:</span>
                  <span className="text-emerald-400 font-bold">0.00% ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Gateway / Gas Fee:</span>
                  <span className="text-emerald-400 font-bold">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
                  <span>Final Net Payout:</span>
                  <span className="text-emerald-400 text-sm">{formatPrice(totalCashoutValue)}</span>
                </div>
              </div>

              {/* Glowing Cashout Action Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedSkinsList.length === 0}
                  onClick={() => setIsCashoutModalOpen(true)}
                  className={`w-full py-4 rounded-xl font-['Space_Grotesk'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    selectedSkinsList.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] animate-shimmer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    Cashout {formatPrice(totalCashoutValue)} Now
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified 2FA Steam Guard Delivery in &lt; 120s</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Inspect Skin Details Modal */}
      <SkinInspectModal
        skin={inspectingSkin}
        onClose={() => setInspectingSkin(null)}
        isSelected={inspectingSkin ? selectedIds.has(inspectingSkin.id) : false}
        onSelectAndClose={(skin) => {
          toggleSelect(skin.id);
          setInspectingSkin(null);
        }}
      />

      {/* Cashout Trade Offer Simulation Modal */}
      <TradeOfferModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        selectedSkins={selectedSkinsList}
        totalPayout={totalCashoutValue}
        paymentMethod={selectedPaymentMethod}
        destinationAddress={destinationInput}
      />

    </section>
  );
};
