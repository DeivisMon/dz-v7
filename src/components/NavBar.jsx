import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimatedText from "./utils/AnimatedText";

export default function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const navScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", navScroll);
    return () => window.removeEventListener("scroll", navScroll);
  }, []);

  return (
    <div
      className={`navbar fixed z-10 top-0 left-0 w-full h-full flex items-end p-0 m-0 transition-all mix-blend-exclusion duration-700 ease-in-out select-none ${
        scrolled
          ? "flex-row justify-between px-8 border-b"
          : "flex-col justify-between border-none"
      }`}
    > <div
        className={`w-full flex items-center ${
          scrolled ? "border-none justify-center" : "border-t"
        }`}
      >
        <div
          className={`nav-links relative z-1 nav-item flex items-end font-bold tracking-widest text-[100px] backdrop-blur bg-black/50 transition-all duration-500 ease-in-out ${
            scrolled ? "justify-end" : "w-full justify-evenly"
          }`}
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
      <div className="logo text-black h-full">
          <Link
            className={`font-extrabold transition-all duration-500 ease-in-out ${
              scrolled
                ? "text-[1.2rem] md:text-[2rem]"
                : "text-[2rem] 2xl:text-[3rem]"
            }`}
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
