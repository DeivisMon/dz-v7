import React , { useState, useEffect } from 'react'
import NavBar from '../components/layout/NavBar'
import ContactFrom from '../components/utils/ContactForm'
import Footer from '../components/layout/Footer'
import WiperContactDesktop from '../components/Wiper Contact Desktop'
import WiperDesktop from '../components/layout/WiperDesktop'

export default function Contact() {
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
      <ContactFrom />
      <Footer />
      {!isTouchDevice ? (<WiperDesktop />): ""}
    </div>
  )
}
