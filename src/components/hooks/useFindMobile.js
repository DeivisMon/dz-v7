import { useState, useEffect } from "react";

export function useFindMobile() {
  const [state, setState] = useState(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return {
      isTouch,
      isPortrait: window.matchMedia("(orientation: portrait)").matches,
      isMobileLayout: isTouch && window.innerWidth <= 1368,
    };
  });

  useEffect(() => {
    const update = () => {
      const isTouch =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setState({
        isTouch,
        isPortrait: window.matchMedia("(orientation: portrait)").matches,
        isMobileLayout: isTouch && window.innerWidth <= 1368,
      });
    };

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return state;
}

