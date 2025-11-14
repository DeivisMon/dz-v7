import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function Wiper() {
  const wipeRef = useRef(null);
  const overlayRef = useRef(null);

  const getGrid = () => {
    if (window.innerWidth < 640) return { rows: 4, cols: 4 };
    if (window.innerWidth < 1024) return { rows: 10, cols: 10 };
    return { rows: 16, cols: 16 };
  };

  const [{ rows, cols }, setGrid] = useState(getGrid);
  const [tilesMeta, setTilesMeta] = useState([]);

  // calculate pixel-perfect tile sizes & positions
  const recalcTiles = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const tileW = Math.floor(W / cols);
    const tileH = Math.floor(H / rows);

    const meta = Array.from({ length: rows * cols }).map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // last column/row take the remaining pixels to avoid gaps
      const width = col === cols - 1 ? W - tileW * (cols - 1) : tileW;
      const height = row === rows - 1 ? H - tileH * (rows - 1) : tileH;
      const left = col * tileW;
      const top = row * tileH;

      return { left, top, width, height, row, col };
    });

    setTilesMeta(meta);
  };

  useEffect(() => {
    const onResize = () => {
      setGrid(getGrid());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // recalc when grid changes or on mount
  useEffect(() => {
    recalcTiles();
    const onResize = () => recalcTiles();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols]);

  // animation
  useEffect(() => {
    if (!wipeRef.current || tilesMeta.length === 0) return;

    const tiles = gsap.utils.toArray(wipeRef.current.children);
    gsap.set(tiles, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      // tiny translateZ to help compositing (optional)
      translateZ: "0.1px",
    });

    // ensure overlay remains until animation actually starts
    if (overlayRef.current) overlayRef.current.style.opacity = "1";

    const tl = gsap.timeline({
      onStart: () => {
        // remove overlay immediately when animation starts
        if (overlayRef.current) {
          // quick fade out to avoid abrupt cut (reduce duration to 0 for instant)
          gsap.to(overlayRef.current, { duration: 0.04, opacity: 0, onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = "none";
          }});
        }
      },
    });

    tl.to(tiles, {
      keyframes: [
        { scale: 0.8, rotateX: 180, duration: 0.2 },
        { scale: 1, rotateX: 0, duration: 0.3 },
        { scale: 0.5, rotateY: -180, duration: 0.3 },
        { scale: 0.2, rotateX: 180, duration: 0.2 },
        { scale: 0, rotateX: 0, duration: 0.4 }
      ],
      ease: "power2.inOut",
      stagger: {
        grid: [rows, cols],
        from: "top",
        amount: 1.25
      }
    });

    return () => tl.kill();
  // tilesMeta intentionally in deps to ensure sizes applied prior to anim
  }, [rows, cols, tilesMeta]);

  // render pixel-positioned tiles and overlay
  return (
    <>
      {/* black overlay that hides any underlying page paint until animation starts */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 99999,
          pointerEvents: "none",
          opacity: 1,
          transition: "opacity 40ms linear",
        }}
      />

      <div
        ref={wipeRef}
        className="pointer-events-none"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 99998,
          perspective: "1000px",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        {tilesMeta.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: t.left + "px",
              top: t.top + "px",
              width: t.width + "px",
              height: t.height + "px",
              background: "#000",
              transformOrigin: "center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              // tiny translateZ for compositing (shouldn't create new gaps)
              transform: "translateZ(0.1px)",
            }}
          />
        ))}
      </div>
    </>
  );
}
