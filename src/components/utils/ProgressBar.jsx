import { useEffect, useRef, useState } from "react";

const ScrollProgressBar = ({
  lenis,
  height = 6,
  backgroundColor = "bg-white/20",
  progressColor = "bg-white",
  position = "bottom",
  showPercentage = true,
  idleDelay = 200,
}) => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const idleTimeout = useRef(null);

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
    <div className={`fixed ${positionClass} left-0 w-full flex flex-col items-center mix-blend-difference`}>
      {/* Percentage */}
      {showPercentage && (
        <div
          className="pointer-events-none -mb-3 relative z-50"
          style={{ transform: `translateY(${active ? 0 : 20}px)`, transition: 'transform 0.75s cubic-bezier(0.22, -0.5, 0.36, 1)' }}
        >
          <span className="text-white text-xl font-medium ">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div className={`relative w-full ${backgroundColor}`} style={{ height, transform: `translateY(${active ? 0 : 10}px)`, transition: 'opacity 0.8s ease, transform 0.5s cubic-bezier(0.22, 1, -0.36, 1)' }}>
        {/* Progress bar */}
        <div
          className={`${progressColor} absolute bottom-0 left-1/2`}
          style={{
            height,
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
