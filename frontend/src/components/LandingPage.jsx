import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Activity, 
  Lock, 
  Server, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="relative z-10 min-h-screen text-slate-200 pt-28 pb-20 px-6 max-w-7xl mx-auto">

      {/* ============================================================ */}
      {/* 1. HERO SECTION (Left Aligned for DNA Slope Space on Right)  */}
      {/* ============================================================ */}
      <section className="min-h-[85vh] flex flex-col justify-center items-start relative">
        <div className="max-w-2xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>PPML & Healthcare AI Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-400 font-mono">BraTS 2023 3D U-Net</span>
          </div>

          {/* Silver Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-silver-gradient">
            Collaborative Brain Tumor AI Without Sharing Raw Patient Scans.
          </h1>

          {/* Silver Subtitle */}
          <p className="text-lg text-slate-400 font-normal leading-relaxed">
            <strong className="text-slate-200">FedMed</strong> deploys decentralized PyTorch MONAI 3D U-Net nodes across isolated hospital silos. Models train locally on private MRI data, transmitting only encrypted weight updates to a central <span className="text-cyan-400 font-mono">Flower (flwr)</span> aggregator.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="btn-silver text-base"
            >
              <span>Explore Federated Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab('privacy')} 
              className="btn-glass text-base"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Security Audit</span>
            </button>
          </div>

          {/* Compliance Tagline */}
          <div className="flex items-center gap-6 pt-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% HIPAA & GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero Raw Data Exfiltration</span>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 2. KEY STATS BANNER (Floating Glass Cards Grid)               */}
      {/* ============================================================ */}
      <section className="py-12 my-12 border-y border-slate-800/80 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="glass-card p-6 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-silver-gradient font-mono">1,251</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">3D MRI Patient Scans</div>
            <div className="text-[11px] text-slate-500">BraTS 2023 Dataset</div>
          </div>

          <div className="glass-card p-6 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">3</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Hospital Node Silos</div>
            <div className="text-[11px] text-slate-500">St. Jude • Mayo Clinic • Charité</div>
          </div>

          <div className="glass-card p-6 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">0 Bytes</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Raw Data Transmitted</div>
            <div className="text-[11px] text-slate-500">Complete Patient Privacy</div>
          </div>

          <div className="glass-card p-6 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-violet-400 font-mono">73.5%</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Best Dice Accuracy</div>
            <div className="text-[11px] text-slate-500">Converged Global Model</div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. PROBLEM VS SOLUTION (Alternating Left / Right Cards Grid)   */}
      {/* ============================================================ */}
      <section className="py-20 space-y-16">

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-silver-gradient">
            Overcoming Data Privacy Bottlenecks in Medical AI
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Training robust deep learning models for brain tumor segmentation requires multi-institutional data. FedMed replaces centralized pooling with decentralized model orchestration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* Left Card: The Problem */}
          <div className="glass-card p-8 border-red-900/30 hover:border-red-700/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">The Problem: Regulatory Data Silos</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Strict data privacy mandates (<span className="text-red-300 font-mono">HIPAA / GDPR</span>) forbid medical institutions from uploading patient MRI scans to centralized cloud servers. Rare disease research stagnates because single hospitals lack sufficient data volume to train high-precision 3D U-Net models.
              </p>
            </div>

            <ul className="space-y-2.5 pt-6 text-xs text-slate-400 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>Forbidden central data pooling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>Small local dataset over-fitting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>Model inversion security vulnerabilities</span>
              </li>
            </ul>
          </div>

          {/* Right Card: The FedMed Solution */}
          <div className="glass-card p-8 border-cyan-900/30 hover:border-cyan-700/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">The Solution: FedMed Federated Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                FedMed brings the model to the data instead of data to the model. Flower orchestrates client nodes at 3 global hospitals. Models train on local GPUs, sending only encrypted parameter tensors to the central aggregator using <span className="text-cyan-400 font-mono">FedAvg</span>.
              </p>
            </div>

            <ul className="space-y-2.5 pt-6 text-xs text-slate-400 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Deterministic 3-hospital dataset partitioning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>TenSEAL CKKS Homomorphic Encryption hooks</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Node Resilience (survives offline hospital dropouts)</span>
              </li>
            </ul>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 4. HOSPITAL SILOS ARCHITECTURE (Right-Aligned Layout)         */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="grid md:grid-cols-12 gap-8 items-center">

          {/* Left Column: Visual Flow */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="glass-card p-6 space-y-4 border-slate-700/80">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-slate-200 text-sm">Central Aggregation Server (Flower gRPC)</span>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                  FedMedStrategy
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Hospital 1</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">St. Jude Hospital</div>
                  <div className="font-mono text-cyan-400">417 Scans (1/3)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Hospital 2</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Mayo Clinic</div>
                  <div className="font-mono text-cyan-400">417 Scans (1/3)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Hospital 3</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Charité Hospital</div>
                  <div className="font-mono text-cyan-400">417 Scans (1/3)</div>
                </div>

              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Aggregated Output: checkpoints/global_model_round_N.pth</span>
                <span className="text-emerald-400">Live Metric Stream</span>
              </div>
            </div>

          </div>

          {/* Right Column: Text Content */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Decentralized Cross-Silo Topology</span>
            </div>

            <h2 className="text-3xl font-bold text-silver-gradient">
              Orchestrating 3 Global Medical Nodes
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Each hospital executes local training on its assigned 1/3 partition of the 1,251 BraTS MRI dataset. The Flower server collects local model weights, computes sample-weighted averages, and broadcasts updated parameters for the next round.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Deterministic 42-seed patient partitioning (Zero Overlap)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>AdamW optimizer & MONAI 3D DiceCELoss</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Live progress streaming to <code className="text-cyan-400">fl_metrics.json</code></span>
              </li>
            </ul>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 5. TECH STACK (Silver Pills Grid)                            */}
      {/* ============================================================ */}
      <section className="py-16 text-center space-y-8">
        <h3 className="text-xl font-semibold text-slate-300 uppercase tracking-widest text-xs">
          Built With Enterprise Healthcare AI Technologies
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {['PyTorch 2.11', 'MONAI 1.6 3D UNet', 'Flower (flwr) 1.32', 'TenSEAL CKKS HE', 'Opacus Differential Privacy', 'BraTS 2023 Dataset', 'Recharts Analytics', 'React & Vite'].map((tech, idx) => (
            <span 
              key={idx}
              className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-md hover:border-slate-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>


      {/* ============================================================ */}
      {/* 6. FINAL CALL-TO-ACTION (Centered Glass Banner)               */}
      {/* ============================================================ */}
      <section className="py-16">
        <div className="glass-card p-10 sm:p-14 text-center max-w-4xl mx-auto space-y-6 border-slate-700/80 relative overflow-hidden">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-silver-gradient">
              Ready to Inspect the Federated Training Engine?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Monitor live convergence graphs, inspect 3D MONAI tumor segmentation masks, or review privacy audit logs.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="btn-silver text-base"
            >
              <span>Launch Live Engine Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
