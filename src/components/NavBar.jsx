import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimatedText from "./utils/AnimatedText";

export default function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  // const [time, setTime] = useState(new Date());
  // const [showColon, setShowColon] = useState(true);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTime(new Date());
  //     setShowColon((prev) => !prev);
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // const hours = time.getHours().toString().padStart(2, "0");
  // const minutes = time.getMinutes().toString().padStart(2, "0");
  // const seconds = time.getSeconds().toString().padStart(2, "0");

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
      className={`navbar fixed z-100 top-0 left-0 w-full flex items-center p-0 m-0 bg-black/05 backdrop-blur-[5px] mix-blend-exclusion transition-all duration-700 ease-in-out select-none ${
        scrolled
          ? "flex-row justify-between px-8 border-b"
          : "flex-col justify-center border-none"
      }`}
    >
      <div
        className={`w-full flex justify-between items-center ${
          scrolled ? "border-none justify-end" : "border-t"
        }`}
      >
        {/* <div
          className={`location nav-item text-white items-center ml-8 text-[1rem] ${
            scrolled ? "hidden" : "lg:flex"
          }`}
        >
          <span className="w-[120px]">Klaipėda, LT </span>
          <span className="tabular-nums w-[120px]">
            {hours}
            <span
              className={
                showColon
                  ? "opacity-100"
                  : "opacity-0 transition-opacity duration-200"
              }
            >
              :
            </span>
            {minutes}
            <span
              className={
                showColon
                  ? "opacity-100"
                  : "opacity-0 transition-opacity duration-200"
              }
            >
              :
            </span>
            {seconds}
          </span>
        </div> */}
        <div
          className={`nav-links relative z-1 nav-item flex items-end font-bold tracking-widest text-lg mix-blend-normal transition-all duration-500 ease-in-out uppercase ${
            scrolled ? "justify-end" : "w-full justify-end "
          }`}
        >
          <Link
            className={`cursor-trigger flex justify-center items-center p-1 text-shadow-lg cursor-none ${
              !isActive("/") ? "opacity-50 font-normal" : "italic"
            }`}
            data-cursor-type="link"
            to="/"
          >
            <AnimatedText text="Index" duration={0.3} key={location.pathname} />
          </Link>
          <Link
            className={`cursor-trigger flex justify-center items-center ml-4 p-1 text-shadow-lg cursor-none ${
              !isActive("/portfolio") ? "opacity-50 font-normal" : "italic"
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
            className={`cursor-trigger flex justify-center items-center ml-4 mr-8 p-1 text-shadow-lg cursor-none ${
              !isActive("/contact") ? "opacity-50 font-normal" : "italic"
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

      <div className="logo fixed top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full flex justify-center uppercase">
          <div
            className={`font-bold transition-all duration-500 ease-in-out ${
              scrolled
                ? "text-[1.2rem] md:text-[2rem]"
                : "text-[2rem] 2xl:text-[7rem]"
            }`}
          >
            <AnimatedText
              text="Darius Žvinklys"
              duration={0.75}
              delayChildren={1}
              enableHover={false}
              letterSpacing="px-[25px]"
              key={location.pathname}
            />
          </div>
      </div>
    </div>
  );
}
