import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import AnimatedText from "../utils/AnimatedText";
import { useResponsive } from "../hooks/useResopnsive";
// import { useDeviceType } from "./hooks/useDeviceType";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const menuLinksRef = useRef([]);
  const responsive = useResponsive();
  // const { isMobile } = useDeviceType();
  const underlineRef = useRef(null);
  const navItemRefs = useRef({});

  const navItems = [
    { path: "/", label: "Pradžia" },
    { path: "/portfolio", label: "Galerija" },
    { path: "/apie-mane", label: "Apie mane" },
    { path: "/kontaktai", label: "Kontaktai" },
  ];

  const moveUnderlineTo = (path) => {
    const targetEl = navItemRefs.current[path];
    if (targetEl && underlineRef.current) {
      const { offsetLeft, offsetWidth } = targetEl;
      gsap.to(underlineRef.current, {
        left: offsetLeft + 5,
        width: offsetWidth - 10,
        duration: 0.25,
        ease: "expo.out",
      });
    }
  };

  useEffect(() => {
    moveUnderlineTo(location.pathname);
  }, [location.pathname]);

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
        "-=0.4",
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
        "-=0.1",
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
    return "bg-[#000000]";
  };

  return (
    <>
      <div
        className={`${getNabarBackground(
          location.pathname,
        )} navbar fixed z-[9999] ${
          responsive.isMobile ? "" : "top-0"
        } left-0 w-full py-1 md:py-2 xl:py-8 m-0 transition-all duration-700 ease-in-out select-none `}
      >
        <div className="navbar-container relative w-full flex justify-between items-center">
          <div className="absolute left-0 -top-3 w-full flex justify-between items-center">
            {/* Logo */}
            <div className={`logo text-[24px] xl:text-[42px] pl-8`}>
              {" "}
              <Link
                className="font-bold transition-all duration-500 ease-in-out"
                to="/"
                onClick={() => handleNavClick("/")}
              >
                {" "}
                <AnimatedText
                  text="Žvinklys"
                  textColor="text-header"
                  duration={0.75}
                  delayChildren={1}
                  enableHover={false}
                  letterSpacing={`${responsive.isTablet || responsive.isMobile ? "px-[8px]" : "px-[10px]"}`}
                  // key={location.pathname}
                />{" "}
              </Link>{" "}
            </div>
            {/* Desktop Navigation */}
            <ul
              className={`${
                responsive.isMobile || responsive.isTablet ? "hidden" : "flex"
              } nav-links relative z-[1000] items-center gap-0 lg:gap-4 pr-8`}
              onMouseLeave={() => moveUnderlineTo(location.pathname)}
            >
              {/* Animated underline */}
              <div
                ref={underlineRef}
                className="animated-underline absolute bottom-2 h-[1px] bg-muted"
                style={{ left: 0, width: 0 }}
              />

              {navItems.map((item, i) => (
                <li
                  key={item.path}
                  ref={(el) => (navItemRefs.current[item.path] = el)}
                  className={`cursor-trigger inline-flex items-center justify-center cursor-none ${
                    !isActive(item.path)
                      ? "opacity-80 font-normal text-muted"
                      : "opacity-100 text-accent font-bold italic"
                  }`}
                  data-cursor-type="link"
                  onMouseEnter={() => moveUnderlineTo(item.path)}
                >
                  <Link to={item.path} className="py-2 px-1">
                    <AnimatedText
                      text={item.label}
                      duration={0.3 + i * 0.1}
                      letterSpacing="px-[1px]"
                      key={item.path}
                      // key={location.pathname}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className={`${
          !responsive.isMobile && !responsive.isTablet ? "hidden" : "flex"
        } fixed right-2 z-[9999] w-10 h-10  flex-col justify-center items-center gap-1.5 mix-blend-difference`}
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
          !responsive.isMobile && !responsive.isTablet ? "hidden" : "flex"
        } fixed top-0 left-0 w-full h-[100dvh] bg-black z-[1500] flex-col justify-center items-center`}
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <nav className="flex flex-col gap-8 text-center">
          {[
            { path: "/", label: "Pradžia" },
            { path: "/portfolio", label: "Galerija" },
            { path: "/apie-mane", label: "Apie mane" },
            { path: "/kontaktai", label: "Kontaktai" },
          ].map((item, i) => (
            <Link
              key={item.path}
              ref={(el) => (menuLinksRef.current[i] = el)}
              className={`text-3xl md:text-5xl font-bold tracking-widest text-white ${
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
