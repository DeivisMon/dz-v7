import React , { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import ContactFrom from '../components/utils/ContactForm'
import Footer from '../components/Footer'
import WiperContactDesktop from '../components/Wiper Contact Desktop'
import WiperContactMobile from '../components/Wiper Contact Mobile'

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
      {/* <Footer /> */}
      {/* {isTouchDevice ? (<WiperContactMobile />): (<WiperContactDesktop />)} */}
      <WiperContactMobile />
    </div>
  )
}
