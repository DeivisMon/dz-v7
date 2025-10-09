import React, { useEffect } from "react";
import gsap from "gsap";

export default function Logo() {
  useEffect(() => {
    // ensure DOM is ready before animating
    gsap.set(".content", { autoAlpha: 1 });

    gsap.to(".nav-item a", {
      top: 0,
      stagger: 0.175,
      duration: 1.5,
      delay: 0.2,
      ease: "expo.inOut",
    });
  }, []); 

  return (
    <>
      {/* Content Overlay */}
      <div className="content relative w-full h-full z-100">
        <nav className="fixed top-0 w-full py-2 px-4 flex justify-start items-center">
          <div className="nav-item overflow-hidden">
            <a
              href=""
              className="relative top-[-100px] text-[38px] font-extrabold no-underline text-black capitalize opacity-100"
            >
              Darius Žvinklys |
            </a>
            <a
              href=""
              className="relative top-[-100px] text-[38px] font-extrabold no-underline text-black capitalize opacity-50"
            >
              {" "}Photography
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
