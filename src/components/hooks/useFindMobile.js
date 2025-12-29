import { useState, useEffect } from "react";

export function useFindMobile() {
  const [state, setState] = useState(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return {
      isTouch,
      isPortrait: isTouch && window.matchMedia("(orientation: portrait)").matches,
      isLandscape: isTouch && window.matchMedia("(orientation: landscape)").matches,
      isMobileLayout: isTouch && window.matchMedia("(orientation: portrait)").matches && window.matchMedia("(orientation: landscape)").matches && window.innerWidth <= 1368,
    };
  });

  useEffect(() => {
    const update = () => {
      const isTouch =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setState({
        isTouch,
        isPortrait: isTouch && window.matchMedia("(orientation: portrait)").matches,
        isLandscape: isTouch && window.matchMedia("(orientation: landscape)").matches,
        isMobileLayout: isTouch && window.matchMedia("(orientation: portrait)").matches && window.matchMedia("(orientation: landscape)").matches && window.innerWidth <= 1368,
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

