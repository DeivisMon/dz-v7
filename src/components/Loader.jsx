import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const base = import.meta.env.BASE_URL;

const images = {
  img1: `${base}images/loader/loader-01.webp`,
  img2: `${base}images/loader/loader-02.webp`,
  img3: `${base}images/loader/loader-03.webp`,
  img4: `${base}images/loader/loader-04.webp`,
  img5: `${base}images/loader/loader-05.webp`,
  img6: `${base}images/loader/loader-06.webp`,
  img7: `${base}images/loader/loader-07.webp`,
  img8: `${base}images/loader/loader-08.webp`,
  img9: `${base}images/loader/loader-09.webp`,
  img10: `${base}images/loader/loader-10.webp`,
  img11: `${base}images/loader/loader-11.webp`,
  img12: `${base}images/loader/loader-12.webp`,
  img13: `${base}images/loader/loader-13.webp`,
  img14: `${base}images/loader/loader-14.webp`,
  img15: `${base}images/loader/loader-15.webp`,
  img16: `${base}images/loader/loader-16.webp`,
  img17: `${base}images/loader/loader-17.webp`,
  img18: `${base}images/loader/loader-18.webp`,
  img19: `${base}images/loader/loader-19.webp`,
  img20: `${base}images/loader/loader-20.webp`,
  img21: `${base}images/loader/loader-21.webp`,
  img22: `${base}images/loader/loader-22.webp`,
  img23: `${base}images/loader/loader-23.webp`,
  img24: `${base}images/loader/loader-24.webp`,
};



const NUMBER_SEQUENCE = [0, 23, 48, 71, 100];

// Desktop: 5 columns, 5 rows each
const desktopColumns = [
  { class: "c-1", images: ["img1", "img2", "img3", "img4", "img5"] },
  { class: "c-2", images: ["img6", "img7", "img8", "img9", "img10"] },
  { class: "c-3", images: ["img11", "img12", null, "img13", "img14"] },
  { class: "c-4", images: ["img15", "img16", "img17", "img18", "img19"] },
  { class: "c-5", images: ["img20", "img21", "img22", "img23", "img24"] },
];

// Mobile: 3 columns, 3 rows each
const mobileColumns = [
  { class: "c-1", images: ["img1", "img3", "img4"] },
  { class: "c-2", images: ["img6", null, "img9"] },
  { class: "c-3", images: ["img11", "img12", "img8"] },
];

export default function Loader({ onComplete }) {
  const timelineRef = useRef(null);
  const numberRef = useRef(null);
  const circleRef = useRef(null);
  const counterContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const columns = isMobile ? mobileColumns : desktopColumns;

  useEffect(() => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    const tl = gsap.timeline({ delay: 0.3 });

    // =============
    // COUNTER + CIRCLE ANIMATION
    // =============

    NUMBER_SEQUENCE.forEach((num, i) => {
      const progress = num / 100;
      // Animate number
      tl.to(numberRef.current, {
        opacity: 0.5,
        innerText: num,
        duration: 0.4,
        snap: { innerText: 1 },
        ease: "power2.inOut",
      }, i * 0.5);

      tl.to(numberRef.current, {
        opacity: 1,
        innerText: num,
        duration: 0.4,
        snap: { innerText: 1 },
        ease: "power2.inOut",
      }, i * 0.5);

      // Animate circle
      tl.to(
        circleRef.current,
        {
          strokeDashoffset: circumference * (1 - progress),
          duration: 0.75,
          ease: "power3.out",
        },
        i * 0.5
      );
    });

    tl.to(counterContainerRef.current, {
      opacity: 0,
      duration: 0.8,
      scale: 0.8,
      ease: "expo.in",
    }, "-=0.1");

    // =============
    // IMAGE GRID ANIMATION 
    // =============

    tl.to(".col", {
      top: "0",
      duration: 2.5,
      ease: "power4.in",
    }, "-=1.65");

    if (isMobile) {
      // Mobile: 3 columns animation
      tl.to(".c-1 .item", {
        top: "0",
        stagger: 0.2,
        duration: 2.5,
        ease: "expo.inOut",
      }, "-=2");

      tl.to(".c-3 .item", {
        top: "0",
        stagger: 0.2,
        duration: 2.5,
        ease: "expo.inOut",
      }, "<");

      tl.to(".c-2 .item", {
        top: "0",
        stagger: -0.15,
        duration: 2.5,
        ease: "expo.inOut",
      }, "-=3");
    } else {
      // Desktop: 5 columns animation
      tl.to(".c-1 .item", {
        top: "0",
        stagger: 0.25,
        duration: 3,
        ease: "expo.inOut",
      }, "-=2");

      tl.to(".c-5 .item", {
        top: "0",
        stagger: 0.25,
        duration: 3,
        ease: "expo.inOut",
      }, "<");

      tl.to(".c-2 .item", {
        top: "0",
        stagger: -0.2,
        duration: 3,
        ease: "expo.inOut",
      }, "-=4");

      tl.to(".c-4 .item", {
        top: "0",
        stagger: -0.2,
        duration: 3,
        ease: "expo.inOut",
      }, "-=4");

      tl.to(".c-3 .item", {
        top: "0",
        stagger: 0.1,
        duration: 3,
        ease: "expo.inOut",
      }, "-=4");
    }

    tl.to(".grid-container", {
      scale: 5,
      duration: 2.5,
      ease: "expo.inOut",
      onComplete: () => {
        if (onComplete) onComplete();
      },
    }, "<2.5");

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [onComplete, isMobile]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black">
      {/* Counter with Circle (on top) */}
      <div
        ref={counterContainerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative flex items-center justify-center">
          <svg
            width="200"
            height="200"
            viewBox="0 0 100 100"
            className="absolute -z-10"
          >
            <circle
              ref={circleRef}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>
          <div
            ref={numberRef}
            className="text-white text-5xl md:text-6xl font-bold tabular-nums opacity-0"
          >
            0
          </div>
        </div>
      </div>

      {/* 🖼️ Image Grid (behind counter initially) */}
      <div className="grid-container fixed w-full h-full flex gap-[0.2em]">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={`col ${col.class} relative flex-1 w-full flex flex-col gap-[0.2em] ${
              colIndex % 2 === 0 ? "top-full" : "-top-full"
            }`}
          >
            {col.images.map((imgKey, imgIndex) => (
              <div
                key={imgIndex}
                className={`item relative flex-1 w-full overflow-hidden ${
                  colIndex % 2 === 0 ? "top-full" : "-top-full"
                }`}
              >
                {imgKey && images[imgKey] && (
                  <img
                    src={images[imgKey]}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}