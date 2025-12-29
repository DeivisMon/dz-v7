import { useState, useEffect } from "react";

export function useResponsive() {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isTouch: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }));

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      });
    };

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Breakpoint logic
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const isDesktop = viewport.width >= 1024;
  const isLandscape = viewport.width > viewport.height;
  const isPortrait = viewport.height > viewport.width;
  const isShortScreen = viewport.height < 600; 

  return {
    ...viewport,
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait,
    isShortScreen,
    // Combined states for Mobile and Tablet
    isMobilePortrait: isMobile && isPortrait,
    isMobileLandscape: isMobile && isLandscape,
    isTabletPortrait: isTablet && isPortrait,
    isTabletLandscape: isTablet && isLandscape
  };
}