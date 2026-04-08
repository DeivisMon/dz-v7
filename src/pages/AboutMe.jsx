import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import WiperDesktop from "../components/layout/WiperDesktop";
import About from "../components/AboutMeComponent";

export default function AboutMe() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  const containerVariants = {
    hidden: { y: 65, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.75,
        duration: 0.5,
      },
    },
    exit: { y: -15, transition: { duration: 1.25 } },
  };
  const containerVariants1 = {
    hidden: { scale: 0.95, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.7,
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Motion.div variants={containerVariants1} initial="hidden" animate="show">
        <About />
      </Motion.div>
      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
}
