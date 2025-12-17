import {motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ScrollProgressBar({
  lenis,
  height = 4,
  backgroundColor = "bg-white/20",
  progressColor = "bg-white",
  position = "bottom",
  showPercentage = true,
  idleDelay = 1200,
}) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const idleTimeout = useRef(null);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ progress }) => {
      setProgress(progress);
      setActive(true);

      clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        setActive(false);
      }, idleDelay);
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
      clearTimeout(idleTimeout.current);
    };
  }, [lenis, idleDelay]);

  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div className={`fixed ${positionClass} left-0 w-full z-50`}>
      {/* Track */}
      <div
        className={`relative w-full ${backgroundColor}`}
        style={{ height }}
      >
        {/* Center-expanding bar */}
        <Motion.div
          className={`absolute top-0 left-1/2 ${progressColor}`}
          style={{
            height,
            width: "100%",          // 👈 REQUIRED
            transformOrigin: "50% 50%",
          }}
          animate={{
            scaleX: progress,
            x: "-50%",
            opacity: active || progress > 0 ? 1 : 0,
          }}
          transition={{
            scaleX: { duration: 0.15, ease: "linear" },
            opacity: { duration: 0.3 },
          }}
        />
      </div>

      {/* Percentage */}
      {showPercentage && (
        <Motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-8 mix-blend-difference pointer-events-none"
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 10,
          }}
          transition={{ duration: 0.25 }}
        >
          <span className="text-white text-lg font-medium">
            {Math.round(progress * 100)}%
          </span>
        </Motion.div>
      )}
    </div>
  );
}
