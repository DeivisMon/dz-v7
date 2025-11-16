import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';

const items = [
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1499530633341-1e63c0de3e8f?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400" },
  { tag: ["mergos"], img: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=400" },
  { tag: ["koncertai"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { tag: ["menas"], img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400" },
];

const FilterButton = ({ filter, isActive, onClick }) => {
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);

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
      // Lenis will handle the smooth scrolling automatically
      // Just make sure the event reaches the scroll container
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
      className={`w-max h-max flex items-end cursor-pointer mb-16 ${
        isActive ? 'pt-10' : 'pt-6'
      } pb-2 pr-8 pointer-events-auto`}
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
  const itemsRef = useRef(null);
  const lenisRef = useRef(null);

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

  const handleFilterClick = (filterId) => {
    if (filterId === activeFilter) return;

    gsap.to(itemsRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        setActiveFilter(filterId);
        gsap.to(itemsRef.current, {
          opacity: 1,
          duration: 0.25,
        });
      },
    });
  };

  const renderItems = () => {
    const filtered = getFilteredItems();
    const col1 = [];
    const col2 = [];
    const col3 = [];
    let col1Height = 0;
    let col2Height = 0;
    let col3Height = 0;

    filtered.forEach((item, i) => {
      const originalIndex = items.indexOf(item);
      const aspectRatio = imageHeights[originalIndex] || 1.25;
      const height = 400 * aspectRatio;

      const itemElement = (
        <div key={i} className="pb-2">
          <div className="w-full overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-auto object-cover"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      );

      // Add to shortest column for balanced masonry
      const heights = [
        { col: col1, height: col1Height, setter: () => { col1.push(itemElement); col1Height += height; } },
        { col: col2, height: col2Height, setter: () => { col2.push(itemElement); col2Height += height; } },
        { col: col3, height: col3Height, setter: () => { col3.push(itemElement); col3Height += height; } }
      ];
      
      heights.sort((a, b) => a.height - b.height);
      heights[0].setter();
    });

    return { col1, col2, col3 };
  };

  const { col1, col2, col3 } = renderItems();

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      <div className="fixed top-0 right-0 w-1/2 h-screen pb-32 flex flex-col justify-end items-end z-10 mix-blend-difference pointer-events-none">
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={activeFilter === filter.id}
            onClick={() => handleFilterClick(filter.id)}
          />
        ))}
        <style jsx>{`
          @media (max-width: 900px) {
            & > div {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.25);
            }
          }
        `}</style>
      </div>

      <div
        ref={itemsRef}
        className="absolute top-0 left-0 w-full h-full p-8 flex gap-2 overflow-y-auto scrollable-container"
      >
        <div className="w-3/4 h-max flex gap-2 max-md:w-full">
          <div className="flex-1 h-max">{col1}</div>
          <div className="flex-1 h-max">{col2}</div>
          <div className="flex-1 h-max max-md:hidden">{col3}</div>
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
    </div>
  );
}