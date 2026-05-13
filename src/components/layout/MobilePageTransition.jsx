import { motion as Motion } from "framer-motion";

export default function MobilePageTransition({ children }) {

 const Animate = (variants) => ({
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants,
  });

  const mobileOverlay = {
  initial: { clipPath: "inset(0% 100% 100% 0%)" },  
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",             
    transition: { duration: 0.7, delay: 0, ease: [0.87, 0, 0.13, 1] },
  },
  exit: {
    clipPath: "inset(100% 0% 0% 100%)",                
    transition: { duration: 0.5, delay: 0, ease: [0.53, 0.2, 0.17, 1] },
  },
};


  return (
    <Motion.div
      {...Animate(mobileOverlay)} className="fixed top-0 left-0 w-full h-[100dvh] bg-surface z-1"
    >
      {children}
    </Motion.div>
  );
}