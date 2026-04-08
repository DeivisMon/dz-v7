import { useState, useEffect } from "react";
import PageSlideInTransitions from "../components/layout/PageSlideInTransitions";
import ContactSocialsAndForm from "../components/utils/ContactSocialsAndForm";
import Footer from "../components/layout/Footer";
import WiperContactDesktop from "../components/Wiper Contact Desktop";
import WiperDesktop from "../components/layout/WiperDesktop";

export default function Contact() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <>
      <PageSlideInTransitions>
        <ContactSocialsAndForm />
      </PageSlideInTransitions>

      <Footer />
      {!isTouchDevice ? <WiperDesktop /> : ""}
    </>
  );
}
