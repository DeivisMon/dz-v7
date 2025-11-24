import { motion as Motion } from "framer-motion";
import TextTransition from "../TextTransition";
export default function PageTransitions({ children }) {

  const Animate = (variants) => {
    return {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants,
    };
  };

  const oppacity = {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { duration: 1 } },
    exit: {
      opacity: 0.8,
      y: -40,
      transition: { duration: 1, ease: [0.65, 0, 0.35, 1] },
    },
  };

  const slide = {
    initial: { y: "100vh" },
    animate: { y: "100vh" },
    exit: {
      y: ["100vh", 0, 0], 
      transition: {
        duration: 1.5,
        ease: [0.45, 0, 0.55, 0.25],
        times: [0, 0.67, 1], 
      },
    },
  };

  const zoomOut = {
    initial: { y: 0, scale: 1, opacity: 1 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: {
      y: 100,
      scale: 0.7,
      opacity: 0.8,
      transition: { duration: 1.5, ease: [0.75, 0.85, 0.95, 0.75] },
    },
  };

  return (
    <div className="bg-black/50 overflow-hidden">
      <Motion.div
        {...Animate(slide)}
        className="fixed top-0 left-0 bg-black min-w-full z-1 min-h-screen"
      >
       <TextTransition />
      </Motion.div>
      <Motion.div {...Animate(zoomOut)} className="relative min-h-screen">
        <Motion.div
          {...Animate(oppacity)}
          className="relative flex items-center justify-center bg-black min-h-screen"
        >
          {children}
        </Motion.div>
      </Motion.div>
    </div>
  );
}
