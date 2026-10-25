import { useState } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PaymentMarquee } from './components/PaymentMarquee';
import { LivePayoutsFeed } from './components/LivePayoutsFeed';
import { InventorySandbox } from './components/InventorySandbox';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { TrustpilotReviews } from './components/TrustpilotReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SteamModal } from './components/SteamModal';
import { BonusPromoModal } from './components/BonusPromoModal';

export function App() {
  const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isBonusApplied, setIsBonusApplied] = useState(false);
  const [activeTradeUrl, setActiveTradeUrl] = useState<string>('https://steamcommunity.com/tradeoffer/new/?partner=184920412&token=9X4bK2sM');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanInventory = (tradeUrl: string) => {
    if (tradeUrl) {
      setActiveTradeUrl(tradeUrl);
    }
    // If newcomer bonus has not yet been applied, show the bonus modal
    if (!isBonusApplied) {
      setIsBonusModalOpen(true);
    }
    scrollToSection('inventory-sandbox');
  };

  const handleOpenSellFlow = () => {
    if (!isBonusApplied) {
      setIsBonusModalOpen(true);
    } else {
      setIsSteamModalOpen(true);
    }
  };

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
          
          {/* Sticky Glassmorphic Navbar with Custom SVG Emblem */}
          <Navbar
            onOpenSteamModal={handleOpenSellFlow}
            onScrollToSection={scrollToSection}
          />

          {/* Hero Section with 3D Tilting Rotating Showcase Card */}
          <Hero
            onScanInventory={handleScanInventory}
            onOpenSteamModal={handleOpenSellFlow}
            onTriggerSellModal={() => {
              if (!isBonusApplied) setIsBonusModalOpen(true);
            }}
          />

          {/* Infinite Dual-Direction Payment Methods Marquee */}
          <PaymentMarquee />

          {/* Live Real-Time Payouts Feed */}
          <LivePayoutsFeed />

          {/* Core Interactive Inventory Valuation & Cashout Sandbox with Real Steam Sync */}
          <InventorySandbox 
            tradeUrl={activeTradeUrl}
            isBonusApplied={isBonusApplied}
            onOpenBonusModal={() => setIsBonusModalOpen(true)}
          />

          {/* Why Players Choose Us Bento Grid with Cursor Spotlight */}
          <WhyChooseUs />

          {/* Interactive 3-Step "How It Works" Timeline */}
          <HowItWorks onScrollToSandbox={() => scrollToSection('inventory-sandbox')} />

          {/* Trustpilot Social Proof & Reviews */}
          <TrustpilotReviews />

          {/* Modern Expandable FAQ Accordion */}
          <FAQSection />

          {/* High-Trust Fintech Footer */}
          <Footer onScrollToSection={scrollToSection} />

          {/* Steam Trade URL / Sign In Dialog */}
          <SteamModal
            isOpen={isSteamModalOpen}
            onClose={() => setIsSteamModalOpen(false)}
            onSuccess={handleScanInventory}
          />

          {/* Newcomer +8% Bonus Promo Modal (Faithful to User Screenshot) */}
          <BonusPromoModal
            isOpen={isBonusModalOpen}
            onClose={() => setIsBonusModalOpen(false)}
            onApplyBonus={() => {
              setIsBonusApplied(true);
              scrollToSection('inventory-sandbox');
            }}
          />

        </div>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
