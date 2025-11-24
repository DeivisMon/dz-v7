import React, { useRef, useEffect } from 'react';
import gsap from "gsap";

export default function WiperContactMobile() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.set([topRef.current, bottomRef.current], { scaleY: 1 })
      .to([topRef.current, bottomRef.current], {
        delay: 0.25,
        scaleY: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div ref={topRef} className="absolute inset-0 bg-black origin-bottom h-1/2" />
      <div ref={bottomRef} className="absolute inset-0 bg-black origin-top h-1/2 top-1/2" />
    </div>
  );
}