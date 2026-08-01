import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DnaCanvas from './components/DnaCanvas';
import LandingPage from './components/LandingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-black text-slate-100 relative overflow-x-hidden selection:bg-slate-700 selection:text-white">
      
      {/* 3D WebGL DNA Helix Background */}
      <DnaCanvas />

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page Views */}
      <main>
        {activeTab === 'landing' && (
          <LandingPage setActiveTab={setActiveTab} />
        )}

        {activeTab !== 'landing' && (
          <div className="relative z-10 pt-36 pb-20 px-6 max-w-4xl mx-auto text-center space-y-6">
            <div className="glass-card p-12 space-y-4">
              <h2 className="text-3xl font-bold text-silver-gradient capitalize">
                {activeTab} Page
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                The {activeTab} view will be built in the next step. Click below to return to the 3D Landing Page overview.
              </p>
              <button 
                onClick={() => setActiveTab('landing')}
                className="btn-silver text-xs"
              >
                Back to 3D Overview
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
