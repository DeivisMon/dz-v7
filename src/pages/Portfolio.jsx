import React , { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WiperDesktop from '../components/layout/WiperDesktop'
import PortolioGallery from "../components/Portfolio";


export default function Portfolio() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
    useEffect(() => {
      const hasTouch = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
      setIsTouchDevice(hasTouch);
    }, []);


  return (
    <div>
      <NavBar />
      <PortolioGallery />
      <Footer />
      {!isTouchDevice ? (<WiperDesktop />): ""}
    </div>
  );
}
