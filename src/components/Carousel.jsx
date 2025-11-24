import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ✅ Import images so Vite can bundle them
import img1 from "../assets/img1.avif";
import img2 from "../assets/img2.avif";
import img3 from "../assets/img3.avif";
import img4 from "../assets/img4.avif";
import img5 from "../assets/img5.avif";
import img6 from "../assets/img6.avif";
import img7 from "../assets/img7.avif";
import img8 from "../assets/img8.avif";
import img9 from "../assets/img9.avif";
import img10 from "../assets/img10.avif";
import img11 from "../assets/img11.avif";
import img12 from "../assets/img12.avif";
import img13 from "../assets/img13.avif";
import img14 from "../assets/img14.avif";
import img15 from "../assets/img15.avif";

const images = [
  img1, img2, img3, img4, img5,
  img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15,
];

export default function Carousel() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const isAnimating = useRef(false);
  const autoplayTimeout = useRef(null);
  const slidesRef = useRef([]);
  const currentSlide = useRef(0);
  
  // Touch handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = images.length;

  const updateIndicators = (index) => {
    const indicators = document.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, i) => {
      gsap.to(indicator, {
        scaleY: i === index ? 1.15 : 0.75,
        duration: 1.5,
        ease: "power4.inOut",
      });
    });
  };

  const changeSlide = (nextIndex) => {
    if (isAnimating.current || nextIndex === currentSlide.current) return;
    isAnimating.current = true;
    clearTimeout(autoplayTimeout.current);

    const currentSlideEl = slidesRef.current[currentSlide.current];
    const nextSlideEl = slidesRef.current[nextIndex];
    const currentImg = currentSlideEl.querySelector("img");
    const nextImg = nextSlideEl.querySelector("img");

    const direction =
      nextIndex > currentSlide.current ||
      (currentSlide.current === totalSlides - 1 && nextIndex === 0)
        ? "next"
        : "prev";

    gsap.set(nextSlideEl, {
      clipPath:
        direction === "prev"
          ? "polygon(0 0, 100% 0, 100% 0, 0 0)"
          : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      zIndex: 2,
      visibility: "visible",
    });
    gsap.set(nextImg, { scale: 2, top: "4em" });
    gsap.set(currentSlideEl, { zIndex: 1 });

    updateIndicators(nextIndex);

    const timeline = gsap.timeline({
      onComplete: () => {
        slidesRef.current.forEach((slide, i) => {
          if (i === nextIndex) {
            gsap.set(slide, {
              zIndex: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              visibility: "visible",
            });
          } else {
            gsap.set(slide, {
              zIndex: 0,
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              visibility: "visible",
            });
            const img = slide.querySelector("img");
            gsap.set(img, { scale: 2, top: "4em" });
          }
        });

        currentSlide.current = nextIndex;
        setCurrentSlideIndex(nextIndex);
        isAnimating.current = false;

        autoplayTimeout.current = setTimeout(() => {
          changeSlide((currentSlide.current + 1) % totalSlides);
        }, 4000);
      },
    });

    timeline
      .to(currentImg, { scale: 2, top: "4em", duration: 1.8, ease: "power4.inOut" }, 0)
      .to(nextSlideEl, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.8, ease: "power4.inOut" }, 0)
      .to(nextImg, { scale: 1, top: "0", duration: 1.8, ease: "power4.inOut" }, 0);
  };

  const handleArrowClick = (direction) => {
    if (isAnimating.current) return;
    clearTimeout(autoplayTimeout.current);
    if (direction === "next") {
      changeSlide((currentSlide.current + 1) % totalSlides);
    } else {
      changeSlide((currentSlide.current - 1 + totalSlides) % totalSlides);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (isAnimating.current) return;
    clearTimeout(autoplayTimeout.current);
    if (e.deltaY > 0) {
      changeSlide((currentSlide.current + 1) % totalSlides);
    } else {
      changeSlide((currentSlide.current - 1 + totalSlides) % totalSlides);
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isAnimating.current) return;
    
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      clearTimeout(autoplayTimeout.current);
      
      if (diff > 0) {
        // Swiped left - go to next
        changeSlide((currentSlide.current + 1) % totalSlides);
      } else {
        // Swiped right - go to previous
        changeSlide((currentSlide.current - 1 + totalSlides) % totalSlides);
      }
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      const img = slide.querySelector("img");
      if (index === 0) {
        gsap.set(slide, { zIndex: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", visibility: "visible" });
        gsap.set(img, { scale: 1, top: "0" });
      } else {
        gsap.set(slide, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", zIndex: 0, visibility: "visible" });
        gsap.set(img, { scale: 2, top: "4em" });
      }
    });

    autoplayTimeout.current = setTimeout(() => {
      changeSlide((currentSlide.current + 1) % totalSlides);
    }, 4000);

    window.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(autoplayTimeout.current);
    };
  }, []);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-screen h-screen">
        {images.map((src, index) => (
          <div
            key={index}
            ref={(el) => (slidesRef.current[index] = el)}
            className="carousel-slide absolute bottom-0 left-0 w-full h-full overflow-hidden"
            style={{
              clipPath: index === 0 ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              zIndex: index === 0 ? 1 : 0,
              visibility: "visible",
            }}
          >
            <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover will-change-transform" />
          </div>
        ))}
      </div>

      {/* Left Side */}
      <div onClick={() => handleArrowClick("prev")} className="cursor-trigger fixed left-0 top-1/2 -translate-y-1/2 z-10 w-1/4 h-full flex items-center px-8 transition-all duration-300 group" data-cursor-type="prev"></div>

      {/* Right Side */}
      <div onClick={() => handleArrowClick("next")} className="cursor-trigger fixed right-0 top-1/2 -translate-y-1/2 z-10 w-1/4 h-full flex items-center justify-end px-8 transition-all duration-300 group" data-cursor-type="next"></div>

      {/* Bottom Indicators */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 z-50 mix-blend-exclusion">
        {images.map((_, i) => (
          <div key={i}>
            <div
              onClick={() => changeSlide(i)}
              className={`carousel-indicator cursor-trigger h-16 w-2 mx-4 bg-white/80 rounded-full origin-center ${i === currentSlideIndex ? "scale-y-115" : "scale-y-75"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}