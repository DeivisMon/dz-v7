import { useState } from "react";
import SocialIcons from "./SocialIcons";
import { useDeviceType } from "./useDeviceType";



export default function ContactFrom() {
  const [isContactVisible, setIsContactVisible] = useState(true);
    const { isMobile, isHorizontalMobile, isVerticalMobile } = useDeviceType();
  

  const getTransform = () => {
    if (isContactVisible) return "translate(0, 0)";
    return isVerticalMobile ? "translateY(100%)" : "translateX(100%)";
  };
  

  return (
    <div
      className="relative w-[100vw] h-[100vh] overflow-hidden shadow-xl flex flex-col md:flex-row items-center z-20"
    >
      {/* Slankiojantis Image */}
      <div
        className="absolute bg-cover bg-center bg-no-repeat transition-transform delay-300 duration-500 ease-[cubic-bezier(0.5, 0, 0.75, 0)] z-20 w-full h-1/2 md:w-1/2 md:h-full"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/contact.jpg')`,
          transform: getTransform(),
        }}
      />

      {/* Form */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full text-white">
        <div className="w-full flex-1 w-full h-1/2 md:w-1/2 md:h-full flex flex-col items-center justify-center bg-black">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Message Sent
            </h2>
            <p>Thank you! We’ll be in touch soon.</p>
            <button
              className="text-gray-600 font-bold py-2 mt-2 cursor-pointer"
              type="button"
              onClick={() => setIsContactVisible(!isContactVisible)}
            >
              Contact Again?
            </button>
        </div>

        <div className="w-full flex-1 w-full h-1/2 md:w-1/2 md:h-full pt-12 md:pt-0 flex items-start md:items-center justify-center">
          <form className={`${isHorizontalMobile ? "mx-8" : "mx-0"} flex flex-col lg:gap-2 w-full max-w-xl`}>
            <h2 className={`${isHorizontalMobile ? "text-3xl" : "text-5xl"} ${!isMobile ? "text-[3rem] font-extrabold" : ""}  lg:mb-4 text-center`}>Contact Me</h2>
            <input
              className="input-hover p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none" 
              placeholder="Name"
              required
            />
            <input
              className="input-hover p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none"
              type="email"
              placeholder="Your email"
              required
            />
            <textarea
              className="input-hover p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none"
              placeholder="Your message"
              required
            />
            <button
              className="bg-gray-500 group text-white font-bold mt-2 hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
              type="button"
              style={{padding: '8px 0'}}
              onClick={() => setIsContactVisible(!isContactVisible)}
            >
              <span className="group-hover:text-gray-500 transition duration-300 ease-in-out">
               Send
              </span>
            </button>
            <div className="flex justify-center md:mt-4">
              <SocialIcons />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
