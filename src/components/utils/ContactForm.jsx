import { useState, useRef } from "react";
import { useResponsive } from "../hooks/useResopnsive";
import SocialsContact from "./SocialsContact";
import ChangeContactButton from "./ChangeContactButton";

export default function ContactForm() {
  const [showSocials, setShowSocials] = useState(true); // true = show socials, false = show form
  const [isFlipped, setIsFlipped] = useState(false); // for success message flip
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

  // Determine layout direction based on screen
  const isVerticalLayout = responsive.isMobilePortrait || (responsive.isShortScreen && responsive.isMobile);

  const getImageTransform = () => {
    // showSocials = true: image covering form (at bottom on mobile, left on desktop), socials visible
    // showSocials = false: image slides to cover socials (to top on mobile, right on desktop), form visible
    
    if (showSocials) {
      return "translate(0, 0)"; // Image covering form
    }
    
    // Slide to cover socials instead
    if (isVerticalLayout) {
      return "translateY(-100%)"; // Slide up to cover socials (top half)
    }
    
    return "translateX(100%)"; // Slide right to cover socials (right half)
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
    <div className="relative w-[100vw] h-[100dvh] overflow-hidden shadow-xl bg-black text-white">
      {/* Content Container - positioned absolutely for proper 50/50 split */}
      <div 
        className={`absolute inset-0 flex ${isVerticalLayout ? 'flex-col' : 'flex-row'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Form Section (LEFT) with Flip Card for Success Message */}
        <div className={`absolute ${isVerticalLayout ? 'top-1/2 left-0 w-full h-1/2' : 'left-0 top-0 w-1/2 h-full'} flex justify-center px-2 z-10 px-0 sm:px-8 lg:px-18`}>
          <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
            <div
              className="relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side - Form */}
              <div
                className="absolute inset-0 flex items-center justify-center py-4"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div className="flex flex-col gap-3 lg:gap-4 w-full">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center tracking-[clamp(0.5em,calc(0.05em+0.3vw),0.35em)] mb-2 lg:mb-4">
                    Contact Me
                  </h2>
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-white text-base lg:text-lg placeholder-gray-400 transition-colors"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-white text-base lg:text-lg placeholder-gray-400 transition-colors"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <input
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-white text-base lg:text-lg placeholder-gray-400 transition-colors"
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <textarea
                    className="p-1 md:p-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-white text-base lg:text-lg placeholder-gray-400 resize-none transition-colors"
                    placeholder="Your message"
                    rows={responsive.isShortScreen ? "1" : "2"}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                  <button
                    className="bg-gray-500 text-white font-bold py-1 md:py-3 hover:bg-gray-200 hover:text-gray-900 transition duration-300 ease-in-out mt-1"
                    type="button"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Back Side - Success Message */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <h2 className="font-bold mb-4 text-center text-2xl sm:text-3xl lg:text-4xl">
                  Message Sent
                </h2>
                <p className="text-lg sm:text-xl">Thank you! We'll be in touch soon.</p>
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
          currentText={showSocials ? "Write Me" : "Socials"}
          nextText={showSocials ? "Socials" : "Write Me"}
        />
      </div>
    </div>
  );
}