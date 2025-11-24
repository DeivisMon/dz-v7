import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import AnimatedText from "./utils/AnimatedText";

export default function NavBar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const menuLinksRef = useRef([]);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Reset refs array
    menuLinksRef.current = [];
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Open animation
      const tl = gsap.timeline();
      
      // Animate overlay in
      tl.to(overlayRef.current, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.8,
        ease: "power4.inOut"
      });

      // Stagger animate links
      tl.fromTo(
        menuLinksRef.current,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        },
        "-=0.4"
      );
    } else if (overlayRef.current && menuLinksRef.current.length > 0) {
      // Close animation - only if menu links exist
      const tl = gsap.timeline();
      
      // Animate links out
      tl.to(menuLinksRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in"
      });

      // Animate overlay out
      tl.to(overlayRef.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.6,
        ease: "power4.inOut"
      }, "-=0.1");
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`navbar fixed z-[150] top-0 left-0 w-full flex px-2 md:px-8 m-0 transition-all mix-blend-difference duration-700 ease-in-out select-none`}
      >
        <div className={`w-full flex justify-between items-center`}>

         {/* Logo */}
        <div className="logo text-black text-[24px] lg:text-[48px] h-full">
          <Link
            className={`font-bold transition-all duration-500 ease-in-out`}
            to="/"
            onClick={closeMenu}
          >
            <AnimatedText
              text="Žvinklys"
              duration={0.75}
              delayChildren={1}
              enableHover={false}
              letterSpacing="px-[3px]"
              key={location.pathname}
            />
          </Link>
        </div>

          {/* Desktop Navigation */}
          <div
            className={`nav-links relative z-1 nav-item hidden md:flex items-center gap-0 lg:gap-4 font-bold text-[20px] backdrop-blur transition-all duration-500 ease-in-out`}
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden relative z-[160] w-10 h-10 flex flex-col justify-center items-center gap-1.5`}
            
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
        </div>

       
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed top-0 left-0 w-full h-screen bg-black z-[140] flex flex-col justify-center items-center md:hidden"
        style={{
          clipPath: "circle(0% at 100% 0%)"
        }}
      >
        <nav className="flex flex-col gap-8 text-center">
          <Link
            ref={(el) => (menuLinksRef.current[0] = el)}
            className={`text-5xl font-bold tracking-widest text-white ${
              isActive("/") ? "italic" : "opacity-85"
            }`}
            to="/"
            onClick={closeMenu}
          >
            Index
          </Link>
          <Link
            ref={(el) => (menuLinksRef.current[1] = el)}
            className={`text-5xl font-bold tracking-widest text-white ${
              isActive("/portfolio") ? "italic" : "opacity-85"
            }`}
            to="/portfolio"
            onClick={closeMenu}
          >
            Portfolio
          </Link>
          <Link
            ref={(el) => (menuLinksRef.current[2] = el)}
            className={`text-5xl font-bold tracking-widest text-white ${
              isActive("/contact") ? "italic" : "opacity-85"
            }`}
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}