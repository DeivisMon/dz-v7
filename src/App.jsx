import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import PageTransitions from "./components/layout/PageTransitions";
import MobileWiper from "./components/layout/WiperMobile";
import Loader from "./components/Loader";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import AboutMe from "./pages/AboutMe";
import Contact from "./pages/Contact";
import CustomCursor from "./components/utils/CustomCursor";
import NavBar from "./components/layout/NavBar";


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [wipeTrigger, setWipeTrigger] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    setIsTouchDevice(hasTouch);
  }, []);

  useEffect(() => {
    setWipeTrigger((v) => v + 1);
  }, [location.pathname]);

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      {isLoaded && (
        <>
          {isTouchDevice && <MobileWiper trigger={wipeTrigger} />}

          {!isTouchDevice ? (
            <>
            <NavBar />
            <AnimatePresence mode="wait">
              <PageTransitions key={location.pathname}>
                <Routes location={location}>
                  <Route path="/" element={<Index />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/kontaktai" element={<Contact />} />
                  <Route path="/apie-mane" element={<AboutMe />} />
                </Routes>
              </PageTransitions>
            </AnimatePresence>
            </>
          ) : (
            <>
            <NavBar />
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/kontaktai" element={<Contact />} />
              <Route path="/apie-mane" element={<AboutMe />} />
            </Routes>
            </>
          )}

          {!isTouchDevice && <CustomCursor />}
        </>
      )}
    </>
  );
}