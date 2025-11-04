import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

// Store in module scope - resets on page refresh
// let hasWiperPlayed = false;

export default function Wiper() {
  const wipeRef = useRef(null);
  const [shouldShow, setShouldShow] = useState(true);
  const rows = 16;
  const cols = 16;

  useEffect(() => {
    // Check if wiper has already played using module variable
    // if (hasWiperPlayed) {
    //   setShouldShow(false);
    //   return;
    // }

    const tiles = gsap.utils.toArray(wipeRef.current.children);
    gsap.set(tiles, { scale: 1, rotateX: 0, rotateY: 0 });
    gsap.set(wipeRef.current, { autoAlpha: 1 });

    // Animate each tile
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark as played using module variable
        // hasWiperPlayed = true;
        setShouldShow(false);
      }
    });

    tl.to(tiles, {
      keyframes: [
        { scale: 0.8, rotateX: 180, duration: 0.2 },
        { scale: 1, rotateX: 0, duration: 0.3 },
        { scale: 0.5, rotateY: -180, duration: 0.3 },
        { scale: 0.2, rotateX: 180, duration: 0.2 },
        { scale: 0, rotateX: 0, duration: 0.4 },
      ],
      ease: "power2.inOut",
      stagger: {
        grid: [rows, cols],
        from: "top",
        amount: 1.25,
      },
    });

    return () => tl.kill();
  }, [rows, cols]);

  if (!shouldShow) return null;

  return (
    <div
      ref={wipeRef}
      className="fixed inset-0 z-50 grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        perspective: "1000px",
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
}