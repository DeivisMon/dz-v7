import React, { useRef, useEffect } from 'react';
import gsap from "gsap";

// The Wiper component - needs to be positioned fixed or absolute
export default function Wiper({ onComplete }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const bars = gsap.utils.toArray(containerRef.current.children);
    gsap.to(bars, {
      scaleX: 0,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.inOut",
      stagger: {
        amount: 0.4,
        from: "center",
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }, [onComplete]);
  
  return (
    <div
  ref={containerRef}
  className="absolute z-99999 pointer-events-none flex flex-col"
  style={{
    left: 0,
    top: 0,
    width: "100vw",
    height: `${window.innerHeight}px`,   // critical
  }}
>

      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-black origin-left"
        />
      ))}
    </div>
  );
}