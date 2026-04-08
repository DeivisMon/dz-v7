import React, { useState, useEffect } from "react";
import PageSlideInTransitions from "../components/layout/PageSlideInTransitions";
import Footer from "../components/layout/Footer";
import WiperDesktop from "../components/layout/WiperDesktop";
import PortolioGallery from "../components/Portfolio";

export default function Portfolio() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <>
      <PageSlideInTransitions>
        <PortolioGallery />
      </PageSlideInTransitions>

      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
}
