import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function PortfolioWipers() {
  const [activeWiper, setActiveWiper] = useState("curtain");
  
  const wipers = [
    { id: "curtain", name: "Curtain", desc: "Elegant split" },
    { id: "shutter", name: "Shutter", desc: "Camera blade" },
    { id: "iris", name: "Iris", desc: "Aperture open" },
    { id: "diagonal", name: "Diagonal", desc: "Sleek sweep" },
    { id: "reveal", name: "Reveal", desc: "Simple fade" },
    { id: "bars", name: "Bars", desc: "Staggered strips" },
    { id: "clock", name: "Clock", desc: "Radial sweep" },
    { id: "corners", name: "Corners", desc: "From edges" },
    { id: "venetian", name: "Venetian", desc: "Blind slats" },
    { id: "zoom", name: "Zoom", desc: "Scale out" },
    { id: "slide", name: "Slide", desc: "Push left" },
    { id: "fade", name: "Fade", desc: "Opacity only" },
  ];
  
  const WiperComponent = {
    curtain: CurtainWiper,
    shutter: ShutterWiper,
    iris: IrisWiper,
    diagonal: DiagonalWiper,
    reveal: RevealWiper,
    bars: BarsWiper,
    clock: ClockWiper,
    corners: CornersWiper,
    venetian: VenetianWiper,
    zoom: ZoomWiper,
    slide: SlideWiper,
    fade: FadeWiper,
  }[activeWiper];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Photography Portfolio Wipers
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Click any transition to preview • All optimized for performance
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {wipers.map(({ id, name, desc }) => (
            <button
              key={id}
              onClick={() => setActiveWiper(id)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-left ${
                activeWiper === id 
                  ? "bg-white text-slate-900 shadow-lg scale-105" 
                  : "bg-slate-800 hover:bg-slate-700 hover:scale-102"
              }`}
            >
              <div className="font-bold">{name}</div>
              <div className={`text-xs ${activeWiper === id ? "text-slate-600" : "text-slate-400"}`}>
                {desc}
              </div>
            </button>
          ))}
        </div>

        <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" 
            alt="Mountain landscape"
            className="w-full h-full object-cover"
          />
          <WiperComponent key={activeWiper} />
        </div>
        
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 mb-1">Current Effect</div>
            <div className="font-semibold text-lg">{wipers.find(w => w.id === activeWiper)?.name}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 mb-1">Performance</div>
            <div className="font-semibold text-lg text-green-400">Optimized ⚡</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 mb-1">Use Case</div>
            <div className="font-semibold text-lg">Page Transitions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. Curtain Wiper - Elegant vertical split
function CurtainWiper() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline();
    tl.set([leftRef.current, rightRef.current], { scaleX: 1 })
      .to([leftRef.current, rightRef.current], {
        scaleX: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });
  }, []);
  
  return (
    <>
      <div ref={leftRef} className="absolute inset-0 bg-black origin-right w-1/2" />
      <div ref={rightRef} className="absolute inset-0 bg-black origin-left w-1/2 left-1/2" />
    </>
  );
}

// 2. Shutter Wiper - Camera shutter effect
function ShutterWiper() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const blades = gsap.utils.toArray(containerRef.current.children);
    const tl = gsap.timeline();
    
    tl.set(blades, { scaleY: 1 })
      .to(blades, {
        scaleY: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.05,
      });
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 flex">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-black origin-top"
        />
      ))}
    </div>
  );
}

// 3. Iris Wiper - Circular aperture opening
function IrisWiper() {
  const irisRef = useRef(null);
  
  useEffect(() => {
    gsap.to(irisRef.current, {
      scale: 0,
      duration: 0.9,
      ease: "power2.inOut",
    });
  }, []);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div 
        ref={irisRef}
        className="bg-black rounded-full"
        style={{ width: "200%", height: "200%", transformOrigin: "center" }}
      />
    </div>
  );
}

// 4. Diagonal Wiper - Sleek diagonal sweep
function DiagonalWiper() {
  const wipeRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(wipeRef.current, 
      { x: "-100%", y: "-100%" },
      { x: "100%", y: "100%", duration: 1, ease: "power2.inOut" }
    );
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        ref={wipeRef}
        className="absolute bg-black"
        style={{ 
          width: "141.42%", 
          height: "141.42%",
          transform: "rotate(45deg)",
          transformOrigin: "center"
        }}
      />
    </div>
  );
}

// 5. Reveal Wiper - Top to bottom reveal
function RevealWiper() {
  const revealRef = useRef(null);
  
  useEffect(() => {
    gsap.to(revealRef.current, {
      scaleY: 0,
      duration: 0.8,
      ease: "power3.inOut",
    });
  }, []);
  
  return (
    <div 
      ref={revealRef}
      className="absolute inset-0 bg-black origin-top"
    />
  );
}

// 6. Bars Wiper - Horizontal bars with stagger
function BarsWiper() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const bars = gsap.utils.toArray(containerRef.current.children);
    gsap.to(bars, {
      scaleX: 0,
      duration: 0.5,
      ease: "power2.inOut",
      stagger: {
        amount: 0.4,
        from: "center",
      },
    });
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-black origin-left"
        />
      ))}
    </div>
  );
}

// 7. Clock Wiper - Radial sweep like clock hand
function ClockWiper() {
  const clockRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(clockRef.current,
      { rotation: 0 },
      { rotation: 360, duration: 1, ease: "power2.inOut" }
    );
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        ref={clockRef}
        className="absolute bg-black origin-center"
        style={{
          width: "200%",
          height: "200%",
          left: "50%",
          top: "50%",
          clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)",
          transform: "translate(-50%, -50%)"
        }}
      />
    </div>
  );
}

// 8. Corners Wiper - Reveal from all four corners
function CornersWiper() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const corners = gsap.utils.toArray(containerRef.current.children);
    gsap.to(corners, {
      scale: 0,
      duration: 0.7,
      ease: "power2.inOut",
      stagger: 0.08,
    });
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 grid grid-cols-2 grid-rows-2">
      <div className="bg-black origin-top-left" />
      <div className="bg-black origin-top-right" />
      <div className="bg-black origin-bottom-left" />
      <div className="bg-black origin-bottom-right" />
    </div>
  );
}

// 9. Venetian Wiper - Venetian blind effect
function VenetianWiper() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const slats = gsap.utils.toArray(containerRef.current.children);
    gsap.to(slats, {
      scaleY: 0,
      duration: 0.4,
      ease: "power2.inOut",
      stagger: {
        amount: 0.5,
        from: "start",
      },
    });
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col gap-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-black origin-center"
        />
      ))}
    </div>
  );
}

// 10. Zoom Wiper - Scale out from center
function ZoomWiper() {
  const zoomRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(zoomRef.current,
      { scale: 1 },
      { scale: 0, duration: 0.7, ease: "back.in(1.4)" }
    );
  }, []);
  
  return (
    <div 
      ref={zoomRef}
      className="absolute inset-0 bg-black"
      style={{ transformOrigin: "center" }}
    />
  );
}

// 11. Slide Wiper - Simple slide left
function SlideWiper() {
  const slideRef = useRef(null);
  
  useEffect(() => {
    gsap.to(slideRef.current, {
      x: "-100%",
      duration: 0.8,
      ease: "power3.inOut",
    });
  }, []);
  
  return (
    <div 
      ref={slideRef}
      className="absolute inset-0 bg-black"
    />
  );
}

// 12. Fade Wiper - Classic opacity fade
function FadeWiper() {
  const fadeRef = useRef(null);
  
  useEffect(() => {
    gsap.to(fadeRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, []);
  
  return (
    <div 
      ref={fadeRef}
      className="absolute inset-0 bg-black"
    />
  );
}