import { useState, useRef } from "react";
import { useResponsive } from "../hooks/useResopnsive";
import ContactForm from "./ContactForm";
import ContactSocials from "./ContactSocials";
import ContactChangeSideButton from "./ContactChangeSideButton";

export default function ContactSocialsAndForm() {
  const [showSocials, setShowSocials] = useState(true);
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const responsive = useResponsive();


  const handleMouseMove = (e) => {
    if (!buttonRef.current || responsive.isTouch) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const maxDistance = 150;
    const maxMove = 75;

    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      const moveX = distanceX * strength * (maxMove / maxDistance);
      const moveY = distanceY * strength * (maxMove / maxDistance);
      setButtonTransform({ x: moveX, y: moveY });
    } else {
      setButtonTransform({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setButtonTransform({ x: 0, y: 0 });
  };

  const isVerticalLayout =
    responsive.isMobilePortrait ||
    (responsive.isShortScreen && responsive.isMobile);

  const getImageTransform = () => {
    if (showSocials) {
      return "translate(0, 0)";
    }
    if (isVerticalLayout) {
      return "translateY(-100%)";
    }

    return "translateX(100%)";
  };

  const toggleView = () => {
    setShowSocials(!showSocials);
  };


  return (
    <div className="relative w-[100vw] mt-16 h-[calc(100dvh-64px)] overflow-hidden shadow-xl bg-bckg">
      {/* Content Container - positioned absolutely for proper 50/50 split */}
      <div
        className={`absolute inset-0 flex ${isVerticalLayout ? "flex-col" : "flex-row"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Form Section (LEFT) with Flip Card for Success Message */}
        <div
          className={`absolute ${isVerticalLayout ? "top-1/2 left-0 w-full h-1/2" : "left-0 top-0 w-1/2 h-full"} flex justify-center px-2 z-10 sm:px-8 lg:px-24`}
        >
          <ContactForm />
        </div>

        {/* Socials Section (RIGHT) */}
        <div
          className={`absolute ${isVerticalLayout ? "top-0 left-0 w-full h-1/2" : "right-0 top-0 w-1/2 h-full"} flex justify-center px-2 z-10 px-0 sm:px-12 lg:px-18`}
        >
          <ContactSocials />
        </div>
      </div>

      {/* Sliding Image Overlay - Controlled by ContactChangeSideButton */}
      <div
        className={`absolute transition-transform duration-500 ease-out z-20 ${isVerticalLayout ? "h-1/2 w-full" : "w-1/2 h-full"} bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/contact.jpg')`,
          transform: getImageTransform(),
          top: isVerticalLayout ? "50%" : 0,
          left: 0,
        }}
      />

      {/* ChangeContactsSideButton */}
      <div
        className={`absolute z-30 ${
          isVerticalLayout
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <ContactChangeSideButton
          onClick={toggleView}
          buttonRef={buttonRef}
          buttonTransform={buttonTransform}
          currentText={showSocials ? "Parašyk" : "Susisiek"}
          nextText={showSocials ? "Susisiek" : "Parašyk"}
        />
      </div>
    </div>
  );
}
