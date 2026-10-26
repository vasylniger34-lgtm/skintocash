import { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { UserCabinetModal } from './components/UserCabinetModal';

function MainContent() {
  const { user } = useAuth();
  const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isBonusApplied, setIsBonusApplied] = useState(false);
  const [activeTradeUrl, setActiveTradeUrl] = useState<string>('demo');

  // When user logs in with Steam, automatically load their real inventory
  useEffect(() => {
    if (user && activeTradeUrl === 'demo') {
      const target = user.tradeUrl || user.steamId64;
      if (target) {
        setActiveTradeUrl(target);
      }
    }
  }, [user, activeTradeUrl]);

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
    scrollToSection('inventory-sandbox');
  };

  const handleOpenSellFlow = () => {
    setIsSteamModalOpen(true);
  };

  return (
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
        onTradeUrlChange={(url) => setActiveTradeUrl(url)}
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

      {/* User Personal Cabinet Modal */}
      <UserCabinetModal onLoadInventoryToSandbox={handleScanInventory} />

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
  );
}

export function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;

