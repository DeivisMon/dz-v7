import { motion as Motion } from "framer-motion";
import TextTransition from "./TextTransition";
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
      transition: { duration: 1.5, ease: [0.53, 0.2, 0.17, 1] },
    },
  };

  const slide = {
    initial: { y: "-100vh" },
    animate: { y: "100vh" },
    exit: {
      y: "64px",
      transition: { duration: 1.5, delay: 0.5, ease: [0.53, 0.2, 0.17, 1] },
    },
  };

  const zoomOut = {
    initial: { y: 0, scale: 1, opacity: 1 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: {
      y: 500,
      scale: 0.9,
      opacity: 0.8,
      transition: { duration: 2.5, ease: [0.53, 0.2, 0.17, 1] },
    },
  };

  // const endBlack = {
  //   initial: { scaleY: 1 },
  //   animate: {
  //     scaleY: 0,
  //     transition: { delay: 1.5, duration: 0.5, ease: "easeInOut" },
  //   },
  // };

  return (
    <div className="overflow-hidden">
      <Motion.div
        {...Animate(slide)}
        className="fixed top-0 left-0 bg-black min-w-full z-1"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <TextTransition />
      </Motion.div>
      <Motion.div {...Animate(zoomOut)} className="relative" style={{ minHeight: "calc(100vh - 64px)" }} >
        
        <Motion.div
          {...Animate(oppacity)}
          className="relative flex items-center justify-center bg-bckg" style={{ minHeight: "calc(100vh - 64px)" }}
        >
          {children}
        </Motion.div>
      </Motion.div>
      {/* <Motion.div
        {...Animate(endBlack)}
        className="fixed inset-0 bg-black z-[999999] origin-top pointer-events-none"
      /> */}
    </div>
  );
}
