import { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LivePayoutsFeed } from './components/LivePayoutsFeed';
import { InventorySandbox } from './components/InventorySandbox';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { TrustpilotReviews } from './components/TrustpilotReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SteamModal } from './components/SteamModal';
import { BonusPromoModal } from './components/BonusPromoModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CabinetPage } from './pages/CabinetPage';
import { P2PPage } from './pages/P2PPage';

function MainContent() {
  const { user, closeCabinet } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });
  const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isBonusApplied, setIsBonusApplied] = useState(false);
  const [activeTradeUrl, setActiveTradeUrl] = useState<string>('demo');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    if (currentPath !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanInventory = (tradeUrl: string) => {
    if (tradeUrl) {
      setActiveTradeUrl(tradeUrl);
    }
    if (currentPath !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
      setTimeout(() => {
        const el = document.getElementById('inventory-sandbox');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      scrollToSection('inventory-sandbox');
    }
  };

  const handleOpenSellFlow = () => {
    setIsSteamModalOpen(true);
  };

  // If on /cabinet or /profile path: render standalone dedicated Cabinet page!
  if (currentPath === '/cabinet' || currentPath === '/profile') {
    return (
      <div className="min-h-screen bg-[#070A0E] pb-16 md:pb-0">
        <CabinetPage
          onNavigateHome={() => {
            closeCabinet();
            setCurrentPath('/');
          }}
          onLoadInventoryAndGoHome={(target) => {
            handleScanInventory(target);
            closeCabinet();
            setCurrentPath('/');
          }}
        />
        <MobileBottomNav
          currentPath={currentPath}
          onNavigateHome={() => {
            closeCabinet();
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
          onNavigateP2P={() => {
            closeCabinet();
            window.history.pushState({}, '', '/p2p');
            setCurrentPath('/p2p');
          }}
          onScrollToInventory={() => {
            closeCabinet();
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
            setTimeout(() => {
              const el = document.getElementById('inventory-sandbox');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      </div>
    );
  }

  // If on /p2p path: render standalone dedicated P2P Marketplace page!
  if (currentPath === '/p2p') {
    return (
      <div className="min-h-screen bg-[#070A0E] pb-16 md:pb-0">
        <P2PPage
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
          onOpenLogin={() => setIsSteamModalOpen(true)}
        />
        <MobileBottomNav
          currentPath={currentPath}
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
          onNavigateP2P={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onScrollToInventory={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
            setTimeout(() => {
              const el = document.getElementById('inventory-sandbox');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#E5E7EB] font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 pb-20 md:pb-0">
      
      {/* Sticky Glassmorphic Navbar with Custom SVG Emblem */}
      <Navbar
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

      {/* Newcomer +8% Bonus Promo Modal (Faithful to User Screenshot) */}
      <BonusPromoModal
        isOpen={isBonusModalOpen}
        onClose={() => setIsBonusModalOpen(false)}
        onApplyBonus={() => {
          setIsBonusApplied(true);
          scrollToSection('inventory-sandbox');
        }}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentPath={currentPath}
        onNavigateHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateP2P={() => {
          window.history.pushState({}, '', '/p2p');
          setCurrentPath('/p2p');
        }}
        onScrollToInventory={() => scrollToSection('inventory-sandbox')}
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
