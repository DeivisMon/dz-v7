import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import gsap from "gsap";
import { motion as Motion } from "framer-motion";
import Lenis from "lenis";
import {
  TfiLayoutWidthFull,
  TfiLayoutColumn2,
  TfiLayoutColumn3,
} from "react-icons/tfi";
import { galleryData } from "./galleryData";
import { useResponsive } from "./hooks/useResopnsive";
import { useClickOutside } from "./hooks/useClickOutside";
import ScrollProgressBar from "./utils/ProgressBar";
import ScrollTop from "./utils/ScrollTop";

// function shuffleArray(array) {
//   const arr = [...array];
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// const items = shuffleArray(galleryData);

const items = galleryData.slice(0, 20);

const FilterButton = ({ filter, isActive, onClick, index }) => {
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    btn.style.pointerEvents = "none";

    gsap.delayedCall(1, () => {
      btn.style.pointerEvents = "auto";
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 1.175 + index * 0.1,
        ease: "power3.inOut",
      },
    );
  }, [index]);

  useEffect(() => {
    if (!counterRef.current) return;

    gsap.set(counterRef.current, {
      opacity: 0,
      y: 50,
    });
  }, []);

  useEffect(() => {
    const spans = h1Ref.current?.querySelectorAll("span");
    const counter = counterRef.current;

    if (!spans || !counter) return;

    if (spans) {
      gsap.to(spans, {
        fontSize: isActive ? "64px" : "56px",
        stagger: 0.025,
        duration: 0.4,
        ease: "expo.inOut",
      });

      gsap.to(counter, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 50,
        duration: 0.4,
        delay: 0.25,
        ease: "expo.inOut",
      });
    }
  }, [isActive]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleWheel = (e) => {
      const scrollContainer = document.querySelector(".scrollable-container");
      if (scrollContainer) {
        const event = new WheelEvent("wheel", {
          deltaY: e.deltaY,
          deltaMode: e.deltaMode,
          bubbles: true,
        });
        scrollContainer.dispatchEvent(event);
      }
    };

    button.addEventListener("wheel", handleWheel, { passive: true });
    return () => button.removeEventListener("wheel", handleWheel);
  }, []);

  const renderTitle = (text) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={`relative inline-block uppercase font-bold tracking-[0.2em] transition-colors duration-300 ${
          isActive ? "text-accent border-gray-600 border-b" : "text-text"
        }`}
      >
        {char}
      </span>
    ));
  };

  return (
    <div
      ref={buttonRef}
      className={`cursor-trigger relative h-full cursor-pointer pr-4 pointer-events-auto`}
      data-cursor-type="link"
      style={{ height: "100px" }}
      onClick={onClick}
    >
      <h1
        ref={h1Ref}
        className={`inline-block uppercase  ${
          isActive ? "border-b border-muted" : ""
        }`}
      >
        {renderTitle(filter.label)}
      </h1>
      <p
        ref={counterRef}
        className="absolute -right-2 top-[105px] transform -translate-y-1/2 px-2 text-xl font-medium text-muted tracking-[0.8em] pointer-events-none"
      >
        ({filter.count})
      </p>
    </div>
  );
};

