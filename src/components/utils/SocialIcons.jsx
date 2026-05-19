import { motion as Motion } from "framer-motion";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const containerVariants = {
  hidden: { y: 65, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.9,
      duration: 0.25,
      staggerChildren: 0.1, 
      delayChildren: 1.5,
      ease: [0.22, 1, 0.36, 1],   
    },
  },
   exit: {
    y: 65,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  }
};

const iconVariants = {
  hidden: { y: 50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
 
};

export default function SocialIcons() {
  const icons = [
    { id: "facebook", icon: <FaFacebookF />, label: "Facebook" },
    { id: "instagram", icon: <FaInstagram />, label: "Instagram" },
  ];

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="social-icons flex justify-center items-end w-full"
    >
      {icons.map(({ id, icon, label }) => (
        <Motion.div
          key={id}
          variants={iconVariants}
          initial="hidden"
          animate="show"
          className="h-12 w-12 flex items-center justify-center text-text hover:text-white hover:scale-110 rounded-sm transition-all duration-300 ease-in-out "
          style={{ fontSize: 32, padding: "0 10px",  }}
          aria-label={label}
        >
          {icon}
        </Motion.div>
      ))}
    </Motion.div>
  );
}
