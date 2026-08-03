import React, { useState } from 'react';
import SpotlightNavbar from './components/SpotlightNavbar';
import DnaCanvas from './components/DnaCanvas';
import LandingPage from './components/LandingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');

  // Check if current active tab is part of the Landing Page sections
  const isLandingSection = ['hero', 'problem-solution', 'how-it-works', 'features', 'trust', 'faq'].includes(activeTab);

  return (
    <div className="min-h-screen bg-black text-slate-100 relative overflow-x-hidden selection:bg-slate-700 selection:text-white">
      
      {/* 3D WebGL DNA Helix Background */}
      <DnaCanvas />

      {/* Top Spotlight Navbar */}
      <SpotlightNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Views */}
      <main>
        {isLandingSection ? (
          <LandingPage setActiveTab={setActiveTab} />
        ) : (
          <div className="relative z-10 pt-36 pb-20 px-6 max-w-4xl mx-auto text-center space-y-6">
            <div className="glass-card p-12 space-y-4">
              <h2 className="text-3xl font-bold text-silver-gradient capitalize">
                {activeTab} Module
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                The {activeTab} engine view will be launched when triggered. Click below to return to the Landing Page.
              </p>
              <button 
                onClick={() => {
                  setActiveTab('hero');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-silver text-xs"
              >
                Back to Landing Page
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
