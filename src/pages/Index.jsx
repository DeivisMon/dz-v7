import React, { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Carousel from "../components/Carousel";
import Footer from "../components/layout/Footer";
import WiperIndex from "../components/Wiper Index";
import WiperDesktop from "../components/layout/WiperDesktop";
import Slider from "../components/Slider";

export default function Index() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <div>
      <NavBar />
      <Slider />
      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </div>
  );
}
