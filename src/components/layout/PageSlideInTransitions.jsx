import { motion as Motion } from "framer-motion";
import { useResponsive } from "../hooks/useResopnsive";

export default function PageSlideInTransition({ children }) {
  const responsive = useResponsive();
  
  const containerVariants = {
    hidden: { y: 65, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        delay: responsive.isMobile || responsive.isTablet ? 0.5 : 0.75,
        duration: 0.5,
        ease: [0.53, 0.2, 0.17, 1],
      },
    },
    exit: { y: -15, transition: { duration: responsive.isMobile || responsive.isTablet ? 0.75 : 1.25 } },
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {children}
    </Motion.div>
  );
}