import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import AnimatedText from "../utils/AnimatedText";
import { useFindMobile } from "../hooks/useFindMobile";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const menuLinksRef = useRef([]);
  const { isMobileLayout } = useFindMobile();


  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    menuLinksRef.current = [];
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      });

      tl.fromTo(
        menuLinksRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      );
    } else if (overlayRef.current && menuLinksRef.current.length > 0) {
      const tl = gsap.timeline();

      tl.to(menuLinksRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "expo.out",
      });

      tl.to(
        overlayRef.current,
        {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
        },
        "-=0.1"
      );
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (path) => {
    if (path === location.pathname) {
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(false);

    setTimeout(() => {
      navigate(path);
    }, 250);
  };

  const getNabarBackground = (path) => {
    if (path === "/portfolio") return "bg-[#000000]";
    return "mix-blend-difference";
  };

  return (
    <>
      <div
        className={`${getNabarBackground(
          location.pathname
        )} navbar fixed z-[150] ${
          isMobileLayout ? "" : "-top-5"
        } left-0 w-full flex px-2 py-2 md:px-4 m-0 transition-all duration-700 ease-in-out select-none `}
      >
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <div className={`logo ${isMobileLayout ? "text-[24px]" : "text-[48px]"} h-full`}>
            {" "}
            <Link
              className="font-bold transition-all duration-500 ease-in-out"
              to="/"
              onClick={() => handleNavClick("/")}
            >
              {" "}
              <AnimatedText
                text="Žvinklys"
                duration={0.75}
                delayChildren={1}
                enableHover={false}
                letterSpacing="px-[3px]"
                key={location.pathname}
              />{" "}
            </Link>{" "}
          </div>
          {/* Desktop Navigation */}
          <div
            className={`${
              isMobileLayout ? "hidden" : "flex"
            } nav-links relative z-[1000] nav-item items-center gap-0 lg:gap-4 font-bold text-[20px] backdrop-blur transition-all duration-500 ease-in-out`}
          >
            {[
              { path: "/", label: "Index" },
              { path: "/portfolio", label: "Portfolio" },
              { path: "/contact", label: "Contact" },
            ].map((item, i) => (
              <Link
                key={item.path}
                className={`cursor-trigger flex justify-center items-center p-1 cursor-none ${
                  !isActive(item.path) ? "opacity-85 font-normal" : "italic"
                }`}
                data-cursor-type="link"
                to={item.path}
              >
                <AnimatedText
                  text={item.label}
                  duration={0.3 + i * 0.1}
                  key={location.pathname}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className={`${
          !isMobileLayout ? "hidden" : "flex"
        } fixed right-2 z-[1000] w-10 h-10  flex-col justify-center items-center gap-1.5 mix-blend-difference`}
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className={`${
          !isMobileLayout ? "hidden" : "flex"
        } fixed top-0 left-0 w-full h-screen bg-black z-[150] flex-col justify-center items-center`}
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <nav className="flex flex-col gap-8 text-center">
          {[
            { path: "/", label: "Index" },
            { path: "/portfolio", label: "Portfolio" },
            { path: "/contact", label: "Contact" },
          ].map((item, i) => (
            <Link
              key={item.path}
              ref={(el) => (menuLinksRef.current[i] = el)}
              className={`text-5xl font-bold tracking-widest text-white ${
                isActive(item.path) ? "italic" : "opacity-85"
              }`}
              to={item.path}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.path);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
