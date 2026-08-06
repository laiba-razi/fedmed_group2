import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Eye, 
  Brain, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Maximize2,
  Lock,
  Activity
} from 'lucide-react';

export default function MriViewer() {
  const [sliceIndex, setSliceIndex] = useState(78);
  const [modality, setModality] = useState('T2f'); // T1c, T1n, T2f, T2w
  const [masks, setMasks] = useState({
    WT: true, // Whole Tumor (Cyan)
    TC: true, // Tumor Core (Violet)
    ET: true, // Enhancing Tumor (Emerald)
  });

  const [sampleData, setSampleData] = useState({
    patient_id: "BraTS2023_00142",
    has_tumor: true,
    tumor_volume_cc: 34.2,
    centralized_dice: 0.741,
    federated_dice: 0.735
  });

  const toggleMask = (key) => {
    setMasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch live slice data from FastAPI backend
  useEffect(() => {
    const fetchSliceData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/mri-sample?slice_idx=${sliceIndex}&modality=${modality}`);
        if (res.ok) {
          const data = await res.json();
          setSampleData(data);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchSliceData();
  }, [sliceIndex, modality]);

  return (
    <div className="relative z-10 min-h-screen text-slate-200 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-800/60 text-xs font-mono text-violet-400 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>3D BRAIN TUMOR SEGMENTATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-silver-gradient">
            3D MRI Tumor Viewer & Model Evaluator
          </h1>
          <p className="text-slate-400 text-sm">
            Interactive multi-sequence BraTS 2023 brain scan segmentation comparing Centralized Baseline vs FedMed Federated Model.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>Patient ID: {sampleData.patient_id || 'BraTS2023_00142'}</span>
        </div>
      </div>

      {/* Main Grid: Controls + Dual Viewer Panels */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Controls Card */}
        <div className="lg:col-span-4 glass-card p-6 border-slate-700/80 space-y-6">
          
          {/* Modality Selector */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
              MRI Sequence Modality
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'T2f', label: 'T2-FLAIR' },
                { id: 'T1c', label: 'T1-CE' },
                { id: 'T1n', label: 'T1-Native' },
                { id: 'T2w', label: 'T2-Weight' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setModality(item.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                    modality === item.id
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-700 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>

          {/* Slice Depth Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase">Axial Slice Depth</span>
              <span className="text-cyan-400 font-bold">{sliceIndex} / 155</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="155" 
              value={sliceIndex} 
              onChange={(e) => setSliceIndex(Number(e.target.value))} 
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tumor Mask Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
              Segmentation Mask Overlays
            </label>
            <div className="space-y-2">
              
              <button
                onClick={() => toggleMask('WT')}
                className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  masks.WT ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-200 shadow-[0_0_8px_#06b6d4]"></span>
                  <span>Whole Tumor (WT)</span>
                </div>
                <span className="font-mono text-[11px]">{masks.WT ? 'VISIBLE' : 'HIDDEN'}</span>
              </button>

              <button
                onClick={() => toggleMask('TC')}
                className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  masks.TC ? 'bg-violet-950/60 border-violet-800 text-violet-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-400 border border-violet-200 shadow-[0_0_8px_#8b5cf6]"></span>
                  <span>Tumor Core (TC)</span>
                </div>
                <span className="font-mono text-[11px]">{masks.TC ? 'VISIBLE' : 'HIDDEN'}</span>
              </button>

              <button
                onClick={() => toggleMask('ET')}
                className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  masks.ET ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-200 shadow-[0_0_8px_#10b981]"></span>
                  <span>Enhancing Tumor (ET)</span>
                </div>
                <span className="font-mono text-[11px]">{masks.ET ? 'VISIBLE' : 'HIDDEN'}</span>
              </button>

            </div>
          </div>

        </div>

        {/* Right Column: Side-by-Side Model Comparison Viewer */}
        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
          
          {/* Panel 1: Centralized Baseline Model */}
          <div className="glass-card p-5 border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300">Centralized Baseline</span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Dice: {(sampleData.centralized_dice * 100).toFixed(1)}%
              </span>
            </div>

            {/* MRI Viewer Screen Box */}
            <div className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:14px_14px] opacity-30"></div>
              
              {/* Brain Slice Graphic */}
              <div className="relative z-10 text-center space-y-2">
                <Brain className="w-24 h-24 text-slate-600 mx-auto" />
                <div className="text-xs font-mono text-slate-400">
                  Slice {sliceIndex} [{modality}]
                </div>
              </div>

              {/* Tumor Mask Highlights */}
              {masks.WT && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-28 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400/80 blur-xs"></div>}
              {masks.TC && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-16 h-14 rounded-full bg-violet-500/30 border-2 border-violet-400/90 blur-xs"></div>}
              {masks.ET && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-emerald-500/40 border-2 border-emerald-400/90 blur-xs"></div>}
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>Cloud Transfer: <strong className="text-red-400">Required</strong></span>
              <span>Latency: 140ms</span>
            </div>
          </div>

          {/* Panel 2: FedMed Encrypted Federated Model */}
          <div className="glass-card p-5 border-cyan-900/40 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-bold text-cyan-300">FedMed Federated Engine</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Dice: {(sampleData.federated_dice * 100).toFixed(1)}%
              </span>
            </div>

            {/* MRI Viewer Screen Box */}
            <div className="relative aspect-square rounded-xl bg-slate-950 border border-cyan-900/60 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:14px_14px] opacity-40"></div>
              
              {/* Brain Slice Graphic */}
              <div className="relative z-10 text-center space-y-2">
                <Brain className="w-24 h-24 text-cyan-400 mx-auto animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="text-xs font-mono text-cyan-300">
                  Slice {sliceIndex} [{modality}]
                </div>
              </div>

              {/* Tumor Mask Highlights */}
              {masks.WT && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-28 h-24 rounded-full bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_15px_#06b6d4] blur-xs"></div>}
              {masks.TC && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-16 h-14 rounded-full bg-violet-500/40 border-2 border-violet-400 shadow-[0_0_15px_#8b5cf6] blur-xs"></div>}
              {masks.ET && sampleData.has_tumor && <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-emerald-500/50 border-2 border-emerald-400 shadow-[0_0_15px_#10b981] blur-xs"></div>}
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>Cloud Transfer: <strong className="text-emerald-400">0 Bytes</strong></span>
              <span>Latency: 12ms (Local)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
