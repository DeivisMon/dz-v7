import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Wiper() {
  const wipeRef = useRef(null);
  const rows = 16;
  const cols = 16;

  useEffect(() => {
    const tiles = gsap.utils.toArray(wipeRef.current.children);
    gsap.set(wipeRef.current, { autoAlpha: 1 });

    // Animate each tile
    const tl = gsap.timeline();
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
        // create a wave pattern
        grid: [rows, cols],
        from: "top", // can be "edges", "random", "end", etc.
        amount: 1.25, // total stagger duration
      },
    });
  }, []);

  return (
    <div
      ref={wipeRef}
      className="fixed inset-0 z-50 grid pointer-events-none opacity-100"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            transformOrigin: "center bottom",
          }}
        />
      ))}
    </div>
  );
}
