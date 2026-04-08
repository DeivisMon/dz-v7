import { useState, useEffect } from "react";
import PageSlideInTransitions from "../components/layout/PageSlideInTransitions";
import Footer from "../components/layout/Footer";
import WiperDesktop from "../components/layout/WiperDesktop";
import About from "../components/AboutMeComponent";

export default function AboutMe() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <>
      <PageSlideInTransitions>
        <About />
      </PageSlideInTransitions>

      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
}
