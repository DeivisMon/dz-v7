import { useState, useRef } from "react";
import { useResponsive } from "../hooks/useResopnsive";
import SocialsContact from "./SocialsContact";
import ChangeContactButton from "./ChangeContactButton";

export default function ContactForm() {
  const [showSocials, setShowSocials] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false); 
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const responsive = useResponsive();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleMouseMove = (e) => {
    if (!buttonRef.current || responsive.isTouch) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    const maxDistance = 150;
    const maxMove = 75;
    
    if (distance < maxDistance) {
      const strength = 1 - (distance / maxDistance);
      const moveX = distanceX * strength * (maxMove / maxDistance);
      const moveY = distanceY * strength * (maxMove / maxDistance);
      setButtonTransform({ x: moveX, y: moveY });
    } else {
      setButtonTransform({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setButtonTransform({ x: 0, y: 0 });
  };

  const isVerticalLayout = responsive.isMobilePortrait || (responsive.isShortScreen && responsive.isMobile);

  const getImageTransform = () => {
    if (showSocials) {
      return "translate(0, 0)"; 
    }
    if (isVerticalLayout) {
      return "translateY(-100%)"; 
    }
    
    return "translateX(100%)"; 
  };

  const handleSend = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setIsFlipped(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

  const toggleView = () => {
    setShowSocials(!showSocials);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-[100vw] mt-16 h-[calc(100dvh-64px)] overflow-hidden shadow-xl bg-bckg">
      {/* Content Container - positioned absolutely for proper 50/50 split */}
      <div 
        className={`absolute inset-0 flex ${isVerticalLayout ? 'flex-col' : 'flex-row'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Form Section (LEFT) with Flip Card for Success Message */}
        <div className={`absolute ${isVerticalLayout ? 'top-1/2 left-0 w-full h-1/2' : 'left-0 top-0 w-1/2 h-full'} flex py-32 justify-center px-2 z-10 sm:px-8 lg:px-18`}>
          <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
            <div
              className="w-full h-full transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side - Form */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black "
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div className="flex flex-col gap-3 lg:gap-4 w-3/4">
                  <h2 className="text-md lg:text-3xl font-bold text-center tracking-[clamp(0.5em,calc(0.05em+0.3vw),0.35em)] lg:mb-2 text-header">
                    Parašyk man
                  </h2>
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg placeholder-text transition-colors"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg placeholder-text transition-colors"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg placeholder-text transition-colors"
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <textarea
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg placeholder-text resize-none transition-colors"
                    placeholder="Your message"
                    rows={responsive.isShortScreen ? "1" : "2"}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                  <button
                    className="bg-gray-500 text-text font-bold py-1 md:py-3 hover:bg-gray-200 hover:text-gray-900 transition duration-300 ease-in-out mt-1"
                    type="button"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Back Side - Success Message */}
              <div
                className="absolute inset-0 text-text flex flex-col items-center justify-center bg-black"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <h2 className="font-bold mb-4 text-center text-xl sm:text-3xl lg:text-4xl">
                  Message Sent
                </h2>
                <p className="text-md sm:text-xl">Thank you! We'll be in touch soon.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Socials Section (RIGHT) */}
        <div className={`absolute ${isVerticalLayout ? 'top-0 left-0 w-full h-1/2' : 'right-0 top-0 w-1/2 h-full'} flex justify-center px-2 z-10 px-0 sm:px-12 lg:px-18`}>
          <SocialsContact />
        </div>
      </div>

      {/* Sliding Image Overlay - Controlled by ChangeContactButton - slides to reveal form */}
      <div
        className={`absolute transition-transform duration-500 ease-out z-20 ${isVerticalLayout ? 'h-1/2 w-full' : 'w-1/2 h-full'} bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/contact.jpg')`,
          transform: getImageTransform(),
          // Position image to cover form initially
          top: isVerticalLayout ? '50%' : 0,
          left: 0,
        }}
      />

      {/* ChangeContactButton - Positioned at center between sections */}
      <div 
        className={`absolute z-30 ${
          isVerticalLayout 
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        }`}
      >
        <ChangeContactButton 
          onClick={toggleView} 
          buttonRef={buttonRef} 
          buttonTransform={buttonTransform} 
          currentText={showSocials ? "Parašyk" : "Susisiek"}
          nextText={showSocials ? "Susisiek" : "Parašyk"}
        />
      </div>
    </div>
  );
}