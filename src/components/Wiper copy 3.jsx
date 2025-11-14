import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function Wiper() {
  const wipeRef = useRef(null);
  const tilesRef = useRef([]);
  
  const getGrid = () => {
    if (window.innerWidth < 640) return { rows: 4, cols: 4 };
    if (window.innerWidth < 1024) return { rows: 10, cols: 10 };
    return { rows: 16, cols: 16 };
  };
  
  const [{ rows, cols }, setGrid] = useState(getGrid);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setGrid(getGrid()), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const tiles = tilesRef.current;
    
    // Use will-change and GPU acceleration hints
    gsap.set(tiles, { 
      scale: 1, 
      rotateX: 0, 
      rotateY: 0,
      force3D: true // Force GPU acceleration
    });
    gsap.set(wipeRef.current, { autoAlpha: 1 });

    const tl = gsap.timeline();
    
    // Simplified keyframes - fewer transforms = better performance
    tl.to(tiles, {
      keyframes: [
        { scale: 0.8, rotateX: 180, duration: 0.2 },
        { scale: 0.5, rotateX: 0, rotateY: -180, duration: 0.3 },
        { scale: 0, rotateX: 180, duration: 0.3 },
      ],
      ease: "power2.inOut",
      stagger: {
        grid: [rows, cols],
        from: "top",
        amount: 1,
      },
    });

    return () => tl.kill();
  }, [rows, cols]);

  return (
    <div
      ref={wipeRef}
      className="fixed inset-0 z-50 grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        perspective: "1000px",
        willChange: "transform", // Hint browser for optimization
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          ref={el => tilesRef.current[i] = el}
          className="bg-black"
          style={{
            transformOrigin: "center",
            transformStyle: "preserve-3d",
            willChange: "transform", // Optimize each tile
            backfaceVisibility: "hidden", // Reduce rendering complexity
          }}
        />
      ))}
    </div>
  );
}