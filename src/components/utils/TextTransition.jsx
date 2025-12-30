import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function TextTransition() {
  const location = useLocation();
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  const ROUTE_LABELS = {
    "/": "Index",
    "/portfolio": "Darbai",
    "/kontaktai": "Kontaktai",
  };

  const getLabel = (pathname) => {
    return ROUTE_LABELS[pathname] ?? "";
  };

  const getFontSize = (path) => {
    switch (path) {
      case "/kontaktai":
      case "/portfolio":
        return "text-[0.75rem] md:text-[2rem] xl:text-[3rem]";
      default:
        return "text-[1rem] md:text-[2rem] xl:text-[3rem]";
    }
  };

  useEffect(() => {
    gsap.fromTo(
      text1Ref.current,
      {
        scale: 6,
        y: -10,
        opacity: 0,
      },
      {
        duration: 2.25,
        delay: 0.2,
        ease: "expo.inOut",
        keyframes: {
          scale: [6, 5, 4, 3, 5],
          y: [-10, -5, 0, 0, 0, 0, 0, 0, 0, 0],
          opacity: [0, 1, 1, 0.5, 0],
        },
      }
    );

    gsap.fromTo(
      text2Ref.current,
      {
        scale: 6,
        y: 10,
        opacity: 0,
      },
      {
        duration: 2.25,
        delay: 0.275,
        ease: "expo.inOut",
        keyframes: {
          scale: [6, 5, 4, 3, 5],
          y: [10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
          opacity: [0, 1, 1, 0.5, 0],
        },
      }
    );
  }, [location.pathname]);

  return (
    <div>
      <p
        ref={text1Ref}
        className={`fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getFontSize(
          location.pathname
        )} uppercase font-bold text-shadow-lg text-white mix-blend-difference`}
      >
        {getLabel(location.pathname)}
      </p>
      <p
        ref={text2Ref}
        className={`fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getFontSize(
          location.pathname
        )} uppercase font-bold text-shadow-lg text-white mix-blend-difference blur-[0.5px]`}
      >
        {getLabel(location.pathname)}
      </p>
    </div>
  );
}
