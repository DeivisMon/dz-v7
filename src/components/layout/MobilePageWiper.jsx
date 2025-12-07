import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function MobileWiper({ trigger }) {
  const wipeRef = useRef(null);

  useLayoutEffect(() => {
    if (!trigger) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.set(wipeRef.current, { scaleY: 1 });

      tl.to(wipeRef.current, {
        scaleY: 0,
        delay: 0.20,
        duration: 0.75,
        ease: "expo.out",
      });
    }, wipeRef);

    return () => ctx.revert();
  }, [trigger]);

  return (
    <div
      ref={wipeRef}
      className="fixed inset-0 bg-black z-[999999] origin-top pointer-events-none"
    />
  );
}
