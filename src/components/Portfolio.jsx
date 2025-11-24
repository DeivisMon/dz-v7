import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { FaColumns, FaTh, FaThLarge, FaFilter } from 'react-icons/fa';
import data from "./Items.json";

const items = data.items;

const FilterButton = ({ filter, isActive, onClick, index }) => {
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);

  // Entrance animation on mount
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

export default function GodlyFilters() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [imageHeights, setImageHeights] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState('next');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  const [columnLayout, setColumnLayout] = useState(2); // 1, 2, or 3 columns
  const itemsRef = useRef(null);
  const lenisRef = useRef(null);
  const lightboxRef = useRef(null);
  const isAnimating = useRef(false);
  const mobileMenuRef = useRef(null);
  const layoutMenuRef = useRef(null);
  const filterButtonRef = useRef(null);
  const layoutButtonRef = useRef(null);

  // Initialize Lenis smooth scroll
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
    { id: 'koncertai', label: 'Koncertai', count: 10 },
  ];

  // Load image dimensions for masonry layout
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
            heights[index] = 1.25; // Default aspect ratio
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
    
    isAnimating.current = true;
    const currentDirection = direction === 1 ? 'next' : 'prev';
    
    // Animate out current image
    const imgElement = lightboxRef.current?.querySelector('img');
    if (imgElement) {
      gsap.to(imgElement, {
        x: direction === 1 ? -100 : 100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setSlideDirection(currentDirection);
          setLightboxIndex(newIndex);
          setLightboxImage(filtered[newIndex].img);
        }
      });
    }
  };

  // Animate in new image when it changes
  useEffect(() => {
    if (lightboxImage && lightboxRef.current && isAnimating.current) {
      requestAnimationFrame(() => {
        const imgElement = lightboxRef.current.querySelector('img');
        if (imgElement) {
          const startX = slideDirection === 'next' ? 100 : -100;
          gsap.fromTo(imgElement, 
            { x: startX, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.4, 
              ease: 'power2.out',
              onComplete: () => {
                isAnimating.current = false;
              }
            }
          );
        }
      });
    }
  }, [lightboxImage, slideDirection]);

  // Keyboard navigation
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
  }, [lightboxImage, lightboxIndex]);

  // Animate lightbox entrance on initial open
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
    if (filterId === activeFilter) return;

    gsap.to(itemsRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        setActiveFilter(filterId);
        setMobileMenuOpen(false);
        // Restore both buttons when filter is selected
        restoreBothButtons();
        gsap.to(itemsRef.current, {
          opacity: 1,
          duration: 0.25,
        });
      },
    });
  };

  const handleLayoutChange = (columns) => {
    setColumnLayout(columns);
    setLayoutMenuOpen(false);
    // Restore both buttons when layout is selected
    restoreBothButtons();
  };

  const openFilterMenu = () => {
    setMobileMenuOpen(true);
    setLayoutMenuOpen(false);
  };

  const openLayoutMenu = () => {
    setLayoutMenuOpen(true);
    setMobileMenuOpen(false);
  };

  // Function to restore both buttons to visible state
  const restoreBothButtons = () => {
    gsap.to(filterButtonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2
    });
    gsap.to(layoutButtonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2
    });
  };

  // Animate mobile menu with stagger - FIXED VERSION
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (mobileMenuOpen) {
        // Only hide the filter button, keep layout button visible
        gsap.to(filterButtonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2
        });

        // Ensure layout button is visible
        gsap.to(layoutButtonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2
        });

        // Show menu with stagger animation for items
        gsap.to(mobileMenuRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
          onComplete: () => {
            const menuItems = mobileMenuRef.current.querySelectorAll('button');
            gsap.fromTo(menuItems, 
              { 
                opacity: 0, 
                y: 20 
              },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                stagger: 0.1,
                ease: 'back.out(1.7)'
              }
            );
          }
        });
      } else {
        // Hide menu items with reverse stagger
        const menuItems = mobileMenuRef.current?.querySelectorAll('button');
        if (menuItems) {
          gsap.to(menuItems, {
            opacity: 0,
            y: -20,
            duration: 0.2,
            stagger: 0.05,
            ease: 'power2.in'
          });
        }

        // Hide menu
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          delay: 0.1,
          ease: 'power2.in',
          onComplete: () => {
            // Restore filter button when menu closes
            gsap.to(filterButtonRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.2
            });
          }
        });
      }
    }
  }, [mobileMenuOpen]);

  // Animate layout menu with scale in/out - FIXED VERSION
  useEffect(() => {
    if (layoutMenuRef.current) {
      if (layoutMenuOpen) {
        // Only hide the layout button, keep filter button visible
        gsap.to(layoutButtonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2
        });

        // Ensure filter button is visible
        gsap.to(filterButtonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2
        });

        // Show menu with scale animation
        gsap.fromTo(layoutMenuRef.current, 
          { 
            opacity: 0, 
            scale: 0 
          },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.3, 
            ease: 'back.out(1.7)'
          }
        );
      } else {
        // Hide menu
        gsap.to(layoutMenuRef.current, {
          opacity: 0,
          scale: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            // Restore layout button when menu closes
            gsap.to(layoutButtonRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.2
            });
          }
        });
      }
    }
  }, [layoutMenuOpen]);

  const renderItems = () => {
    const filtered = getFilteredItems();
    const columns = Array.from({ length: columnLayout }, () => []);
    const columnHeights = Array(columnLayout).fill(0);

    filtered.forEach((item, i) => {
      const originalIndex = items.indexOf(item);
      const aspectRatio = imageHeights[originalIndex] || 1.25;
      const height = 400 * aspectRatio;

      const itemElement = (
        <div key={i} className="pb-2 cursor-pointer" onClick={() => openLightbox(item.img, i)}>
          <div className="w-full overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      );

      // Add to shortest column for balanced masonry
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
      <div className="fixed top-0 right-0 w-1/2 h-screen pb-32 flex flex-col justify-end items-end z-10 mix-blend-difference pointer-events-none max-md:hidden">
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

      {/* Mobile Control Buttons - Positioned at top of gallery */}
      <div className="absolute top-4 right-4 z-20 md:hidden flex gap-2">
        {/* Filter Button */}
        <button
          ref={filterButtonRef}
          onClick={openFilterMenu}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-white/20"
        >
          <FaFilter className="text-lg" />
        </button>

        {/* Layout Button */}
        <button
          ref={layoutButtonRef}
          onClick={openLayoutMenu}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-white/20"
        >
          <FaColumns className="text-lg" />
        </button>
      </div>

      {/* Mobile Filter Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-20 right-4 z-20 md:hidden bg-black/90 backdrop-blur-xl p-4 opacity-0 scale-80 min-w-[200px]"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`block w-full text-left py-3 px-4 mb-1 transition-colors ${
                activeFilter === filter.id
                  ? 'bg-pink-300/20 text-pink-500'
                  : 'text-white hover:bg-white/10'
              }`}
              style={{ opacity: 0 }} // Start hidden for animation
            >
              <span className="font-bold text-lg">{filter.label}</span>
              <span className="ml-2 text-sm opacity-60">({filter.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile Layout Menu */}
      {layoutMenuOpen && (
        <div
          ref={layoutMenuRef}
          className="absolute top-20 right-16 z-20 md:hidden bg-black/90 backdrop-blur-xl p-4 opacity-0 scale-0"
        >
          <div className="flex gap-2">
            <button
              onClick={() => handleLayoutChange(1)}
              className={`flex items-center justify-center w-12 h-12 rounded transition-colors ${
                columnLayout === 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FaTh className="text-lg" />
            </button>
            
            <button
              onClick={() => handleLayoutChange(2)}
              className={`flex items-center justify-center w-12 h-12 rounded transition-colors ${
                columnLayout === 2 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FaColumns className="text-lg" />
            </button>
            
            <button
              onClick={() => handleLayoutChange(3)}
              className={`flex items-center justify-center w-12 h-12 rounded transition-colors ${
                columnLayout === 3 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FaThLarge className="text-lg" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={itemsRef}
        className="absolute top-0 left-0 w-full h-full p-2 flex gap-2 overflow-y-auto scrollable-container"
      >
        <div className={`w-3/4 h-max flex gap-2 max-md:w-full ${
          columnLayout === 1 ? 'max-md:flex-col' : ''
        }`}>
          {columns.map((column, index) => (
            <div 
              key={index} 
              className={`h-max mt-10 ${
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

      <style jsx>{`
        .scrollable-container::-webkit-scrollbar {
          display: none;
        }
        .scrollable-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center pointer-events-auto"
        >
          {/* Left Zone - Previous */}
          <div
            className="cursor-trigger absolute left-0 top-0 w-1/3 h-full z-10"
            data-cursor-type="prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
          />

          {/* Middle Zone - Close */}
          <div
            className="cursor-trigger absolute left-1/3 top-0 w-1/3 h-full z-10"
            data-cursor-type="close"
            onClick={closeLightbox}
          />

          {/* Right Zone - Next */}
          <div
            className="cursor-trigger absolute right-0 top-0 w-1/3 h-full z-10"
            data-cursor-type="next"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
          />

          {/* Image */}
          <img
            key={lightboxImage}
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain pointer-events-none relative z-0"
          />

          {/* Counter */}
          <div className="absolute bottom-8 text-white text-lg mix-blend-difference pointer-events-none z-20">
            {lightboxIndex + 1} / {getFilteredItems().length}
          </div>
        </div>
      )}
    </div>
  );
}