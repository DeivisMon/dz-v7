import { useState } from "react";
import "./contactButton.css";

export default function ChangeContactButton({
  onClick,
  buttonRef,
  buttonTransform,
  text,
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="cursor-trigger cursor-pointer group relative w-16 h-16 md:w-24 md:h-24 rounded-full text-white text-xs md:text-sm font-bold flex items-center justify-center transition-all duration-500 ease-out overflow-hidden"
      type="button"
      style={{
        transform: `translate(${buttonTransform.x}px, ${
          buttonTransform.y
        }px) scale(${isActive ? 1.05 : 1})`,
      }}
    >
      {/* Base background with inset shadow */}
      <div className="absolute inset-0 m-auto w-[98%] h-[98%] rounded-full bg-gray-700 transition-all duration-300" />
      <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full border-2 border-gray-200 group-hover:scale-115 transition-all duration-300" />


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

      {/* Text with gradient */}
      <span
        className="relative z-10 font-bold transition-all duration-500"
        style={{
          backgroundImage: isActive
            ? "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 0) 120%)"
            : "linear-gradient(90deg, hsla(0 0% 100% / 1) 0%, hsla(0 0% 100% / 1) 120%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
      </span>
    </button>
  );
}
