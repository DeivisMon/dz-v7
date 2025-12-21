import { useState, useRef } from "react";
import { motion as Motion } from "framer-motion";

const chars = "!@#$%^&*()_+-=[]{}<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({ text }) {
  const [charStates, setCharStates] = useState(() => text.split(""));
  const animationId = useRef(0);

  const handleHover = () => {
    animationId.current += 1;
    const id = animationId.current;
    const maxCount = 8;

    text.split("").forEach((char, index) => {
      if (char === " ") return;

      let count = 0;

      const scrambleChar = () => {
        // ⛔ ignore stale animations
        if (animationId.current !== id) return;

        setCharStates((prev) =>
          prev.map((c, i) =>
            i !== index
              ? c
              : count < maxCount
              ? chars[Math.floor(Math.random() * chars.length)]
              : text[i]
          )
        );

        count++;
        if (count < maxCount) {
          setTimeout(scrambleChar, Math.random() * 40);
        }
      };

      setTimeout(scrambleChar, Math.random() * 200);
    });

    // ✅ guaranteed final reset
    setTimeout(() => {
      if (animationId.current === id) {
        setCharStates(text.split(""));
      }
    }, 400);
  };

  return (
    <Motion.span
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
      onAnimationComplete={handleHover}
      // onMouseEnter={handleHover}
      className="inline-flex gap-[0.05em] cursor-pointer"
    >
      {charStates.map((char, i) => (
        <span key={i} className="font-thin uppercase">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Motion.span>
  );
}
