import React, { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WiperDesktop from "../components/layout/WiperDesktop";
import About from "../components/AboutMeComponent";

export default function AboutMe () {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);
  return (
    <>
      <NavBar />
      <About />
      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
};
