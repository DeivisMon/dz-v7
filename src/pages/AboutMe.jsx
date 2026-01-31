import React, { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WiperDesktop from "../components/layout/WiperDesktop";

export default function AboutMe () {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);
  return (
    <>
      <NavBar />

      <div className="text-[50px] w-full h-[100dvh] flex justify-center items-center text-white">
        <h1>Coming Soon</h1>
      </div>
      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
};
