import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import PageTransitions from "./components/utils/PageTransitions";
import Loader from "./components/Loader";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import CustomCursor from "./components/utils/CustomCursor";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if device has touch capability
    const checkTouchDevice = () => {
      const hasTouch = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
      setIsTouchDevice(hasTouch);
    };
    
    checkTouchDevice();
  }, []);

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <AnimatePresence mode="wait">
          {!isTouchDevice ? (
            <PageTransitions key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Index />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PageTransitions>
          ) : (
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          )}
          {!isTouchDevice && <CustomCursor />}
        </AnimatePresence>
      )}
    </>
  );
}