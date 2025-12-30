import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDeviceType } from "../hooks/useDeviceType";

export default function ScrollTop({ lenis }) {
  const [visible, setVisible] = useState(false);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ progress }) => {
      setVisible(progress > 0.9);
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const toTop = () => {
    lenis?.scrollTo(0, {
      duration: 2.2,
      easing: (t) => 1 - Math.pow(1 - t, 5),
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className={`fixed ${isMobile ? "bottom-4" : "bottom-16"}  right-4 z-[10] mix-blend-difference animate-pulse cursor-trigger rotate-180`} data-cursor-type="up"
        onClick={toTop}>
          <Motion.a
            initial={{ opacity: 0.75 }}
            animate={{ y: [0, 3, 0], opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="scroll"
          >
            <Motion.svg
              animate={{ y: [-200, 0] }}
              transition={{
                duration: 0.5,
                type: "spring",
                ease: [0.32, 0.72, 0, 1],
              }}
              width={50}
              height={50}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <Motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    type: "spring",
                    // ease: "easeInOut",
                  }}
                  d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Motion.path>
                <path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                  	duration: 5,
                  	repeat: Infinity,
                  	// repeatType: "reverse",
                  	ease: "easeInOut",
                  }}
                  d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
                  stroke="rgba(154, 48, 175, 0.233)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <Motion.path
                  initial={{ opacity: 0.75 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    y: [0, 3, 0],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  d="M12 6V14"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Motion.path>
                <Motion.path
                  initial={{ opacity: 0.5 }}
                  animate={{ y: [0, 3, 0], opacity: 1 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  d="M15 11L12 14L9 11"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Motion.path>
              </g>
            </Motion.svg>
          </Motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}
