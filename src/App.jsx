import React from "react";
import { Routes, Route, useLocation } from "react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransitions from "./components/utils/PageTransitions";
import Loader from "./components/Loader";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import CustomCursor from "./components/utils/CustomCursor";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <AnimatePresence mode="wait">
          <PageTransitions key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </PageTransitions>
          <CustomCursor />
        </AnimatePresence>
      )}
    </>
  );
}
