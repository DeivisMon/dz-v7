import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import { MdArrowOutward } from "react-icons/md";
import { PiCopy } from "react-icons/pi";
import { useResponsive } from "../hooks/useResopnsive";
import AnimatedText from "./AnimatedText";

const containerVariants = {
  hidden: { y: 65, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 1.25,
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

const underlineVariants = {
  initial: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const emailUnderlineVariants = {
  initial: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function SocialsContact() {
  const [copied, setCopied] = useState(false);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const responsive = useResponsive();

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
      className="social-icons flex flex-col justify-center space-y-4 md:space-y-16"
    >
      {/* Socials with underline hover */}
      <div className="flex flex-col items-center py-4 border-b border-white/40">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[clamp(0.5em,calc(0.05em+0.3vw),0.35em)]">
          Let's Connect
        </h2>
        <div className="flex flex-col items-start w-full max-w-xl ">
          {icons.map(({ id, label }) => (
            <div
              key={id}
              className="cursor-trigger group relative w-full"
              data-cursor-type="link"
              onMouseEnter={() => setHoveredIcon(id)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <div className="flex items-center justify-between py-2 md:py-4">
                <Motion.div
                  variants={iconVariants}
                  className="font-bold text-[clamp(1rem,calc(0.5rem+1vw),4.25rem)] tracking-[clamp(0.5em,calc(0.05em+0.3vw),0.35em)] relative"
                  aria-label={label}
                >
                  <AnimatedText
                    text={label}
                    textColor="text-gray-500"
                    duration={0.75}
                    delayChildren={1.5}
                    staggerChildren={0.035}
                    enableHover={false}
                    key={location.pathname}
                  />
                </Motion.div>

                {!responsive.isMobile && (
                  <span className="opacity-0 -rotate-180 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-0 bg-gray-600/10 rounded-full transition-all duration-300 ease-in-out ">
                    <MdArrowOutward size={48} color="#e08c8ce7" />
                  </span>
                )}
              </div>

              {/* Underline for Social Icons */}
              <Motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e08c8ce7] to-transparent origin-left"
                variants={underlineVariants}
                initial="initial"
                animate={hoveredIcon === id ? "hover" : "initial"}
                whileHover="hover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4">
          Email
        </h2>

        {/* Email with underline hover */}
        <div className="relative w-full max-w-xl">
          <div
            onClick={copy}
            onMouseEnter={() => setIsHoveringEmail(true)}
            onMouseLeave={() => setIsHoveringEmail(false)}
            className="cursor-trigger cursor-pointer relative text-gray-500 text-[clamp(1rem,calc(0.5rem+1vw),2.25rem)] tracking-[clamp(0.15em,0.6vw,0.4em)] py-2 md:py-4"
          >
            <AnimatedText
              text="zvinklys@zvinklys.com"
              textColor="text-gray-500"
              duration={0.75}
              delayChildren={1.65}
              staggerChildren={0.035}
              enableHover={false}
              key={location.pathname}
            />
            <span className="inline-block ml-2 align-middle">
              <PiCopy />
            </span>
            {/* Tooltip */}
            {isHoveringEmail && !copied && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 mt-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-[#e95c5ce7] whitespace-nowrap tracking-[1px]">
                Copy
              </span>
            )}
            {copied && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 mt-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-[#e95c5ce7] whitespace-nowrap tracking-[1px]">
                Copied!
              </span>
            )}
          </div>

          {/* Underline for email */}
          <Motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e08c8ce7] to-transparent origin-left"
            variants={emailUnderlineVariants}
            initial="initial"
            animate={isHoveringEmail ? "hover" : "initial"}
            whileHover="hover"
          />
        </div>
      </div>
    </Motion.div>
  );
}
