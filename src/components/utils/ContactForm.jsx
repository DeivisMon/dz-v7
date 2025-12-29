import { useState, useRef } from "react";
import { useResponsive } from "../hooks/useResopnsive";
import SocialsContact from "./SocialsContact";
import ChangeContactButton from "./ChangeContactButton";

export default function ContactForm() {
  const [isContactVisible, setIsContactVisible] = useState(true);
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
    const maxMove = 25;
    
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

  const getTransform = () => {
    if (isContactVisible) return "translate(0, 0)";
    
    // If vertical layout (image on top), slide DOWN
    if (isVerticalLayout) {
      return "translateY(100%)";
    }
    
    // If horizontal layout (image on left), slide RIGHT
    return "translateX(100%)";
  };

  const handleSend = () => {
    setIsContactVisible(false);
    setTimeout(() => setIsFlipped(false), 500);
    setTimeout(() => {
      setIsContactVisible(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const toggleCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden shadow-xl bg-black text-white">
      {/* Content Container - splits screen 50/50 */}
      <div 
        className={`relative z-10 flex w-full h-full ${isVerticalLayout ? 'flex-col' : 'flex-row'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container Success Message */}
        <div className={`flex flex-col items-center justify-center bg-black ${isVerticalLayout ? 'h-1/2 w-full' : 'w-1/2 h-full'}`}>
          <h2 className="font-bold mb-4 text-center text-2xl sm:text-3xl lg:text-4xl">
            Message Sent
          </h2>
          <p className="text-lg sm:text-xl">Thank you! We'll be in touch soon.</p>
        </div>

        {/* Flip Card Container */}
        <div className={`relative flex justify-center ${isVerticalLayout ? 'h-1/2 w-full' : 'w-1/2 h-full'} p-4 lg:p-8`}>
          <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
            <div
              className="relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side - Socials */}
              <div
                className="absolute inset-0 flex items-top justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <SocialsContact />
                
                <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-30">
                  <ChangeContactButton 
                    onClick={toggleCard} 
                    buttonRef={buttonRef} 
                    buttonTransform={buttonTransform} 
                    text="Write Me" 
                  />
                </div>
              </div>

              {/* Back Side - Form */}
              <div
                className="absolute inset-0 flex items-center justify-center py-4 px-0 sm:px-8 lg:px-12"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
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
                    className="bg-gray-500 text-white font-bold py-1 md:py-3 hover:bg-gray-200 hover:text-gray-900 transition duration-300 ease-in-out mt-2"
                    type="button"
                    onClick={handleSend}
                  >
                    Send
                  </button>

                  <div className={` fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-30`}>
                    <ChangeContactButton 
                      onClick={toggleCard} 
                      buttonRef={buttonRef} 
                      buttonTransform={buttonTransform} 
                      text="Socials" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Image - Overlays on top with z-20 */}
      <div
        className={`absolute top-0 left-0 bg-cover bg-center bg-no-repeat transition-transform delay-300 duration-500 ease-out z-20 ${isVerticalLayout ? 'h-1/2 w-full' : 'w-1/2 h-full'}`}
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/contact.jpg')`,
          transform: getTransform(),
        }}
      />
    </div>
  );
}