export default function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageHeights, setImageHeights] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  const [columnLayout, setColumnLayout] = useState(2);
  const responsive = useResponsive();

  // Refs
  const itemsRef = useRef(null);
  const lenisRef = useRef(null);
  const lightboxRef = useRef(null);
  const currentImageRef = useRef(null);
  const isAnimating = useRef(false);
  const mobileMenuRef = useRef(null);
  const layoutIconsRef = useRef([]);
  const hasAnimatedIn = useRef(false);
  const menuWrapperRef = useRef(null);

  // Touch swipe state for lightbox
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  // Initialize Lenis
  useEffect(() => {
    if (!itemsRef.current) return;

    const lenis = new Lenis({
      wrapper: itemsRef.current,
      content: itemsRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useClickOutside(
  [menuWrapperRef],
  () => {
    if (mobileMenuOpen) {
      animateFilterMenuOut(() => setMobileMenuOpen(false));
    }
    if (layoutMenuOpen) {
      animateLayoutMenuOut(() => setLayoutMenuOpen(false));
    }
  }
);

  const filters = [
    { id: "all", label: "Visi", count: items.length },
    {
      id: "fotosesijos",
      label: "Fotosesijos",
      count: items.filter((i) => i.tag.includes("fotosesijos")).length,
    },
    {
      id: "menas",
      label: "Juoda/Balta",
      count: items.filter((i) => i.tag.includes("menas")).length,
    },
    {
      id: "renginiai",
      label: "Renginiai",
      count: items.filter((i) => i.tag.includes("renginiai")).length,
    },
  ];

  // Load image heights
  useEffect(() => {
    const loadImageHeights = async () => {
      const heights = {};
      const promises = items.map((item, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            heights[index] = img.height / img.width;
            resolve();
          };
          img.onerror = () => {
            heights[index] = 1.25;
            resolve();
          };
          img.src = item.img;
        });
      });
      await Promise.all(promises);
      setImageHeights(heights);
    };
    loadImageHeights();
  }, []);

  // Trigger resize when images load
  useEffect(() => {
    if (Object.keys(imageHeights).length === 0) return;

    // Wait for DOM to update, then resize multiple times to ensure accuracy
    const timeouts = [0, 100, 300, 600].map((delay) =>
      setTimeout(() => lenisRef.current?.resize(), delay),
    );

    return () => timeouts.forEach(clearTimeout);
  }, [imageHeights]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.tag.includes(activeFilter));
  }, [activeFilter]);

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnLayout }, () => []);
    const columnHeights = Array(columnLayout).fill(0);

    filteredItems.forEach((item, i) => {
      const originalIndex = items.indexOf(item);
      const aspectRatio = imageHeights[originalIndex] || 1.25;
      const height = 400 * aspectRatio;

      const itemElement = (
        <div
          key={`${item.img}-${i}`}
          className="cursor-pointer"
          onClick={() => openLightbox(item.img, i)}
        >
          <div className="w-full group overflow-hidden m-1">
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="cursor-trigger w-full h-auto object-cover transition-all duration-300 ease-in group-hover:blur-[1px] md:group-hover:scale-105"
              style={{ display: "block" }}
              data-cursor-type="expand"
            />
          </div>
        </div>
      );

      // Find shortest column
      const minIndex = columnHeights.indexOf(Math.min(...columnHeights));
      cols[minIndex].push(itemElement);
      columnHeights[minIndex] += height;
    });

    return cols;
  }, [filteredItems, columnLayout, imageHeights]);

  const galleryContent = (
    <div
      className={`${
        responsive.isMobile || responsive.isTablet ? "w-full" : "w-3/4"
      } mb-32 h-max flex gap-1 transition-all duration-300 ${
        columnLayout === 1 ? "flex-col " : ""
      }`}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className={`${
            columnLayout === 1
              ? "w-full"
              : columnLayout === 2
                ? "flex-1 min-w-0"
                : "flex-1 min-w-0"
          }`}
        >
          {column}
        </div>
      ))}
    </div>
  );

  const openLightbox = (img, index) => {
    setLightboxImage(img);
    setLightboxIndex(index);
    lenisRef.current?.stop();
  };

  const closeLightbox = () => {
    gsap.to(lightboxRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setLightboxImage(null);
        setLightboxIndex(null);
        lenisRef.current?.start();
      },
    });
  };

  const navigateLightbox = (direction) => {
    if (isAnimating.current) return;

    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;

    const newImage = filteredItems[newIndex].img;
    isAnimating.current = true;
    const imgElement = currentImageRef.current;
    if (!imgElement) return;

    gsap.to(imgElement, {
      x: direction === 1 ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        imgElement.src = newImage;
        setLightboxImage(newImage);
        setLightboxIndex(newIndex);
        gsap.set(imgElement, { x: direction === 1 ? 100 : -100, opacity: 0 });

        imgElement.onload = () => {
          gsap.to(imgElement, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              isAnimating.current = false;
              imgElement.onload = null;
            },
          });
        };
        if (imgElement.complete) imgElement.onload();
      },
    });
  };

  // Touch swipe handlers for lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    // Check if horizontal swipe is more significant than vertical
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > minSwipeDistance
    ) {
      if (deltaX > 0) {
        // Swipe left - next image
        navigateLightbox(1);
      } else {
        // Swipe right - previous image
        navigateLightbox(-1);
      }
    } else if (Math.abs(deltaY) > minSwipeDistance && deltaY > 0) {
      // Swipe up - close lightbox
      closeLightbox();
    }

    // Reset values
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
  };

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e) => {
      if (isAnimating.current) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, lightboxIndex]);

  useEffect(() => {
    if (lightboxImage && lightboxRef.current && !hasAnimatedIn.current) {
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      hasAnimatedIn.current = true;
    }
    if (!lightboxImage) hasAnimatedIn.current = false;
  }, [lightboxImage]);


