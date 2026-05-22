import { useEffect, useRef, useState } from "react";
import { useResponsive } from "../hooks/useResopnsive";

const ScrollProgressBar = ({
  lenis,
  backgroundColor = "bg-white/20",
  progressColor = "bg-white",
  position = "bottom",
  showPercentage = true,
  idleDelay = 200,
}) => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const idleTimeout = useRef(null);
  const responsive = useResponsive();

  useEffect(() => {
    if (!lenis) return;

    const updateProgress = () => {
      const scroll = lenis.scroll || 0;
      const limit = lenis.limit || 0;
      const p = limit > 0 ? scroll / limit : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      setActive(true);

      clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setActive(false), idleDelay);
    };

    lenis.on("scroll", updateProgress);
    updateProgress();

    return () => {
      lenis.off("scroll", updateProgress);
      clearTimeout(idleTimeout.current);
    };
  }, [lenis, idleDelay]);

  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div className={`fixed ${positionClass} left-0 w-full flex flex-col items-center mix-blend-difference z-[101]`}>
      {/* Percentage */}
      {showPercentage && (
        <div
          className="pointer-events-none -mb-1 relative "
          style={{ transform: `translateY(${active ? 0 : 25}px)`, transition: 'transform 0.5s cubic-bezier(0.22, -0.5, 0.36, 1)' }}
        >
          <span className="text-white text-xl font-medium ">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div className={`relative w-full ${backgroundColor} ${responsive.isMobile || responsive.isTablet ? "h-1" : "h-[6px]"}`} style={{ transform: `translateY(${active ? 0 : 10}px)`, transition: 'opacity 0.8s ease, transform 0.5s cubic-bezier(0.22, 1, -0.36, 1)' }}>
        {/* Progress bar */}
        <div
          className={`${progressColor} ${responsive.isMobile || responsive.isTablet ? "h-1" : "h-[4px]"} absolute bottom-0 left-1/2`}
          style={{
            width: "100%",
            transformOrigin: "50% 50%",
            transform: `translateX(-50%) scaleX(${progress})`,
            opacity: active || progress > 0 ? 1 : 0,
            transition: "transform 0.15s linear, opacity 0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;
