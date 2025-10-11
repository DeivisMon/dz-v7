import { Link, useLocation } from "react-router-dom";
import AnimatedText from "./utils/AnimatedText";

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`navbar fixed z-100 top-0 left-0 w-full flex px-8 m-0 transition-all backdrop-blur-[1px] mix-blend-exclusion duration-700 ease-in-out select-none `}
    >
      <div className={`w-full flex `}>
        <div
          className={`nav-links relative z-1 nav-item flex items-start gap-4 font-bold tracking-widest text-[20px] backdrop-blur bg-black/50 transition-all duration-500 ease-in-out `}
        >
          <Link
            className={`cursor-trigger flex justify-center items-center p-1 cursor-none ${
              !isActive("/") ? "opacity-85 font-normal" : "italic"
            }`}
            data-cursor-type="link"
            to="/"
          >
            <AnimatedText text="Index" duration={0.3} key={location.pathname} />
          </Link>
          <Link
            className={`cursor-trigger flex justify-center items-center ml-4 p-1 cursor-none ${
              !isActive("/portfolio") ? "opacity-85 font-normal" : "italic"
            }`}
            data-cursor-type="link"
            to="/portfolio"
          >
            <AnimatedText
              text="Portfolio"
              duration={0.4}
              key={location.pathname}
            />
          </Link>
          <Link
            className={`cursor-trigger flex justify-center items-center ml-4 mr-8 p-1 cursor-none ${
              !isActive("/contact") ? "opacity-85 font-normal" : "italic"
            }`}
            data-cursor-type="link"
            to="/contact"
          >
            <AnimatedText
              text="Contact"
              duration={0.5}
              key={location.pathname}
            />
          </Link>
        </div>
      </div>

      <div className="logo text-black text-[48px]  h-full">
        <Link
          className={`font-extrabold transition-all duration-500 ease-in-out `}
          to="/"
        >
          <AnimatedText
            text="Darius Žvinklys"
            duration={0.75}
            delayChildren={1}
            enableHover={false}
            letterSpacing="px-[5px]"
            key={location.pathname}
          />
        </Link>
      </div>
    </div>
  );
}
