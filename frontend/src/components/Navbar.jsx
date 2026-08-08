import React from 'react';
import { Dna, ShieldCheck, Activity, Layers, Lock, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-black/60 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg group-hover:border-slate-400 transition-colors">
            <Dna className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-silver-gradient">FedMed</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Cross-Silo AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Privacy-Preserving Healthcare Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'landing'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            Live Dashboard
          </button>

          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'viewer'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4 text-violet-400" />
            MRI Viewer
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            Privacy Audit
          </button>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-silver"
          >
            <span>Launch Engine</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </nav>
  );
}
