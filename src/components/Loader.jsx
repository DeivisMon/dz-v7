// Loader.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// Import images
import img1 from "../assets/img1.avif";
import img2 from "../assets/img2.avif";
import img3 from "../assets/img3.avif";
import img4 from "../assets/img4.avif";
import img5 from "../assets/img5.avif";
import img6 from "../assets/img6.avif";
import img7 from "../assets/img7.avif";
import img8 from "../assets/img8.avif";
import img9 from "../assets/img9.avif";
import img10 from "../assets/img10.avif";
import img11 from "../assets/img11.avif";
import img12 from "../assets/img12.avif";
import img13 from "../assets/img13.avif";
import img15 from "../assets/img15.avif";

const images = {
  img1, img2, img3, img4, img5,
  img6, img7, img8, img9, img10,
  img11, img12, img13, img15,
};

const NUMBER_SEQUENCE = [0, 23, 48, 71, 100];

export default function Loader({ onComplete }) {
  const timelineRef = useRef(null);
  const numberRef = useRef(null);
  const circleRef = useRef(null);
  const counterContainerRef = useRef(null);

  const columns = [
    { class: "c-1", images: ["img1", "img2", "img3", "img4", "img5"] },
    { class: "c-2", images: ["img6", "img7", "img8", "img9", "img10"] },
    { class: "c-3", images: ["img11", "img12", null, "img13", "img15"] },
    { class: "c-4", images: ["img1", "img2", "img3", "img4", "img5"] },
    { class: "c-5", images: ["img6", "img7", "img8", "img9", "img10"] },
  ];

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
          duration: 0.9,
          ease: "power3.out",
        },
        i * 0.5
      );
    });

    tl.to(counterContainerRef.current, {
      opacity: 0,
      duration: 1,
      scale: 0.8,
      ease: "expo.in",
    }, "-=0.1");

    // =============
    // IMAGE GRID ANIMATION 
    // =============

    tl.to(".col", {
      top: "0",
      duration: 2.5,
      ease: "power4.inOut",
    }, "-=1.65");

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

    tl.to(".grid-container", {
      scale: 5,
      duration: 2,
      ease: "expo.inOut",
      onComplete: () => {
        if (onComplete) onComplete();
      },
    }, "<2.5");

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [onComplete]);

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