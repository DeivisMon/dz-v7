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

const phoneUnderlineVariants = {
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

export default function ContactSocials() {
  const [copied, setCopied] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [isHoveringPhone, setIsHoveringPhone] = useState(false);
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
      className="social-icons w-4/5 flex flex-col justify-center space-y-0 xl:space-y-16"
    >
      {/* Socials with underline hover */}
      <div className="flex flex-col items-center py-2 md:border-b border-white/40">
        <h2 className="text-md lg:text-4xl font-bold tracking-[clamp(0.35em,calc(0.05em+0.3vw),0.25em)] text-header">
          Susisiekime
        </h2>
        <div className="flex flex-col items-center lg:items-start w-full min-w-0 ">
          {icons.map(({ id, label }) => (
            <div
              key={id}
              className="cursor-trigger group relative w-full px-8"
              data-cursor-type="link"
              onMouseEnter={() => setHoveredIcon(id)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <div className="flex items-center justify-between py-1 lg:py-2">
                <Motion.div
                  variants={iconVariants}
                  className="font-bold text-sm lg:text-2xl tracking-[0.25em] relative"
                  aria-label={label}
                >
                  <AnimatedText
                    text={label}
                    textColor="text-muted"
                    duration={0.75}
                    delayChildren={1.5}
                    staggerChildren={0.035}
                    enableHover={false}
                    key={location.pathname}
                  />
                </Motion.div>

                {!responsive.isMobile && (
                  <span className="opacity-0 -rotate-180 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-0 bg-gray-600/10 rounded-full transition-all duration-300 ease-in-out ">
                    <MdArrowOutward
                      className="w-6 h-6 lg:w-12 lg:h-12"
                      color="#A67C52"
                    />
                  </span>
                )}
              </div>

              {/* Underline for Social Icons */}
              {!responsive.isMobile && (
                <Motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#A67C52] to-transparent origin-left"
                  variants={underlineVariants}
                  initial="initial"
                  animate={hoveredIcon === id ? "hover" : "initial"}
                  whileHover="hover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

        {/* Email with underline hover */}
      <div className="flex flex-col items-center justify-center md:border-b border-white/40 py-2">
        <h2 className="text-md lg:text-4xl font-bold lg:mb-4 text-header">El.paštas</h2>

        <div className="relative">
          <div
            onClick={copy}
            onMouseEnter={() => setIsHoveringEmail(true)}
            onMouseLeave={() => setIsHoveringEmail(false)}
            className="cursor-trigger cursor-pointer relative text-gray-500 text-sm lg:text-2xl tracking-[clamp(0.15em,0.6vw,0.4em)] py-2 md:py-4"
          >
            <AnimatedText
              text="zvinklys@zvinklys.com"
              textColor="text-muted"
              duration={0.75}
              delayChildren={1.65}
              staggerChildren={0.035}
              enableHover={false}
              key={location.pathname}
            />
            <span className="inline-block ml-2 text-accent align-middle">
              <PiCopy />
            </span>
            {/* Tooltip */}
            {isHoveringEmail && !copied && (
              <span className="absolute -translate-x-1/2 -top-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-muted whitespace-nowrap tracking-[1px]">
                Copy
              </span>
            )}
            {copied && (
              <span className="absolute -right-5 -translate-x-1/2 -top-2 rounded bg-gray-600/25 px-2 py-1 text-xs text-muted whitespace-nowrap tracking-[1px]">
                Copied!
              </span>
            )}
          </div>

          {/* Underline for email */}
          <Motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#A67C52] to-transparent origin-left"
            variants={emailUnderlineVariants}
            initial="initial"
            animate={isHoveringEmail ? "hover" : "initial"}
            whileHover="hover"
          />
        </div>
      </div>

        {/* Phone with underline hover */}
       <div className="flex flex-col items-center justify-center">
        <h2 className="text-md lg:text-4xl font-bold lg:mb-4 text-header">Telefonas</h2>

        <div className="relative">
          <div
            onMouseEnter={() => setIsHoveringPhone(true)}
            onMouseLeave={() => setIsHoveringPhone(false)}
            className="cursor-trigger cursor-pointer relative text-gray-500 text-sm lg:text-2xl tracking-[clamp(0.15em,0.6vw,0.4em)] py-2 md:py-4"
          >
            <AnimatedText
              text="+370 600 00000"
              textColor="text-muted"
              duration={0.75}
              delayChildren={1.65}
              staggerChildren={0.035}
              enableHover={false}
              key={location.pathname}
            />
          </div>

          {/* Underline for Phone */}
          <Motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#A67C52] to-transparent origin-left"
            variants={phoneUnderlineVariants}
            initial="initial"
            animate={isHoveringPhone ? "hover" : "initial"}
            whileHover="hover"
          />
        </div>
      </div>
    </Motion.div>
  );
}
