import React, { useEffect, useRef, useMemo } from "react";
import { sliderData } from "./sliderData";

// Refactored Slider (Mode A - Portrait = fullscreen single-slide horizontal swipe)
// - No manual DOM createElement
// - Uses duplicated data (3 copies) to create an infinite feel
// - Portrait: 1 fullscreen image visible at a time
// - Desktop/Landscape: many cards visible (keeps responsive behavior)
// - Parallax and scale preserved

export default function SliderRefactor() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  // Refs for animation state (keeps stable between frames)
  const currentX = useRef(0);
  const targetX = useRef(0);
  const lastX = useRef(0);
  const isDragging = useRef(false);
  const startPointerX = useRef(0);
  const slideWidth = useRef(0);
  const rafId = useRef(0);
  const lastTimestamp = useRef(Date.now());
  const isPortrait = useRef(false);
  const velocity = useRef(0);

  const COPIES = 3; // number of repeated sequences
  const LERP = 0.08;
  const SCROLL_SPEED = 1.5;
  const MAX_VELOCITY = 200;

  const data = useMemo(() => {
    // create 3 copies so middle copy is "visible" and we can loop seamlessly
    const arr = [];
    for (let i = 0; i < COPIES; i++) arr.push(...sliderData);
    return arr;
  }, []);

  useEffect(() => {
    function updateOrientation() {
      // Portrait on phones: single fullscreen slide
      isPortrait.current = window.matchMedia("(orientation: portrait)").matches;
      // compute slide width depending on mode
      slideWidth.current = isPortrait.current ? window.innerWidth : 510;

      // set track initial offset to center copy
      const singleSeqWidth = sliderData.length * slideWidth.current;
      currentX.current = -singleSeqWidth; // start at middle copy
      targetX.current = currentX.current;

      // update css variables for layout (optional)
      if (rootRef.current) {
        rootRef.current.style.setProperty("--slide-width", `${slideWidth.current}px`);
        rootRef.current.style.setProperty("--is-portrait", isPortrait.current ? "1" : "0");
      }

      // also resize images (we use CSS but ensure layout)
      updateTrackTransform();
    }

    function handleResize() {
      updateOrientation();
    }

    updateOrientation();
    window.addEventListener("resize", handleResize);
    window.matchMedia("(orientation: portrait)").addEventListener("change", handleResize);

    // start loop
    lastTimestamp.current = performance.now();
    rafId.current = requestAnimationFrame(loop);

    // event listeners
    const root = rootRef.current;
    if (root) {
      root.addEventListener("wheel", handleWheel, { passive: false });
      root.addEventListener("touchstart", handlePointerDown, { passive: true });
      root.addEventListener("mousedown", handlePointerDown);
      root.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      root.addEventListener("touchend", handlePointerUp);
      root.addEventListener("mouseleave", handlePointerUp);
    }

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", handleResize);
      try {
        window.matchMedia("(orientation: portrait)").removeEventListener("change", handleResize);
      } catch (e) { console.error(e);}
      if (root) {
        root.removeEventListener("wheel", handleWheel);
        root.removeEventListener("touchstart", handlePointerDown);
        root.removeEventListener("mousedown", handlePointerDown);
        root.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerUp);
        root.removeEventListener("touchend", handlePointerUp);
        root.removeEventListener("mouseleave", handlePointerUp);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleWheel(e) {
    // vertical wheel moves horizontally for this slider
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // let pointer horizontal wheel pass
    e.preventDefault();
    targetX.current -= Math.max(Math.min(e.deltaY * SCROLL_SPEED, MAX_VELOCITY), -MAX_VELOCITY);
  }

  function handlePointerDown(e) {
    isDragging.current = true;
    startPointerX.current = getClientX(e);
    lastX.current = targetX.current;
    velocity.current = 0;
  }

  function handlePointerMove(e) {
    if (!isDragging.current) return;
    e.preventDefault();
    const clientX = getClientX(e);
    const delta = clientX - startPointerX.current;
    // portrait mode -> horizontal swipe (we invert so swiping left goes to next)
    targetX.current = lastX.current + delta;
    const now = performance.now();
    const dt = Math.max(16, now - lastTimestamp.current);
    velocity.current = (delta) / dt * 1000; // px per second approx
  }

  function handlePointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    // apply a flick based on velocity
    const v = Math.max(Math.min(velocity.current, MAX_VELOCITY), -MAX_VELOCITY);
    targetX.current += v * 0.2; // fling multiplier
  }

  function getClientX(e) {
    if (e.touches && e.touches[0]) return e.touches[0].clientX;
    return e.clientX ?? 0;
  }

  function loop() {
    // simple lerp
    currentX.current += (targetX.current - currentX.current) * LERP;

    // infinite wrap logic
    const seqWidth = sliderData.length * slideWidth.current;
    // if we've moved too far to the right (beyond first copy) shift left
    if (currentX.current > -seqWidth / 2) {
      currentX.current -= seqWidth;
      targetX.current -= seqWidth;
    }
    // if too far left beyond last copy shift right
    if (currentX.current < -seqWidth * 1.5) {
      currentX.current += seqWidth;
      targetX.current += seqWidth;
    }

    updateTrackTransform();

    lastTimestamp.current = performance.now();
    rafId.current = requestAnimationFrame(loop);
  }

  function updateTrackTransform() {
    if (!trackRef.current) return;
    // set translate
    trackRef.current.style.transform = `translate3d(${currentX.current}px,0,0)`;

    // parallax: compute positions without DOM reads
    const vwCenter = window.innerWidth / 2;
    const totalSlides = data.length;
    for (let i = 0; i < totalSlides; i++) {
      const slide = trackRef.current.children[i];
      if (!slide) continue;
      const centerX = i * slideWidth.current + currentX.current + slideWidth.current / 2;
      const distance = centerX - vwCenter;
      const factor = isPortrait.current ? 0.12 : 0.25; // milder on portrait
      const parallax = -distance * factor;

      const img = slide.querySelector("img");
      if (img) {
        // scale a bit more on portrait so it fills the screen
        const scale = isPortrait.current ? 1.6 : 2.05;
        img.style.transform = `translateX(${parallax}px) scale(${scale})`;
      }
    }
  }

  // rendering
  return (
    <div ref={rootRef} className="rf-slider">
      <div ref={trackRef} className="rf-slide-track">
        {data.map((item, i) => (
          <div
            className={`rf-slide ${isPortrait.current ? "portrait" : "landscape"}`}
            key={i}
            style={{ width: `${isPortrait.current ? window.innerWidth : 510}px` }}
          >
            <div className="rf-slide-image">
              <img src={item.img} alt={item.title} draggable={false} />
            </div>
            <div className="rf-slide-overlay">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Minimal helper CSS included below as a comment. Copy to your CSS file. */}

      {/*
     
      */}
    </div>
  );
}