// Filter Menu
useLayoutEffect(() => {
  if (mobileMenuOpen) {
    const menuItems = mobileMenuRef.current?.querySelectorAll("button");
    if (menuItems?.length) {
      gsap.killTweensOf(menuItems);
      gsap.set(menuItems, { y: -50, opacity: 0 });
      gsap.to(menuItems, {
        y: 0,
        opacity: 1,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.out",
      });
    }
  }
}, [mobileMenuOpen]);

const animateFilterMenuOut = useCallback((onComplete) => {
  const menuItems = mobileMenuRef.current?.querySelectorAll("button");
  if (menuItems?.length) {
    gsap.killTweensOf(menuItems);
    gsap.to(menuItems, {
      y: -50,
      opacity: 0,
      duration: 0.25,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(menuItems, { clearProps: "all" });
        onComplete?.();
      },
    });
  } else {
    onComplete?.();
  }
}, []);

const handleFilterClick = useCallback(
  (filterId) => {
    if (filterId === activeFilter) return;
    setActiveFilter(filterId);

    if (mobileMenuOpen) {
      animateFilterMenuOut(() => setMobileMenuOpen(false));
    }
    gsap.to(itemsRef.current, {
      opacity: 0,
      y: 40,
      duration: 0,
      ease: "power2.out",
      onComplete: () => {
        lenisRef.current?.scrollTo(0, { immediate: true });
        requestAnimationFrame(() => lenisRef.current?.resize());
        gsap.to(itemsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.inOut", 
        });
      },
    });
  },
  [activeFilter, mobileMenuOpen, animateFilterMenuOut],
);

const openFilterMenu = useCallback(() => {
  if (mobileMenuOpen) {
    animateFilterMenuOut(() => setMobileMenuOpen(false));
  } else {
    setLayoutMenuOpen(false);
    setMobileMenuOpen(true);
  }
}, [mobileMenuOpen, animateFilterMenuOut]);


// Layout Menu
useLayoutEffect(() => {
  if (layoutMenuOpen) {
    const icons = layoutIconsRef.current.filter(Boolean);

    if (icons?.length) {
      gsap.killTweensOf(icons);
      gsap.set(icons, { x: -10, opacity: 0 });

      gsap.to(icons, {
        x: 0,
        opacity: 1,
        duration: 0.25,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }
}, [layoutMenuOpen]);

const animateLayoutMenuOut = useCallback((onComplete) => {
  const icons = layoutIconsRef.current.filter(Boolean);

  if (icons?.length) {
    gsap.killTweensOf(icons);
    gsap.to(icons, {
      x: -10,
      opacity: 0,
      duration: 0.25,
      stagger: 0.1,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(icons, { clearProps: "all" });
        onComplete?.();
      },
    });
  } else {
    onComplete?.();
  }
}, []);

const handleLayoutChange = useCallback(
  (newColumns) => {
    if (newColumns === columnLayout) return;

    const runLayoutChange = () => {
      gsap.to(itemsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0,
        onComplete: () => {
          setColumnLayout(newColumns);
          lenisRef.current?.scrollTo(0, { immediate: true });
          requestAnimationFrame(() => lenisRef.current?.resize());

          gsap.to(itemsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.inOut",
          });
        },
      });
    };

    if (layoutMenuOpen) {
      animateLayoutMenuOut(() => {
        setLayoutMenuOpen(false);
        runLayoutChange();
      });
    } else {
      runLayoutChange();
    }
  },
  [columnLayout, layoutMenuOpen, animateLayoutMenuOut]
);

