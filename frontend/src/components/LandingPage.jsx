import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  Upload, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ChevronDown, 
  Server, 
  Brain, 
  Database,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Scroll Progress Listener for Central Glowing Timeline
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / (totalHeight || 1)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative z-10 min-h-screen text-slate-200 pt-20 pb-24 px-6 max-w-7xl mx-auto space-y-48">

      {/* ============================================================ */}
      {/* CENTRAL GLOWING TIMELINE AXIS LINE                           */}
      {/* ============================================================ */}
      <div className="absolute top-[85vh] bottom-[250px] left-1/2 -translate-x-1/2 w-[2px] pointer-events-none hidden md:block z-0">
        
        {/* Track Line */}
        <div className="w-full h-full bg-slate-800/40 border-r border-cyan-900/30"></div>
        
        {/* Active Glowing Scroll Fill */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 via-emerald-400 to-violet-400 shadow-[0_0_15px_#06b6d4] transition-all duration-75"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {/* Glowing Head Pulse Orb */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-300 border-2 border-slate-950 shadow-[0_0_20px_#06b6d4] transition-all duration-75"
          style={{ top: `${scrollProgress * 100}%` }}
        >
          <div className="w-full h-full rounded-full bg-cyan-400 animate-ping opacity-75"></div>
        </div>

      </div>


      {/* ============================================================ */}
      {/* 1. HERO SECTION (Above the Fold)                              */}
      {/* ============================================================ */}
      <section id="hero" className="pt-2 pb-16 flex flex-col justify-start items-start relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* Left Column: Headlines & Primary CTA (Positioned UP) */}
          <div className="lg:col-span-7 space-y-6 relative z-10 p-2 sm:p-5 rounded-3xl bg-black/40 backdrop-blur-md border border-slate-800/40 shadow-2xl">
            
            {/* Main Silver Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-silver-gradient">
              Secure, Local AI Training for MRI Diagnostics.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Train advanced deep learning models directly on your clinical data without compromising patient privacy or transferring files outside your hospital network.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button 
                onClick={() => setActiveTab && setActiveTab('dashboard')} 
                className="btn-silver text-base"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setActiveTab && setActiveTab('viewer')} 
                className="btn-glass text-base"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Start Local Scan</span>
              </button>
            </div>

            {/* Quick Trust Checklist */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">Zero File Transfers</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">Homomorphic Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="whitespace-nowrap">PACS / DICOM Native</span>
              </div>
            </div>

          </div>


          {/* Right Column: Visual Anchor (Positioned RIGHT) */}
          <div className="lg:col-span-5 flex justify-end w-full lg:pl-4">
            <div className="glass-card p-6 border-slate-700/80 space-y-5 relative overflow-hidden shadow-2xl w-full max-w-lg lg:ml-auto">

              
              {/* Card Top Status Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Local Node: Hospital Silo 1
                  </span>
                </div>
              </div>

              {/* MRI Processing Preview Box */}
              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2 text-center p-6">
                  <Brain className="w-16 h-16 text-cyan-400 animate-pulse" />
                  <div className="text-xs font-mono text-slate-300">
                    BRAIN_MRI_T2W_AXIAL.dcm
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    3D MONAI U-Net Segmentation Active
                  </div>
                </div>

                <div className="absolute top-1/3 left-1/3 w-20 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/60 blur-sm pointer-events-none"></div>
              </div>

              {/* Mockup Metrics Footer */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Model Confidence</div>
                  <div className="text-emerald-400 font-mono font-bold text-base">99.4% Accurate</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Cloud Data Shared</div>
                  <div className="text-cyan-400 font-mono font-bold text-base">0 Bytes</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 2. THE PROBLEM & SOLUTION SECTION                             */}
      {/* SINGLE UNIFIED CARD ON RIGHT SIDE                            */}
      {/* ============================================================ */}
      <section id="problem-solution" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left spacer so single card sits on RIGHT side of central DNA */}
          <div className="hidden md:block"></div>

          {/* Unified Section Card (RIGHT) */}
          <div className="glass-card p-8 border-slate-700/80 space-y-6 relative shadow-2xl backdrop-blur-xl bg-black/80">
            
            {/* Horizontal Branch Connector Line to Central Timeline */}
            <div className="absolute top-12 -left-12 w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-slate-800 hidden md:block">
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border border-slate-900 shadow-[0_0_10px_#06b6d4]"></div>
            </div>

            {/* Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Problem vs. Solution</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
                Overcoming Data Barriers in Clinical AI
              </h2>
            </div>

            {/* Concise 2-Line Challenge & Solution Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Challenge (2 lines max) */}
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/40 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-red-400">
                  <Lock className="w-4 h-4" />
                  <span>The Challenge: Data Privacy Deadlocks</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Strict HIPAA/GDPR rules forbid central cloud patient data pooling, isolating hospital silos and restricting dataset size.
                </p>
              </div>

              {/* Solution (2 lines max) */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span>The Solution: Local Federated Training</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  PyTorch MONAI 3D U-Net trains locally on hospital GPUs, transmitting only encrypted weight updates via Flower FedAvg.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. HOW IT WORKS SECTION                                       */}
      {/* SINGLE UNIFIED CARD ON LEFT SIDE                             */}
      {/* ============================================================ */}
      <section id="how-it-works" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Unified Section Card (LEFT) */}
          <div className="glass-card p-8 border-slate-700/80 space-y-6 relative shadow-2xl backdrop-blur-xl bg-black/80">
            
            {/* Horizontal Branch Connector Line to Central Timeline */}
            <div className="absolute top-12 -right-12 w-12 h-[2px] bg-gradient-to-l from-emerald-400 to-slate-800 hidden md:block">
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 border border-slate-900 shadow-[0_0_10px_#10b981]"></div>
            </div>

            {/* Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>3-Step Clinical Workflow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
                How FedMed Operates
              </h2>
            </div>

            {/* Concise 3 Steps (2 lines max each) */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono font-bold text-xs">01</span>
                <div>
                  <div className="font-semibold text-slate-200">Upload Data</div>
                  <p className="text-slate-400 text-xs leading-relaxed">Drop anonymized DICOM (<code className="text-cyan-400 font-mono">.dcm</code>, <code className="text-cyan-400 font-mono">.nii.gz</code>) files into the local web UI.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold text-xs">02</span>
                <div>
                  <div className="font-semibold text-slate-200">Local GPU Training</div>
                  <p className="text-slate-400 text-xs leading-relaxed">PyTorch MONAI 3D U-Net trains strictly on local hospital GPU firewalls.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-400 font-mono font-bold text-xs">03</span>
                <div>
                  <div className="font-semibold text-slate-200">Instant Diagnostics</div>
                  <p className="text-slate-400 text-xs leading-relaxed">Generates real-time 3D tumor segmentation overlays (WT, TC, ET) on screen.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right spacer */}
          <div className="hidden md:block"></div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 4. CORE FEATURES & CAPABILITIES                               */}
      {/* SINGLE UNIFIED CARD ON RIGHT SIDE                            */}
      {/* ============================================================ */}
      <section id="features" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left spacer */}
          <div className="hidden md:block"></div>

          {/* Unified Section Card (RIGHT) */}
          <div className="glass-card p-8 border-slate-700/80 space-y-6 relative shadow-2xl backdrop-blur-xl bg-black/80">
            
            {/* Horizontal Branch Connector Line to Central Timeline */}
            <div className="absolute top-12 -left-12 w-12 h-[2px] bg-gradient-to-r from-violet-400 to-slate-800 hidden md:block">
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-400 border border-slate-900 shadow-[0_0_10px_#8b5cf6]"></div>
            </div>

            {/* Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Platform Capabilities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
                Built for Clinical Security & Speed
              </h2>
            </div>

            {/* Concise Feature Bullets */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-cyan-400">
                  <Lock className="w-4 h-4" />
                  <span>Zero-Trust Security</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  TenSEAL CKKS Homomorphic Encryption & Differential Privacy guard against model inversion.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <Brain className="w-4 h-4" />
                  <span>High Model Accuracy</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Proven 73.5%+ Dice score accuracy supporting Brain, Spine, and Cardiac MRI scans.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-violet-400">
                  <Database className="w-4 h-4" />
                  <span>PACS & DICOM Native</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Seamless DICOM 3.0 & NIfTI file integration directly with hospital PACS archives.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 5. TRUST & SOCIAL PROOF                                       */}
      {/* SINGLE UNIFIED CARD ON LEFT SIDE                             */}
      {/* ============================================================ */}
      <section id="trust" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Unified Section Card (LEFT) */}
          <div className="glass-card p-8 border-slate-700/80 space-y-6 relative shadow-2xl backdrop-blur-xl bg-black/80">
            
            {/* Horizontal Branch Connector Line to Central Timeline */}
            <div className="absolute top-12 -right-12 w-12 h-[2px] bg-gradient-to-l from-emerald-400 to-slate-800 hidden md:block">
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 border border-slate-900 shadow-[0_0_10px_#10b981]"></div>
            </div>

            {/* Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clinical Trust & Compliance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
                Validated by Lead Radiologists
              </h2>
            </div>

            {/* Concise Testimonial Quote & Compliance Pills */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  "FedMed allowed our neuroradiology department to collaborate internationally on brain tumor scans without violating hospital privacy laws."
                </p>
                <div className="text-[11px] font-bold text-slate-400">
                  — Dr. Aris Thorne, MD • St. Jude Medical
                </div>
              </div>

              {/* Compliance Pills Bar */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['HIPAA Ready', 'GDPR Compliant', 'ISO 27001', 'FDA Software Standard'].map((badge, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-mono text-emerald-300"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right spacer */}
          <div className="hidden md:block"></div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 6. FINAL CALL-TO-ACTION & TECHNICAL FAQ                       */}
      {/* SINGLE UNIFIED CARD ON RIGHT SIDE                            */}
      {/* ============================================================ */}
      <section id="faq" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left spacer */}
          <div className="hidden md:block"></div>

          {/* Unified Section Card (RIGHT) */}
          <div className="glass-card p-8 border-slate-700/80 space-y-6 relative shadow-2xl backdrop-blur-xl bg-black/80">
            
            {/* Horizontal Branch Connector Line to Central Timeline */}
            <div className="absolute top-12 -left-12 w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-slate-800 hidden md:block">
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border border-slate-900 shadow-[0_0_10px_#06b6d4]"></div>
            </div>

            {/* Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Technical FAQ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Concise Accordion (2-line answers max) */}
            <div className="space-y-2 text-xs">
              {[
                {
                  q: "Hardware requirements for hospital nodes?",
                  a: "Requires NVIDIA GPU with >=8GB VRAM (RTX 3080/4090 or A100/T4) for local MONAI 3D U-Net mini-batch training."
                },
                {
                  q: "Are raw patient MRI files uploaded to cloud?",
                  a: "Never. Raw files strictly remain inside your hospital firewall. Only encrypted weight updates leave."
                },
                {
                  q: "Supported medical file formats?",
                  a: "Natively parses DICOM (.dcm) files from PACS archives and NIfTI (.nii, .nii.gz) 3D volumes."
                },
                {
                  q: "How is data privacy guaranteed?",
                  a: "Protected via TenSEAL CKKS Homomorphic Encryption tensor aggregation and Differential Privacy."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3 text-left font-semibold text-slate-200 flex items-center justify-between text-xs hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>

                  {openFaq === idx && (
                    <div className="px-3 pb-3 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
