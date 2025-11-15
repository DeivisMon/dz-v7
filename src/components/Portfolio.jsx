import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const items = [
  { title: "Echoes of Silence", tag: ["mix"], img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
  { title: "Midnight Canvas", tag: ["design"], img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400" },
  { title: "Vibrant Rhythms", tag: ["music"], img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
  { title: "Shadow Dance", tag: ["mix"], img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400" },
  { title: "Colorful Serenity", tag: ["design"], img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { title: "Dream Weaver", tag: ["mix"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { title: "Urban Mirage", tag: ["design"], img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400" },
  { title: "Sonic Bloom", tag: ["music"], img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400" },
  { title: "Celestial Nights", tag: ["mix"], img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400" },
  { title: "Harmony Quest", tag: ["music"], img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400" },
  { title: "Abstract Harmony", tag: ["design"], img: "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?w=400" },
  { title: "Rhythm and Space", tag: ["mix"], img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400" },
  { title: "Ethereal Echoes", tag: ["music"], img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400" },
  { title: "Whispers of Twilight", tag: ["mix"], img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
  { title: "Mosaic of Dreams", tag: ["design"], img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400" },
  { title: "Glimpse of Eternity", tag: ["mix"], img: "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=400" },
  { title: "Infinite Palette", tag: ["mix"], img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400" },
  { title: "Soul's Resonance", tag: ["music"], img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
  { title: "Spectral Designs", tag: ["design"], img: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400" },
  { title: "Temporal Visions", tag: ["mix"], img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400" },
  { title: "Luminous Journey", tag: ["design"], img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400" },
  { title: "Melodic Horizon", tag: ["music"], img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400" },
  { title: "Eclipse of the Heart", tag: ["mix"], img: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400" },
  { title: "Canvas of Sound", tag: ["design"], img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400" },
  { title: "Aurora's Whisper", tag: ["mix"], img: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400" },
  { title: "Visions in Bloom", tag: ["design"], img: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400" },
  { title: "Harmonious Disarray", tag: ["music"], img: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400" },
  { title: "Orchestral Dreams", tag: ["music"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  { title: "Symphony of Night", tag: ["design"], img: "https://images.unsplash.com/photo-1499530633341-1e63c0de3e8f?w=400" },
  { title: "Echoing Serenade", tag: ["music"], img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400" },
  { title: "Mystical Frequencies", tag: ["mix"], img: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400" },
  { title: "Serenity in Chaos", tag: ["mix"], img: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=400" },
  { title: "Rhythmic Illusions", tag: ["music"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { title: "The Color of Sound", tag: ["design"], img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400" },
];

const FilterButton = ({ filter, isActive, onClick }) => {
  const h1Ref = useRef(null);

  useEffect(() => {
    const spans = h1Ref.current?.querySelectorAll('span');
    if (spans) {
      gsap.to(spans, {
        fontSize: isActive ? '25px' : '75px',
        stagger: 0.025,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [isActive]);

  const renderTitle = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="relative">
        {char}
      </span>
    ));
  };

  return (
    <div
      className={`w-max h-max flex items-end cursor-pointer mb-16 ${
        isActive ? 'pt-10' : 'pt-6'
      } pb-2`}
      onClick={onClick}
    >
      <p
        className={`relative ${
          isActive ? 'bottom-6' : 'bottom-2.5'
        } px-2 text-xl font-medium text-white`}
      >
        ({filter.count})
      </p>
      <h1 ref={h1Ref} className="leading-[80%]">
        {renderTitle(filter.label)}
      </h1>
      <style jsx>{`
        h1 span {
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
  const itemsRef = useRef(null);

  const filters = [
    { id: 'all', label: 'All', count: 34 },
    { id: 'mix', label: 'Remixes', count: 13 },
    { id: 'design', label: 'Sound', count: 11 },
    { id: 'music', label: 'Music', count: 10 },
  ];

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

    filtered.forEach((item, i) => {
      const itemElement = (
        <div key={i} className="p-4 pb-16">
          <div className="w-full h-[300px] rounded-lg overflow-hidden">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium my-2 text-white">{item.title}</p>
          </div>
        </div>
      );

      if (i % 2 === 0) {
        col1.push(itemElement);
      } else {
        col2.push(itemElement);
      }
    });

    return { col1, col2 };
  };

  const { col1, col2 } = renderItems();

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      <div className="fixed top-0 right-0 w-1/2 h-screen pb-32 flex flex-col justify-end items-end md:z-0 max-md:z-10">
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
        className="absolute top-0 left-0 w-3/5 h-full p-8 flex overflow-y-auto max-md:w-full"
      >
        <div className="flex-1 h-max p-8 px-4">{col1}</div>
        <div className="flex-1 h-max p-8 px-4 relative top-40">{col2}</div>
      </div>
    </div>
  );
}