import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function Wiper() {
  const wipeRef = useRef(null);

  const getGrid = () => {
    if (window.innerWidth < 640) return { rows: 4, cols: 4 };       // mobile
    if (window.innerWidth < 1024) return { rows: 10, cols: 10 };   // tablet
    return { rows: 16, cols: 16 };                                 // desktop
  };

  const [{ rows, cols }, setGrid] = useState(getGrid);

  useEffect(() => {
    const onResize = () => setGrid(getGrid());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const tiles = gsap.utils.toArray(wipeRef.current.children);
    gsap.set(tiles, { scale: 1, rotateX: 0, rotateY: 0 });
    gsap.set(wipeRef.current, { autoAlpha: 1 });

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
        grid: [rows, cols],
        from: "top",
        amount: 1.25,
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
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="bg-black" style={{ transformOrigin: "center", transformStyle: "preserve-3d" }} />
      ))}
    </div>
  );
}
