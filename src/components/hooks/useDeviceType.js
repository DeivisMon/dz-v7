import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState({
    isVerticalMobile: false,
    isHorizontalMobile: false,
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isPortrait = window.innerHeight > window.innerWidth && isTouch;
      const isSmallScreen = window.innerWidth < 768 && isTouch;
      const isVerticalMobile = isPortrait && isSmallScreen  && isTouch;
      const isHorizontalMobile = window.innerHeight < 500 && !isVerticalMobile && isTouch;
      
      setDeviceType({
        isVerticalMobile,
        isHorizontalMobile,
        isMobile: isVerticalMobile || isHorizontalMobile,
        isDesktop: !isVerticalMobile && !isHorizontalMobile,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceType;
};