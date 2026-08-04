import React, { useState } from 'react';
import SpotlightNavbar from './components/SpotlightNavbar';
import DnaCanvas from './components/DnaCanvas';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MriViewer from './components/MriViewer';
import PrivacyAudit from './components/PrivacyAudit';

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
        {isLandingSection && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'viewer' && <MriViewer />}
        {activeTab === 'privacy' && <PrivacyAudit />}
      </main>

    </div>
  );
}
