import { motion as Motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const containerVariants = {
  hidden: { y: -65, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 2,
      duration: 0.5,
      staggerChildren: 0.1, 
      delayChildren: 2,   
    },
  },
};

const iconVariants = {
  hidden: { y: '50%', opacity: 0 },
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
    { id: "x", icon: <FaXTwitter />, label: "X" },
    { id: "linkedin", icon: <FaLinkedin />, label: "LinkedIn" },
  ];

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="social-icons flex justify-evenly w-full"
    >
      {icons.map(({ id, icon, label }) => (
        <Motion.div
          key={id}
          variants={iconVariants}
          className="h-12 w-12 flex items-center justify-center hover:text-white hover:scale-110 rounded-sm transition-all duration-300 ease-in-out "
          style={{ fontSize: 32, cursor: "pointer", padding: "0 10px",  }}
          aria-label={label}
        >
          {icon}
        </Motion.div>
      ))}
    </Motion.div>
  );
}
