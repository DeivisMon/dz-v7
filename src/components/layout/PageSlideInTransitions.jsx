import { motion as Motion } from "framer-motion";

  const containerVariants = {
    hidden: { y: 65, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.75,
        duration: 0.5,
        ease: [0.53, 0.2, 0.17, 1],
      },
    },
    exit: { y: -15, transition: { duration: 1.25 } },
  };


export default function PageTransition({ children }) {
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