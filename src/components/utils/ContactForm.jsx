import { useState, useRef } from "react";
import { useFindMobile } from "../hooks/useFindMobile";
import SocialsContact from "./SocialsContact";
import { motion as Motion } from "framer-motion";
import ChangeContactButton from "./ChangeContactButton";

export default function ContactFrom() {
  const [isContactVisible, setIsContactVisible] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const { isMobileLayout } = useFindMobile();

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const distanceX = mouseX - buttonCenterX;
    const distanceY = mouseY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    const maxDistance = 150; // Magnetic field radius
    const maxMove = 25; // Maximum pixels to move
    
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

  const getTransform = () => {
    if (isContactVisible) return "translate(0, 0)";
    return isMobileLayout ? "translateY(100%)" : "translateX(100%)";
  };

  const handleSend = () => {
    // First slide the image to cover the card
    setIsContactVisible(false);
    
    // Then flip the card while it's hidden behind the image
    setTimeout(() => {
      setIsFlipped(false);
    }, 500);
    
    // Return to initial state after delay
    setTimeout(() => {
      setIsContactVisible(true);
    }, 3000);
  };

  const toggleCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden shadow-xl flex flex-col md:flex-row items-center z-20">
      {/* Sliding Image */}
      <div
        className="absolute bg-cover bg-center bg-no-repeat transition-transform delay-300 duration-500 ease-[cubic-bezier(0.5, 0, 0.75, 0)] z-20 w-full h-1/2 md:w-1/2 md:h-full"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/contact.jpg')`,
          transform: getTransform(),
        }}
      />

      {/* Content Container */}
      <div 
        className="relative z-10 flex flex-col  md:flex-row w-full h-full text-white"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Success Message */}
        <div className="w-full flex-1 h-1/2 md:w-1/2 md:h-full flex flex-col items-center text-4xl justify-center bg-black">
          <h2 className="font-bold mb-4 text-center">
            Message Sent
          </h2>
          <p>Thank you! We'll be in touch soon.</p>
        </div>

        {/* Flip Card Container */}
        <div className="w-full flex-1 h-1/2 md:w-1/2 md:h-full pt-12 md:pt-0 flex items-start md:items-center justify-center perspective-1000">
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
                className="absolute inset-0 flex flex-col justify-center gap-8 px-8 space-y-8"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <SocialsContact />
                
                {/* Circular Button */}
                <div className="fixed bottom-8 right-8 md:bottom-24 md:right-16" initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 1.75, delay: 0.75 } }}
                    exit={{ opacity: 0, x: 100 }}    >
                  {/* <button                        
                    ref={buttonRef}
                    onClick={toggleCard}
                    className="cursor-trigger cursor-pointer  w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-500 hover:bg-gray-400 hover:text-gray-900 text-white text-xs md:text-sm font-bold flex items-center justify-center transition-all duration-500 ease-out shadow-lg"
                    type="button"
                    style={{
                      transform: `translate(${buttonTransform.x}px, ${buttonTransform.y}px)`
                    }}
                  >
                    Write Me
                  </button> */}
                  <ChangeContactButton onClick={toggleCard} buttonRef={buttonRef} buttonTransform={buttonTransform} text="Write Me" />
                </div>
              </div>

              {/* Back Side - Form */}
              <div
                className="absolute inset-0 flex md:items-center md:justify-center px-24"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <form className="flex flex-col lg:gap-2 w-full">
                  <h2 className={`${isMobileLayout ? "text-2xl" : "text-[3.5em] font-bold"} lg:mb-4 text-center tracking-[25px]`}>
                    Contact Me
                  </h2>
                  <input
                    className="input-hover p-2 border-b border-white/40 font-thin focus:outline-none bg-transparent text-white md:text-[1.5em] placeholder-gray-600"
                    placeholder="Name"
                    required
                  />
                  <input
                    className="input-hover p-2 border-b border-white/40 font-thin focus:outline-none bg-transparent text-white md:text-[1.5em] placeholder-gray-600"
                    type="email"
                    placeholder="Your email"
                    required
                  />
                  <input
                    className="input-hover p-2 border-b border-white/40 font-thin focus:outline-none bg-transparent text-white md:text-[1.5em] placeholder-gray-600"
                    type="phone"
                    placeholder="Your Phone"
                    required
                  />
                  <textarea
                    className="input-hover p-2 border-b border-white/40 font-thin focus:outline-none bg-transparent text-white md:text-[1.5em] placeholder-gray-600 resize-none"
                    placeholder="Your message"
                    rows="3"
                    required
                  />
                  <button
                    className="bg-gray-500 group text-white font-bold mt-2 hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
                    type="button"
                    style={{ padding: '8px 0' }}
                    onClick={handleSend}
                  >
                    <span className="group-hover:text-gray-500 transition duration-300 ease-in-out">
                      Send
                    </span>
                  </button>

                  {/* Circular Button to go back */}
                  <div className="flex justify-center mt-4 fixed bottom-8 left-8 md:bottom-24 md:left-16">
                    {/* <button
                    ref={buttonRef}
                      onClick={toggleCard}
                      className="cursor-trigger cursor-pointer  w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-500 hover:bg-gray-400 hover:text-gray-900 text-white font-bold flex items-center justify-center transition-all duration-500 ease-in-out shadow-lg text-xs md:text-sm"
                      type="button"
                      style={{
                    transform: `translate(${buttonTransform.x}px, ${buttonTransform.y}px)`
                  }}
                    >
                      Socials
                    </button> */}
                  <ChangeContactButton onClick={toggleCard} buttonRef={buttonRef} buttonTransform={buttonTransform} text="Socials" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}