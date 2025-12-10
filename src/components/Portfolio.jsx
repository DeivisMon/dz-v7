import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { TfiLayoutWidthFull, TfiLayoutColumn2, TfiLayoutColumn3 } from "react-icons/tfi";
import data from "./Items.json";
import { useDeviceType } from "./hooks/useDeviceType";


const items = data.items;

const FilterButton = ({ filter, isActive, onClick, index }) => {
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);
  

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
        delay: 0.5 + index * 0.1,
        ease: 'power3.out',
      }
    );
  }, [index]);

  useEffect(() => {
    const spans = h1Ref.current?.querySelectorAll('span');
    if (spans) {
      gsap.to(spans, {
        fontSize: isActive ? '100px' : '75px',
        stagger: 0.01,
        duration: 0.4,
        ease: 'power3.inOut',
      });
    }
  }, [isActive]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleWheel = (e) => {
      const scrollContainer = document.querySelector('.scrollable-container');
      if (scrollContainer) {
        const event = new WheelEvent('wheel', {
          deltaY: e.deltaY,
          deltaMode: e.deltaMode,
          bubbles: true
        });
        scrollContainer.dispatchEvent(event);
      }
    };

    button.addEventListener('wheel', handleWheel, { passive: true });
    return () => button.removeEventListener('wheel', handleWheel);
  }, []);

  const renderTitle = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="relative">
        {char}
      </span>
    ));
  };

  return (
    <div
      ref={buttonRef}
      className={`w-max flex items-end cursor-pointer mb-8 pb-2 pr-8 pointer-events-auto`}
      style={{ height: '100px' }}
      onClick={onClick}
    >
      <p
        className={`relative ${
          isActive ? 'bottom-6' : 'bottom-2'
        } px-2 text-xl font-medium text-white`}
      >
        ({filter.count})
      </p>
      <h1 ref={h1Ref} className={`leading-[80%] filter-${filter.id}`}>
        {renderTitle(filter.label)}
      </h1>
      <style jsx>{`
        .filter-${filter.id} span {
          text-transform: uppercase;
          font-size: 75px;
          color: ${isActive ? '#fb5eff' : '#fff'};
          transition: color 0.3s;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
};

export default function PortolioGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [imageHeights, setImageHeights] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  const [columnLayout, setColumnLayout] = useState(2);
  const itemsRef = useRef(null);
  const lenisRef = useRef(null);
  const lightboxRef = useRef(null);
  const isAnimating = useRef(false);
  const mobileMenuRef = useRef(null);
  const layoutMenuRef = useRef(null);
  const filterButtonRef = useRef(null);
  const layoutButtonRef = useRef(null);
  const currentImageRef = useRef(null);
  const layoutIconsRef = useRef([]);
  const _touchState = useRef({
    startX: 0,
    startY: 0,
    isSwiping: false
  });
  const { isMobile } = useDeviceType();

  useEffect(() => {
  if (!lightboxImage || !lightboxRef.current) return;

  const touchState = _touchState.current;
  const lightbox = lightboxRef.current;

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchState.startX = t.clientX;
    touchState.startY = t.clientY;
    touchState.isSwiping = false;
  };

  const onTouchMove = (e) => {
    if (isAnimating.current) return;

    const t = e.touches[0];
    const dx = t.clientX - touchState.startX;
    const dy = t.clientY - touchState.startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault(); 
      touchState.isSwiping = true;
    }
  };

  const onTouchEnd = () => {
    if (!touchState.isSwiping) return;

    const dx = touchState.startX - event.changedTouches[0].clientX;

    if (dx > 50) {
      navigateLightbox(1);
    }
    if (dx < -50) {
      navigateLightbox(-1);
    }
  };

  lightbox.addEventListener("touchstart", onTouchStart, { passive: false });
  lightbox.addEventListener("touchmove", onTouchMove, { passive: false });
  lightbox.addEventListener("touchend", onTouchEnd);

  return () => {
    lightbox.removeEventListener("touchstart", onTouchStart);
    lightbox.removeEventListener("touchmove", onTouchMove);
    lightbox.removeEventListener("touchend", onTouchEnd);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [lightboxImage]);

useEffect(() => {
  if (lightboxImage) {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  } else {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  return () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };
}, [lightboxImage]);

  useEffect(() => {
    if (!itemsRef.current) return;

    const lenis = new Lenis({
      wrapper: itemsRef.current,
      content: itemsRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const filters = [
    { id: 'all', label: 'Visi', count: 34 },
    { id: 'mergos', label: 'Mergos', count: 13 },
    { id: 'menas', label: 'Menas', count: 11 },
    { id: 'koncertai', label: 'Koncai', count: 10 },
  ];

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

  const getFilteredItems = () => {
    if (activeFilter === 'all') return items;
    return items.filter(item => item.tag.includes(activeFilter));
  };

  const openLightbox = (img, index) => {
    setLightboxImage(img);
    setLightboxIndex(index);
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  };

  const closeLightbox = () => {
    gsap.to(lightboxRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setLightboxImage(null);
        setLightboxIndex(null);
        if (lenisRef.current) {
          lenisRef.current.start();
        }
      }
    });
  };

  const navigateLightbox = (direction) => {
    if (isAnimating.current) return;
    
    const filtered = getFilteredItems();
    let newIndex = lightboxIndex + direction;
    
    if (newIndex < 0) newIndex = filtered.length - 1;
    if (newIndex >= filtered.length) newIndex = 0;
    
    const newImage = filtered[newIndex].img;
    
    isAnimating.current = true;
    
    const imgElement = currentImageRef.current;
    if (!imgElement) return;
    
    gsap.to(imgElement, {
      x: direction === 1 ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        imgElement.src = newImage;
        setLightboxImage(newImage);
        setLightboxIndex(newIndex);
        
        gsap.set(imgElement, {
          x: direction === 1 ? 100 : -100,
          opacity: 0
        });
        
        imgElement.onload = () => {
          gsap.to(imgElement, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating.current = false;
              imgElement.onload = null;
            }
          });
        };
        
        if (imgElement.complete) {
          imgElement.onload();
        }
      }
    });
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e) => {
      if (isAnimating.current) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxImage, lightboxIndex]);

  const hasAnimatedIn = useRef(false);
  
  useEffect(() => {
    if (lightboxImage && lightboxRef.current && !hasAnimatedIn.current) {
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      hasAnimatedIn.current = true;
    }
    
    if (!lightboxImage) {
      hasAnimatedIn.current = false;
    }
  }, [lightboxImage]);

  const handleFilterClick = (filterId) => {
    if (filterId === activeFilter) {
      // Close menu if clicking same filter
      openFilterMenu();
      return;
    }

    gsap.to(itemsRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        setActiveFilter(filterId);
        openFilterMenu(); // Close the menu with animation
        gsap.to(itemsRef.current, {
          opacity: 1,
          duration: 0.25,
        });
      },
    });
  };

  const handleLayoutChange = (columns) => {
    if (columns === columnLayout) return;
    
    const icons = layoutIconsRef.current.filter(Boolean);
    gsap.to(icons, {
      x: -50,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        setColumnLayout(columns);
        setLayoutMenuOpen(false);
        
        setTimeout(() => {
          const selectedIcon = layoutIconsRef.current[columns - 1];
          if (selectedIcon) {
            gsap.fromTo(selectedIcon,
              { x: 50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
          }
        }, 50);
      }
    });
  };

  const openFilterMenu = () => {
    if (mobileMenuOpen) {
      const menuItems = mobileMenuRef.current?.querySelectorAll('button');
      if (menuItems) {
        gsap.to(menuItems, {
          x: 50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in',
          onComplete: () => {
            setMobileMenuOpen(false);
          }
        });
      }
    } else {
      setMobileMenuOpen(true);
      setLayoutMenuOpen(false);
      
      setTimeout(() => {
        const menuItems = mobileMenuRef.current?.querySelectorAll('button');
        if (menuItems) {
          gsap.fromTo(menuItems,
            { x: 50, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.4, 
              stagger: 0.1,
              ease: 'back.out(1.7)'
            }
          );
        }
      }, 50);
    }
  };

  const openLayoutMenu = () => {
    if (layoutMenuOpen) {
      const icons = layoutIconsRef.current.filter(Boolean);
      gsap.to(icons, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          setLayoutMenuOpen(false);
        }
      });
    } else {
      setLayoutMenuOpen(true);
      setMobileMenuOpen(false);
      
      setTimeout(() => {
        const icons = layoutIconsRef.current.filter(Boolean);
        gsap.fromTo(icons,
          { x: 50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.1,
            ease: 'back.out(1.7)'
          }
        );
      }, 50);
    }
  };

  const renderItems = () => {
    const filtered = getFilteredItems();
    const columns = Array.from({ length: columnLayout }, () => []);
    const columnHeights = Array(columnLayout).fill(0);

    filtered.forEach((item, i) => {
      const originalIndex = items.indexOf(item);
      const aspectRatio = imageHeights[originalIndex] || 1.25;
      const height = 400 * aspectRatio;

      const itemElement = (
        <div key={i} className="pb-1 cursor-pointer" onClick={() => openLightbox(item.img, i)}>
          <div className="w-full group overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-auto object-cover transition-all duration-300 ease-in group-hover:blur-[1px] md:group-hover:scale-108"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      );

      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[minHeightIndex].push(itemElement);
      columnHeights[minHeightIndex] += height;
    });

    return columns;
  };

  const columns = renderItems();

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Desktop Filters */}
      <div className={`${isMobile ? "hidden" : "flex"} fixed top-0 right-0 w-1/2 h-screen pb-32 flex-col justify-end items-end z-10 mix-blend-difference pointer-events-none`}>
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

      {/* Mobile Control Buttons Container */}
      <div className={`${!isMobile ? "hidden" : "flex"} fixed top-10 left-0 w-full z-20 bg-black py-4 gap-2 items-center`}>
        {/* Layout Button and Menu */}
        <div  ref={layoutButtonRef}
            onClick={openLayoutMenu} className="fixed top-10 left-4 flex items-center gap-2">
          <button
            className="px-2 py-1 bg-black flex items-center justify-center text-white transition-colors hover:bg-white/20"
          >
            Layout
          </button>

          {/* Current Layout Icon - Always visible */}
          {!layoutMenuOpen && (
            <div 
              ref={el => layoutIconsRef.current[columnLayout - 1] = el}
              className="w-8 h-8 flex items-center justify-center text-white"
            >
              {columnLayout === 1 && <TfiLayoutWidthFull />}
              {columnLayout === 2 && <TfiLayoutColumn2 />}
              {columnLayout === 3 && <TfiLayoutColumn3 />}
            </div>
          )}

          {/* All Layout Options - Shown when menu is open */}
          {layoutMenuOpen && (
            <div className="flex gap-2">
              <button
                ref={el => layoutIconsRef.current[0] = el}
                onClick={() => handleLayoutChange(1)}
                className={`flex items-center justify-center w-8 h-8 transition-colors ${
                  columnLayout === 1 
                    ? 'text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={{ opacity: 0 }}
              >
                <TfiLayoutWidthFull />
              </button>
              
              <button
                ref={el => layoutIconsRef.current[1] = el}
                onClick={() => handleLayoutChange(2)}
                className={`flex items-center justify-center w-8 h-8 transition-colors ${
                  columnLayout === 2 
                    ? 'text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={{ opacity: 0 }}
              >
                <TfiLayoutColumn2 />
              </button>
              
              <button
                ref={el => layoutIconsRef.current[2] = el}
                onClick={() => handleLayoutChange(3)}
                className={`flex items-center justify-center w-8 h-8 transition-colors ${
                  columnLayout === 3 
                    ? 'text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={{ opacity: 0 }}
              >
                <TfiLayoutColumn3 />
              </button>
            </div>
          )}
        </div>

        {/* Filter Button and Menu */}
        <div ref={filterButtonRef}
            onClick={openFilterMenu} className="flex items-center justify-end gap-2">
          {/* Current Filter - Always visible */}
          {!mobileMenuOpen && (
            <div className="fixed right-18 flex justify-center font-bold text-pink-500 text-sm">
              {filters.find(f => f.id === activeFilter)?.label}
            </div>
          )}

          <button
            
            className="fixed top-10 right-4 px-2 py-1 bg-black flex items-center justify-center text-white transition-colors hover:bg-white/20"
          >
            Filter
          </button>

          {/* Filter Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="fixed top-14 right-0 flex flex-col items-end w-[100px] bg-black mt-4 gap-2"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`py-1 px-3 transition-colors ${
                    activeFilter === filter.id
                      ? 'text-pink-500'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  style={{ opacity: 0 }}
                >
                  <span className="text-sm">{filter.label}</span>
                  <span className="ml-1 text-xs opacity-60">({filter.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay to prevent clicking images when menus are open - Mobile only */}
      {isMobile && (mobileMenuOpen || layoutMenuOpen) && (
        <div 
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => {
            if (mobileMenuOpen) openFilterMenu();
            if (layoutMenuOpen) openLayoutMenu();
          }}
        />
      )}

      <div
        ref={itemsRef}
        className="absolute top-0 left-0 w-full h-full p-1 flex gap-1 overflow-y-auto scrollable-container"
      >
        <div className={`${!isMobile ? "w-3/4" : "w-full"} ${isMobile ? "mt-10" : "mt-10"} h-max flex gap-1 max-md:w-full ${
          columnLayout === 1 ? 'max-md:flex-col' : ''
        }`}>
          {columns.map((column, index) => (
            <div 
              key={index} 
              className={`h-max mt-[5vh] ${
                columnLayout === 1 ? 'flex-1' :
                columnLayout === 2 ? 'flex-1' :
                columnLayout === 3 ? 'flex-1' : ''
              } ${
                columnLayout < 3 && index >= columnLayout ? 'hidden' : ''
              }`}
            >
              {column}
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
      </div>


      {/* Lightbox */}
      {lightboxImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center pointer-events-auto"
          style={{
            touchAction: "none",        
            overscrollBehavior: "none",
          }}
        >
          <div
            className="cursor-trigger absolute left-0 top-0 w-1/3 h-full z-10"
            data-cursor-type="prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
          />

          <div
            className="cursor-trigger absolute left-1/3 top-0 w-1/3 h-full z-10"
            data-cursor-type="close"
            onClick={closeLightbox}
          />

          <div
            className="cursor-trigger absolute right-0 top-0 w-1/3 h-full z-10"
            data-cursor-type="next"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
          />

          <img
            ref={currentImageRef}
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain pointer-events-none relative z-1"
          />

          <div className="absolute bottom-8 text-white text-lg mix-blend-difference pointer-events-none z-20">
            {lightboxIndex + 1} / {getFilteredItems().length}
          </div>
        </div>
      )}
    </div>
  );
}