const openLayoutMenu = useCallback(() => {
  if (layoutMenuOpen) {
    animateLayoutMenuOut(() => setLayoutMenuOpen(false));
  } else {
    setMobileMenuOpen(false);
    setLayoutMenuOpen(true);
  }
}, [layoutMenuOpen, animateLayoutMenuOut]);

  return (
    <div
      className={`w-full ${responsive.isMobile || responsive.isTablet ? "h-[calc(100dvh-38px)] mt-[38px]" : "h-[calc(100dvh-64px)] mt-16"} overflow-hidden relative bg-bckg`}
    >
      {/* Desktop Filters */}
      <div
        className={`${responsive.isMobile || responsive.isTablet ? "hidden" : "flex"} fixed top-0 right-0 w-1/2 h-screen flex-col justify-center items-end gap-8 z-10 mix-blend-difference pointer-events-none`}
      >
        {filters.map((filter, index) => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={activeFilter === filter.id}
            onClick={() => handleFilterClick(filter.id)}
            index={index}
          />
        ))}
      </div>

      {/* Mobile Controls */}
      <div
        ref={menuWrapperRef}
        className={`${responsive.isMobile || responsive.isTablet ? "flex" : "hidden"} relative w-full z-[888] bg-black items-center justify-between px-2 py-1`}
      >
        {/* Layout */}
        <div
          onClick={openLayoutMenu}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-white">Išdėstymas</span>
          {!layoutMenuOpen && (
            <Motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="w-8 h-8 flex items-center justify-center text-accent"
            >
              {columnLayout === 1 && <TfiLayoutWidthFull />}
              {columnLayout === 2 && <TfiLayoutColumn2 />}
              {columnLayout === 3 && <TfiLayoutColumn3 />}
            </Motion.div>
          )}
          {layoutMenuOpen && (
            <div className="flex gap-1">
              {[1, 2, 3].map((col) => (
                <button
                  key={col}
                  ref={(el) => (layoutIconsRef.current[col - 1] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLayoutChange(col);
                  }}
                  className={`mobile-layout-item w-9 h-9 flex items-center justify-center transition-all ${
                    columnLayout === col
                      ? "text-accent scale-110 border-b-2 rounded-xs"
                      : "text-white/60"
                  }`}
                >
                  {col === 1 && <TfiLayoutWidthFull />}
                  {col === 2 && <TfiLayoutColumn2 />}
                  {col === 3 && <TfiLayoutColumn3 />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div
          onClick={openFilterMenu}
          className="flex items-center gap-1 cursor-pointer"
        >
          {!mobileMenuOpen && (
            <Motion.div
              key={activeFilter}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-accent text-sm"
            >
              {filters.find((f) => f.id === activeFilter)?.label}
            </Motion.div>
          )}
          <button className="px-2 py-2 bg-black text-white">Filtras</button>
        </div>
      </div>

      {/* Mobile Filter Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-[76px] right-0 flex flex-col items-end w-[165px] bg-black/95 backdrop-blur-md z-30 rounded py-2"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`mobile-filter-item w-full text-right px-5 py-2.5 transition-all ${
                activeFilter === filter.id ? "text-accent" : "text-white"
              }`}
            >
              {filter.label}{" "}
              <span className="opacity-50">({filter.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay */}
      {(mobileMenuOpen || layoutMenuOpen) && (
        <div
          className="fixed inset-0 z-20 bg-black/0"
          onClick={() => {
            if (mobileMenuOpen) openFilterMenu();
            if (layoutMenuOpen) openLayoutMenu();
          }}
        />
      )}

      {/* Gallery */}
      <div
        ref={itemsRef}
        className="w-full h-full overflow-y-auto scrollable-container"
      >
        {galleryContent}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur flex items-center justify-center pointer-events-auto overflow-hidden"
          style={{ touchAction: "none", overscrollBehavior: "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="cursor-trigger absolute left-0 top-0 w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
            data-cursor-type="prev"
          />
          <div
            className="cursor-trigger absolute top-0 w-1/3 h-full"
            onClick={closeLightbox}
            data-cursor-type="close"
          />
          <div
            className="cursor-trigger absolute right-0 top-0 w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
            data-cursor-type="next"
          />
          <img
            ref={currentImageRef}
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-[95vw] max-h-[89vh] w-auto h-auto object-contain pointer-events-none relative"
          />
          <div className="absolute -bottom-1 text-white text-lg mix-blend-difference pointer-events-none">
            {lightboxIndex + 1} / {filteredItems.length}
          </div>

          {/* Visual swipe indicators for mobile */}
          {responsive.isMobile && (
            <>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-[50px] mix-blend-difference pointer-events-none z-20">
                ‹
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 text-[50px] mix-blend-difference pointer-events-none z-20">
                ›
              </div>
            </>
          )}
        </div>
      )}

      {lenisRef.current && (
        <ScrollProgressBar
          lenis={lenisRef.current}
          position="bottom"
          backgroundColor="bg-gray-700/50"
          progressColor="bg-gradient-to-r from-white via-black to-white"
        />
      )}
      <ScrollTop lenis={lenisRef.current} />
    </div>
  );
}
