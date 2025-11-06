import { motion as Motion } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";

const containerVariants = {
  hidden: { y: 65, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 2.2,
      duration: 0.5,
      staggerChildren: 0.15,
      delayChildren: 2.5,
    },
  },
};

const iconVariants = {
  hidden: { y: "50%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

export default function Socials() {
  const icons = [
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "x", label: "X.com" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="social-icons relative hidden  md:flex items-end gap-6 mix-blend-difference"
    >
      {icons.map(({ id, label }) => (
        <div
          key={id}
          className="cursor-trigger group flex items-center"
          // data-cursor-type="link"
        >
          <Motion.div
            variants={iconVariants}
            className="flex items-center"
            style={{ fontSize: 16, cursor: "pointer" }}
            aria-label={label}
          >
            {label}
          </Motion.div>
          <span className="opacity-0 -rotate-180 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300 ease-in-out ">
            <MdArrowOutward />
          </span>
        </div>
      ))}
    </Motion.div>
  );
}
