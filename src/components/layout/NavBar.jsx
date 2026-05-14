import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../utils/AnimatedText";
import { useResponsive } from "../hooks/useResopnsive";
import gsap from "gsap";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const responsive = useResponsive();
  const underlineRef = useRef(null);
  const navItemRefs = useRef({});

  const navItems = [
    { path: "/", label: "Pradžia" },
    { path: "/portfolio", label: "Galerija" },
    { path: "/apie-mane", label: "Apie mane" },
    { path: "/kontaktai", label: "Kontaktai" },
  ];

  // Desktop Navbar underline
  const moveUnderlineTo = (path) => {
    const targetEl = navItemRefs.current[path];
    if (targetEl && underlineRef.current) {
      const { offsetLeft, offsetWidth } = targetEl;
      gsap.to(underlineRef.current, {
        left: offsetLeft + 5,
        width: offsetWidth - 10,
        duration: 0.33,
        ease: "expo.inOut",
      });
    }
  };

  useEffect(() => {
    moveUnderlineTo(location.pathname);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleNavClick = (path) => {
    if (path === location.pathname) {
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(false);
    setTimeout(() => navigate(path), 1000);
  };

  // ── Framer Motion variants ──────────────────────────────────────────────

  const Animate = (variants) => ({
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants,
  });

  // Full-screen overlay: clips in from top-right corner (mirrors original GSAP clip-path)
  const overlay = {
    initial: { clipPath: "inset(0% 0% 100% 100%)" },
    animate: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 0.75, delay: 0.25, ease: [0.87, 0, 0.13, 1] },
    },
    exit: {
      clipPath: "inset(0% 0% 100% 100%)",
      transition: { duration: 0.5, delay: 0.5, ease: [0.53, 0.2, 0.17, 1] },
    },
  };

  // Each nav link: slides up in, slides up out
  const linkItem = {
    initial: { y: -100, x: 100, opacity: 0 },
    animate: (i) => ({
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.6 + i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: (i) => ({
      y: -50,
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.25,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <>
      {/* ── Navbar bar ───────────────────────────────────────────────────── */}
      <div
        className={`bg-black navbar fixed z-[1000] ${
          responsive.isMobile || responsive.isTablet ? "top-0 h-[38px]" : "top-0 h-[64px]"
        } left-0 w-full py-1 md:py-2 xl:py-8 m-0 transition-all duration-700 ease-in-out select-none`}
      >
        <div className="navbar-container relative w-full flex justify-between items-center">
          <div className="absolute left-0 top-0 xl:-top-3 w-full flex justify-between items-center">
            {/* Logo */}
            <div className="logo text-[24px] xl:text-[42px] pl-1 xl:pl-8">
              <Link
                className="flex font-bold transition-all duration-500 ease-in-out"
                to="/"
                onClick={() => handleNavClick("/")}
              >
                <AnimatedText
                  text="Žvinklys"
                  textColor="text-header"
                  duration={0.25}
                  delay={0.25}
                  delayChildren={0.7}
                  enableHover={false}
                  letterSpacing={
                    responsive.isTablet || responsive.isMobile
                      ? "px-[4px]"
                      : "px-[10px]"
                  }
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <ul
              className={`${
                responsive.isMobile || responsive.isTablet ? "hidden" : "flex"
              } nav-links relative z-[1000] items-center gap-0 lg:gap-4 pr-8`}
              onMouseLeave={() => moveUnderlineTo(location.pathname)}
            >
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
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`${
          !responsive.isMobile && !responsive.isTablet ? "hidden" : "flex"
        } fixed right-2 top-0 z-[1000] w-10 h-10 flex-col justify-center items-center gap-1.5 mix-blend-difference`}
        aria-label="Toggle menu"
      >
        <Motion.span
          className="w-6 h-0.5 bg-white origin-center block"
          initial={{ opacity: 0, y: 10 }}
          animate={
            isMenuOpen
              ? { opacity: 1, x: 0, rotate: 45, y: 8 }
              : { opacity: 1, x: 0, rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        <Motion.span
          className="w-6 h-0.5 bg-white block"
          initial={{ opacity: 0, y: 0 }}
          animate={
            isMenuOpen
              ? { y: 10, opacity: 0, scaleX: 0 }
              : { y: 0, opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.2, delay: 0.15 }}
        />
        <Motion.span
          className="w-6 h-0.5 bg-white origin-center block"
          initial={{ opacity: 0, y: -10 }}
          animate={
            isMenuOpen
              ? { opacity: 1, x: 0, rotate: -45, y: -8 }
              : { opacity: 1, x: 0, rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (responsive.isMobile || responsive.isTablet) && (
          <Motion.div
            {...Animate(overlay)}
            className="fixed top-0 left-0 w-full h-[100dvh] bg-black z-[999] flex flex-col justify-center items-center"
          >
            <nav className={`flex flex-col ${responsive.isLandscape ? "gap-4" : "gap-8"} text-center`}>
              {navItems.map((item, i) => (
                <Motion.div key={item.path} custom={i} {...Animate(linkItem)}>
                  <Link
                    className={`text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-widest ${
                      isActive(item.path) ? "italic text-accent" : "text-muted opacity-80"
                    }`}
                    to={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }}
                  >
                    {item.label}
                  </Link>
                </Motion.div>
              ))}
            </nav>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
