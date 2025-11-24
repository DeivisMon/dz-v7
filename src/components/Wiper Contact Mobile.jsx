import React, { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";

export default function WiperContactMobile() {
  const wipeRef = useRef(null);

  // Measure viewport BEFORE paint → prevents flash
  const getViewportHeight = () => {
    const vv = window.visualViewport;
    return vv?.height || window.innerHeight;
  };

  // Set correct size BEFORE the first frame renders
  useLayoutEffect(() => {
    const height = getViewportHeight();

    Object.assign(wipeRef.current.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "100vw",
      height: `${height}px`,
      background: "#000",
      zIndex: "99999",
      transformOrigin: "top",
      pointerEvents: "none",
      willChange: "transform",
    });
  }, []);

  // Animation AFTER paint
  useEffect(() => {
    // animation identical to your portfolio logic
    gsap.set(wipeRef.current, { scaleY: 1 });

    gsap.to(wipeRef.current, {
      delay: 0.25,
      scaleY: 0,
      duration: 0.8,
      ease: "power3.inOut",
    });
  }, []);

  return <div ref={wipeRef} />;
}
