import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { ServiceRequest } from './components/ServiceRequest';
import { Contact } from './components/Contact';
import { Profile } from './components/Profile';
import { ServicesList } from './components/ServicesList';
import { Onboarding } from './components/Onboarding';
import { AutoPartsStore } from './components/AutoPartsStore';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.ONBOARDING);

  // Check for existing profile on mount
  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setCurrentView(ViewState.HOME);
    } else {
      setCurrentView(ViewState.ONBOARDING);
    }
  }, []);

  // Scroll to top whenever the view changes for a polished feel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleOnboardingComplete = () => {
    setCurrentView(ViewState.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case ViewState.HOME:
        return <Home setView={setCurrentView} />;
      case ViewState.REQUEST:
        return <ServiceRequest />;
      case ViewState.SERVICES:
        return <ServicesList />;
      case ViewState.PROFILE:
        return <Profile />;
      case ViewState.STORE:
        return <AutoPartsStore />;
      case ViewState.CONTACT:
        return <Contact />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <main className="w-full max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl relative">
        {/* The key prop forces React to remount the div, triggering the CSS animation */}
        <div key={currentView} className="animate-page-enter">
          {renderView()}
        </div>
      </main>
      <Navbar currentView={currentView} setView={setCurrentView} />
    </div>
  );
}

export default App;