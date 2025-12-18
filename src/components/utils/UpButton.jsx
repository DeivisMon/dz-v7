import { useEffect, useState } from "react";
import { SlArrowUp } from "react-icons/sl";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function UpButton({ lenis }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ progress }) => {
      setVisible(progress > 0.99);
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const toTop = () => {
  lenis?.scrollTo(0, {
    duration: 2.2,
    easing: (t) => 1 - Math.pow(1 - t, 5), 
  });
};

  return (
<AnimatePresence>
  {visible && (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-10 left-1/2 z-[9999] mix-blend-difference animate-pulse"
    >
      <Motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1] }}
        className="-translate-x-1/2 cursor-trigger select-none"
        data-cursor-type="up"
        onClick={toTop}
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <SlArrowUp size={40} />
          <span className="text-sm tracking-widest">TOP</span>
        </div>
      </Motion.div>
    </Motion.div>
  )}
</AnimatePresence>
  );
}
