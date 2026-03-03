import { useState, useEffect } from "react";
import "./contactButton.css";

export default function ChangeContactButton({
  onClick,
  buttonRef,
  buttonTransform,
  currentText,
  nextText,
}) {
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState(currentText);

  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(currentText);
    }
  }, [currentText, isAnimating]);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="cursor-trigger cursor-pointer group relative w-16 h-16 xl:w-24 xl:h-24 rounded-full text-[8px] md:text-xs xl:text-sm font-bold flex items-center justify-center transition-all duration-500 ease-out overflow-hidden"
      type="button"
      style={{
        transform: `translate(${buttonTransform.x}px, ${
          buttonTransform.y
        }px) scale(${isActive ? 1.05 : 1})`,
      }}
    >
      {/* Base background with inset shadow */}
      <div className="absolute inset-0 m-auto w-[98%] h-[98%] rounded-full bg-surface transition-all duration-300" />
      <div className="absolute inset-0 m-auto w-[90%] h-[90%] rounded-full border border-accent/66 group-hover:scale-[108%] transition-all duration-300" />

      {/* Rotating dots border */}
      <div className="absolute inset-[-4px] rounded-full overflow-hidden -z-10">
        <div
          className={`absolute top-1/2 left-[90%] w-[500%] h-4 bg-gradient-to-b from-transparent via-white to-transparent ${
            isActive ? "animate-spin-slow" : "animate-spin-slow"
          }`}
          style={{
            transform: "translate(-50%, -50%)",
            filter: "blur(1px)",
          }}
        />
      </div>

      {/* Text Container with Slide Animation */}
      <div className="relative z-10 w-full h-full flex items-center  text-accent justify-center overflow-hidden">
        {/* Current Text - Slides Down */}
        <span
          className="absolute font-bold transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: isActive
              ? "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 0) 120%)"
              : "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 1) 120%)",
            backgroundClip: "text",
            WebkitBackfaceVisibility: "text",
            transform: isAnimating ? "translateY(100%)" : "translateY(0)",
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {displayText}
        </span>

        {/* Next Text - Slides Up from Top */}
        <span
          className="absolute font-bold transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: isActive
              ? "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 0) 120%)"
              : "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 1) 120%)",
            backgroundClip: "text",
            WebkitBackfaceVisibility: "text",
            transform: isAnimating ? "translateY(0)" : "translateY(-100%)",
            opacity: isAnimating ? 1 : 0,
          }}
        >
          {nextText}
        </span>
      </div>
    </button>
  );
}