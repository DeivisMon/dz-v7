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
      const isPortrait = window.innerHeight > window.innerWidth;
      const isSmallScreen = window.innerWidth < 768;
      const isVerticalMobile = isPortrait && isSmallScreen;
      const isHorizontalMobile = window.innerHeight < 500 && !isVerticalMobile;
      
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