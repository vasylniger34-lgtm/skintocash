import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Percent, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// Mouse-tracking spotlight card wrapper
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden transition-all duration-300 border border-emerald-500/15 hover:border-emerald-500/40 shadow-xl ${className}`}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const WhyChooseUs: React.FC = () => {
  const { formatPrice } = useCurrency();
  
  // Interactive valuation comparison slider value
  const [comparisonValue, setComparisonValue] = useState<number>(1000);
  
  // Interactive fee calculator value
  const [calcAmount, setCalcAmount] = useState<number>(500);

  return (
    <section id="why-us" className="py-20 bg-[#0B1017] relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            FINTECH-GRADE INFRASTRUCTURE
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-4">
            Why 140,000+ Players Choose SkinToCash
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Engineered for high-volume traders, collectors, and casual players who demand maximum liquidity, total scam immunity, and true sub-120-second cashouts.
          </p>
        </div>

        {/* Bento Grid: 4 Interactive High-Density Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Sub-2 Minute Payouts & Speedometer (7 cols) */}
          <SpotlightCard className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-xs font-['JetBrains_Mono'] text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Avg: 38 seconds
                </div>
              </div>

              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                Sub-2 Minute Payout Speed
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Our proprietary auto-settlement cluster coordinates with 32 dedicated Steam bots. The second you accept the trade in Steam Guard, banking and crypto payout APIs are triggered instantly with 0 manual intervention.
              </p>
            </div>

            {/* Interactive Timeline Speed Indicator */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-['JetBrains_Mono'] text-slate-400 mb-3">
                <span className="text-emerald-400 font-bold">Execution Telemetry</span>
                <span>Latency: <strong className="text-cyan-400">34ms</strong></span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-['JetBrains_Mono']">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <div className="text-[10px] text-slate-400">Step 1</div>
                  <div className="font-bold">03s: Bot Offer</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <div className="text-[10px] text-slate-400">Step 2</div>
                  <div className="font-bold">18s: 2FA Accepted</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  <div className="text-[10px] text-slate-400">Step 3</div>
                  <div className="font-bold">38s: Cash Landed</div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Highest Market Valuation with Interactive Slider (5 cols) */}
          <SpotlightCard className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-['JetBrains_Mono'] text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  +12% to +15% MORE CASH
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                Highest Market Valuation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                We utilize real-time Buff163 and P2P orderbook pricing, giving you up to 95% of real market value instead of bottom-feeder bot rates.
              </p>
            </div>

            {/* Interactive Valuation Comparison Widget */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-['JetBrains_Mono'] text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Simulate Skin Value:</span>
                <span className="text-emerald-400 font-bold text-sm">{formatPrice(comparisonValue)}</span>
              </div>

              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={comparisonValue}
                onChange={(e) => setComparisonValue(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Other Trade Bots (72%):</span>
                  <span className="text-slate-500 line-through">{formatPrice(comparisonValue * 0.72)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Steam Market (after fee):</span>
                  <span className="text-amber-400">{formatPrice(comparisonValue * 0.85)} <span className="text-[10px] text-slate-500">(Locked)</span></span>
                </div>
                <div className="flex justify-between items-center text-white font-bold bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-400">SkinToCash Instant:</span>
                  <span className="text-emerald-400 text-sm font-extrabold">{formatPrice(comparisonValue * 0.94)}</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Zero Hidden Fees with Interactive Calculator (5 cols) */}
          <SpotlightCard className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Percent className="w-6 h-6" />
                </div>
                <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  0% PLATFORM FEE
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                Zero Hidden Deductions
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                No hidden withdrawal fees, no mandatory membership cuts, and no conversion traps. The exact number quoted on screen is what lands in your account.
              </p>
            </div>

            {/* Fee Transparency Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 font-['JetBrains_Mono'] text-xs">
              <div className="flex justify-between text-slate-400 items-center">
                <span>Enter Amount:</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-right bg-slate-800 border border-slate-700 rounded text-white font-bold text-xs"
                />
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Commission:</span>
                <span className="text-emerald-400 font-bold">0.00%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Crypto Network Fee:</span>
                <span className="text-emerald-400 font-bold">Sponsored (FREE)</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800">
                <span>You Receive:</span>
                <span className="text-emerald-400 text-sm">{formatPrice(calcAmount)}</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4: Bank-Grade Steam API Protection (7 cols) */}
          <SpotlightCard className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  NON-CUSTODIAL & SAFE
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
                Bank-Grade Anti-API Scam Protocol
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Phishing bots and rogue API keys steal millions in CS2 skins every month. SkinToCash utilizes a proprietary 2-way Handshake Token. If the security code in your Steam Mobile confirmation does not match our UI, the trade never executes.
              </p>
            </div>

            {/* Security Architecture Visual Graphic */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">Zero API Key Required</div>
                  <div className="text-slate-400 text-[10px]">We never request or store your Steam Web API Key.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">Bot Identity Badging</div>
                  <div className="text-slate-400 text-[10px]">Verified Steam account age (8+ yrs) and level displayed.</div>
                </div>
              </div>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
