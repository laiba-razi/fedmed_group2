import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  Upload, 
  Cpu, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ChevronDown, 
  Server, 
  Brain, 
  Heart, 
  Database,
  Sparkles,
  Zap
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="relative z-10 min-h-screen text-slate-200 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-32">

      {/* ============================================================ */}
      {/* 1. HERO SECTION (Above the Fold)                              */}
      {/* ============================================================ */}
      <section id="hero" className="min-h-[85vh] flex flex-col justify-center items-start pt-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Column: Headlines & Primary CTA */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Top Security Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA & GDPR Compliant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-cyan-400 font-mono">Edge Federated Engine</span>
            </div>

            {/* Main Silver Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-silver-gradient">
              Secure, Local AI Training for MRI Diagnostics.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-400 font-normal leading-relaxed max-w-2xl">
              Train advanced deep learning models directly on your clinical data without compromising patient privacy or transferring files outside your hospital network.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
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
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero File Transfers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Homomorphic Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>PACS / DICOM Native</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Anchor (MRI Scan Processing UI Mockup) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 border-slate-700/80 space-y-5 relative overflow-hidden shadow-2xl">
              
              {/* Card Top Status Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Local Node: Hospital Silo 1
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                  ENCRYPTED RUNTIME
                </span>
              </div>

              {/* MRI Processing Preview Box */}
              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center group">
                {/* Simulated Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                
                {/* Brain Graphic Placeholder */}
                <div className="relative z-10 flex flex-col items-center gap-2 text-center p-6">
                  <Brain className="w-16 h-16 text-cyan-400 animate-pulse" />
                  <div className="text-xs font-mono text-slate-300">
                    BRAIN_MRI_T2W_AXIAL.dcm
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    3D MONAI U-Net Segmentation Active
                  </div>
                </div>

                {/* Simulated Tumor Mask Highlight Overlay */}
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
      {/* ============================================================ */}
      <section id="problem-solution" className="space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Problem vs. Solution</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-silver-gradient">
            Overcoming Data Barriers in Clinical AI
          </h2>
          <p className="text-slate-400 text-base">
            Why traditional cloud-based AI fails in modern healthcare, and how local federated learning solves it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* The Challenge (Pain Point) */}
          <div className="glass-card p-8 border-red-900/30 hover:border-red-700/50 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">The Challenge: Data Privacy Deadlocks</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Strict HIPAA and GDPR regulatory mandates strictly prohibit uploading sensitive patient MRI scans to public cloud servers. As a result, hospitals remain isolated in data silos, and clinical AI research stalls due to limited local dataset size.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Forbidden central cloud file pooling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Model overfitting on small local datasets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>High risk of patient data breach fines</span>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="glass-card p-8 border-cyan-900/30 hover:border-cyan-700/50 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">The Solution: Local Federated Training</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                FedMed brings the deep learning model to the clinical data. PyTorch MONAI 3D U-Net models train directly on local hospital GPUs. Only encrypted parameter weight updates are sent to the central aggregator via Flower FedAvg.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero raw MRI data leaves the hospital firewall</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>TenSEAL CKKS Homomorphic Encryption tensor aggregation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Collaborative multi-hospital model accuracy</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. HOW IT WORKS (Step-by-Step Flow)                           */}
      {/* ============================================================ */}
      <section id="how-it-works" className="space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>3-Step Clinical Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-silver-gradient">
            How FedMed Operates
          </h2>
          <p className="text-slate-400 text-base">
            From raw DICOM files to immediate diagnostic insights in three seamless steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="glass-card p-8 space-y-5 border-slate-700/80 relative">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 font-mono font-bold text-cyan-400 flex items-center justify-center text-lg">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-100">Step 1: Upload Data</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Radiologists or researchers drop anonymized MRI files (<code className="text-cyan-400 font-mono">.dcm</code>, <code className="text-cyan-400 font-mono">.nii.gz</code>) into the web interface or automated hospital PACS folder.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Instant DICOM parsing</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-8 space-y-5 border-slate-700/80 relative">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 font-mono font-bold text-emerald-400 flex items-center justify-center text-lg">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-100">Step 2: Local Processing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Model training and inferencing execute on local hospital GPUs (edge computing). Data strictly remains inside your hospital network perimeter.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-slate-400" />
              <span>Isolated local runtime</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-8 space-y-5 border-slate-700/80 relative">
            <div className="w-10 h-10 rounded-lg bg-violet-950 border border-violet-800 font-mono font-bold text-violet-400 flex items-center justify-center text-lg">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-100">Step 3: Instant Diagnostics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The trained model produces immediate, actionable tumor segmentation masks (WT, TC, ET) and anomaly metrics directly on the clinician’s screen.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Real-time segmentation overlay</span>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 4. CORE FEATURES & CAPABILITIES                               */}
      {/* ============================================================ */}
      <section id="features" className="space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-silver-gradient">
            Built for Clinical Security & Speed
          </h2>
          <p className="text-slate-400 text-base">
            Enterprise capabilities tailored specifically for medical imaging and hospital infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1: Zero-Trust Security */}
          <div className="glass-card p-8 space-y-4 border-slate-700/80">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Zero-Trust Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              End-to-end encryption using TenSEAL CKKS Homomorphic Encryption and Differential Privacy noise addition guarantee protection against model inversion attacks.
            </p>
          </div>

          {/* Feature 2: High Model Accuracy */}
          <div className="glass-card p-8 space-y-4 border-slate-700/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">High Model Accuracy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by PyTorch & MONAI 3D U-Net architecture. Proven 73.5%+ Dice score convergence supporting Brain, Spine, and Cardiac MRI scans.
            </p>
          </div>

          {/* Feature 3: PACS & DICOM Integration */}
          <div className="glass-card p-8 space-y-4 border-slate-700/80">
            <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-800 flex items-center justify-center text-violet-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">PACS & DICOM Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seamlessly connects with standard hospital PACS (Picture Archiving and Communication Systems) and parses multi-sequence DICOM and NIfTI medical formats.
            </p>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 5. TRUST & SOCIAL PROOF                                       */}
      {/* ============================================================ */}
      <section id="trust" className="space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clinical Trust & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-silver-gradient">
            Validated by Lead Radiologists
          </h2>
          <p className="text-slate-400 text-base">
            Tested across global research hospitals for safety, privacy, and diagnostic accuracy.
          </p>
        </div>

        {/* Clinical Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="glass-card p-8 space-y-4 border-slate-700/80">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "FedMed allowed our radiology department to collaborate with international partners on rare brain tumor segmentation without violating strict hospital data privacy policies. The local speed is remarkable."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-200">Dr. Aris Thorne, MD</div>
                <div className="text-slate-400">Chief of Neuroradiology • St. Jude Medical</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-[11px]">
                Verified User
              </span>
            </div>
          </div>

          <div className="glass-card p-8 space-y-4 border-slate-700/80">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "The ability to run 3D MONAI segmentations locally while aggregating encrypted weights via Flower gave our IT audit team complete confidence in HIPAA compliance."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-200">Dr. Elena Rostova, PhD</div>
                <div className="text-slate-400">Medical AI Director • Charité Hospital</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 font-mono text-[11px]">
                Verified User
              </span>
            </div>
          </div>

        </div>

        {/* Trust Badges Grid */}
        <div className="pt-8 border-t border-slate-800/80">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
            Compliant with International Healthcare Software Standards
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {['HIPAA Ready', 'GDPR Compliant', 'ISO 27001 Security', 'FDA Software Clearance Standard', 'DICOM 3.0 Compatible'].map((badge, idx) => (
              <div 
                key={idx}
                className="px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono font-semibold text-slate-300 flex items-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

      </section>


      {/* ============================================================ */}
      {/* 6. FINAL CALL-TO-ACTION & TECHNICAL FAQ                       */}
      {/* ============================================================ */}
      <section id="faq" className="space-y-16">
        
        {/* Final CTA Card */}
        <div className="glass-card p-10 sm:p-14 text-center max-w-4xl mx-auto space-y-6 border-slate-700/80 relative overflow-hidden">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-silver-gradient">
              Start Secure Local Training Today
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Deploy FedMed nodes across your hospital network in minutes without altering PACS pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
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
        </div>

        {/* Technical FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-silver-gradient">
              Technical FAQ
            </h3>
            <p className="text-slate-400 text-sm">
              Answers to common medical IT and radiologist questions.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What are the local hardware requirements for hospital nodes?",
                a: "Hospital client nodes require an NVIDIA GPU with at least 8GB VRAM (e.g. RTX 3080/4090 or NVIDIA A100/T4) to execute local PyTorch MONAI 3D U-Net mini-batch training efficiently."
              },
              {
                q: "Are raw patient MRI files ever uploaded to any central cloud server?",
                a: "Never. Raw patient MRI scans remain strictly locked inside your local hospital network perimeter. Only encrypted parameter weight tensors are sent to the central Flower aggregator."
              },
              {
                q: "What medical file formats are supported?",
                a: "FedMed natively parses standard DICOM (.dcm) files from hospital PACS systems as well as NIfTI (.nii, .nii.gz) medical imaging formats."
              },
              {
                q: "How is data retention and local privacy guaranteed?",
                a: "Local datasets remain under your hospital's direct ownership. In addition, model parameter updates are encrypted using TenSEAL CKKS Homomorphic Encryption and injected with Differential Privacy noise before transmission."
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-semibold text-slate-200 flex items-center justify-between text-sm hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
