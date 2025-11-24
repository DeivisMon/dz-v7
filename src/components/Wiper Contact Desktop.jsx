import React, { useRef, useEffect } from 'react';
import gsap from "gsap";

// The Wiper component - needs to be positioned fixed or absolute
export default function WiperContactDesktop() {
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
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div ref={leftRef} className="absolute inset-0 bg-black origin-right w-1/2" />
      <div ref={rightRef} className="absolute inset-0 bg-black origin-left w-1/2 left-1/2" />
    </div>
  );
}