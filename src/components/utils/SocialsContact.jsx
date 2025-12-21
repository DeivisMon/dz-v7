import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import { MdArrowOutward } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { PiCopy } from "react-icons/pi";
import { useFindMobile } from "../hooks/useFindMobile";

const containerVariants = {
  hidden: { y: 65, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 1.5,
      duration: 0.5,
      staggerChildren: 0.15,
      delayChildren: 1.5,
    },
  },
  exit: { y: -15, opacity: 0, transition: { duration: 0.25 } },
};

const iconVariants = {
  hidden: { y: "50%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

export default function SocialsContact() {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { isMobileLayout } = useFindMobile();

  const icons = [
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "x", label: "X.com" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("zvinklys@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="social-icons flex flex-col justify-center mix-blend-difference space-y-8"
    >
      <div className="flex flex-col items-center md:items-start space-y-4">
        <h2 className="text-[clamp(1rem,6vw,5.5rem)] tracking-[clamp(0.12em,0.6vw,0.35em)] px-[clamp(1.5rem,6vw,6rem)] font-extrabold">
          Let's Connect
        </h2>
        {icons.map(({ id, label }) => (
          <div
            key={id}
            className="cursor-trigger group flex items-center px-[clamp(2rem,8vw,8rem)]"
            data-cursor-type="link"
          >
            <Motion.div
              variants={iconVariants}
              className="font-bold text-[clamp(1rem,2.5vw,2.25rem)] tracking-[clamp(0.5em,0.5vw,0.35em)]"
              aria-label={label}
            >
              <ScrambleText text={label} />
            </Motion.div>
            {isMobileLayout ? null : (
              <span className="opacity-0 -rotate-180 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-0 bg-gray-600/10 rounded-full transition-all duration-300 ease-in-out ">
                <MdArrowOutward size={54} color="#e95c5ce7" />
                {/* <GoArrowUpRight size={42} /> */}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-[clamp(1rem,6vw,5.5rem)] px-[clamp(1.5rem,6vw,6rem)]">
          Email
        </h2>
        <p className="relative text-[clamp(1.25rem,2.8vw,1.875rem)] tracking-[clamp(0.15em,0.6vw,0.4em)] px-[clamp(2rem,8vw,8rem)]">
          zvinklys@zvinklys.com{" "}
          <span
            onClick={copy}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="cursor-trigger cursor-pointer underline relative inline-block hover:opacity-75"
          >
            <PiCopy />

            {/* Tooltip */}
            {isHovering && !copied && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-8 mb-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-[#e95c5ce7] whitespace-nowrap tracking-[1px]">
                Copy
              </span>
            )}

            {copied && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-8 mb-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-[#e95c5ce7] whitespace-nowrap tracking-[1px]">
                Copied!
              </span>
            )}
          </span>
        </p>
      </div>
    </Motion.div>
  );
}
