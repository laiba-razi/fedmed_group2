import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "../lib/utils";
import { Dna, ShieldCheck, ArrowUpRight } from "lucide-react";

export function SpotlightNavbar({
  items = [
    { label: "Overview", id: "hero" },
    { label: "Problem & Solution", id: "problem-solution" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "Trust", id: "trust" },
    { label: "FAQ", id: "faq" },
  ],
  activeTab = "hero",
  setActiveTab,
  className,
}) {
  const navRef = useRef(null);
  
  // Find active index based on activeTab
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeTab)
  );

  const [hoverX, setHoverX] = useState(null);

  // Refs for light positions
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  // Handle MouseMove for Spotlight
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  // Handle Ambience Light for Active Item
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item, index) => {
    if (setActiveTab) {
      setActiveTab(item.id);
    }
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-black/60 border-b border-slate-800/80", className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left Side: Clean Brand Logo */}
        <div 
          onClick={() => {
            if (setActiveTab) setActiveTab('hero');
            const el = document.getElementById('hero');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg group-hover:border-slate-400 transition-colors">
            <Dna className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight text-silver-gradient">FedMed</span>
        </div>

        {/* Center Spotlight Navbar */}
        <div className="relative flex justify-center">
          <nav
            ref={navRef}
            className={cn(
              "relative h-11 rounded-full transition-all duration-300 overflow-hidden",
              "bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md px-2"
            )}
            style={{
              "--spotlight-color": "rgba(255, 255, 255, 0.18)",
              "--ambience-color": "rgba(6, 182, 212, 0.9)", // Cyan glow ambience for FedMed
            }}
          >
            {/* Nav Items */}
            <ul className="relative flex items-center h-full gap-1 z-[10]">
              {items.map((item, idx) => (
                <li key={idx} className="relative h-full flex items-center justify-center">
                  <button
                    data-index={idx}
                    onClick={() => handleItemClick(item, idx)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
                      activeIndex === idx
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* 1. Moving Spotlight (Mouse Follower) */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
              style={{
                opacity: hoverX !== null ? 1 : 0,
                background: `
                  radial-gradient(
                    120px circle at var(--spotlight-x) 100%, 
                    var(--spotlight-color) 0%, 
                    transparent 60%
                  )
                `,
              }}
            />

            {/* 2. Active Ambience Indicator */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
              style={{
                background: `
                  radial-gradient(
                    65px circle at var(--ambience-x) 0%, 
                    var(--ambience-color) 0%, 
                    transparent 100%
                  )
                `,
              }}
            />
          </nav>
        </div>

        {/* Right CTA & Badge */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>HIPAA / GDPR Verified</span>
          </div>

          <button
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="btn-silver"
          >
            <span>Launch Engine</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}

export default SpotlightNavbar;
