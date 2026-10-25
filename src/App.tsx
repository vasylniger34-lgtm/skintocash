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

export function App() {
  const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanInventory = (_tradeUrl: string) => {
    scrollToSection('inventory-sandbox');
  };

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
          
          {/* Sticky Glassmorphic Navbar */}
          <Navbar
            onOpenSteamModal={() => setIsSteamModalOpen(true)}
            onScrollToSection={scrollToSection}
          />

          {/* Hero Section */}
          <Hero
            onScanInventory={handleScanInventory}
            onOpenSteamModal={() => setIsSteamModalOpen(true)}
          />

          {/* Infinite Dual-Direction Payment Methods Marquee */}
          <PaymentMarquee />

          {/* Live Real-Time Payouts Feed */}
          <LivePayoutsFeed />

          {/* Core Interactive Inventory Valuation & Cashout Sandbox */}
          <InventorySandbox />

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

        </div>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
