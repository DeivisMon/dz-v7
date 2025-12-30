import { easeInOut, motion as Motion } from "framer-motion"

const getContainer = (delayChildren, staggerChildren) => ({
  hidden: {
    y: -100,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 1,
      duration: 0.25,
      delayChildren,
      staggerChildren,
    },
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easeInOut,
    },
  },
})

const getLetter = (duration) => ({
  hidden: {
    x: "-100%",
    skewX: 45,
    opacity: 0
  },
  show: {
    x: "0%",
    skewX: 0,
    opacity: 1,
    transition: {
      duration,
      ease: easeInOut,
    },
  },
})


const AnimatedText = ({ 
  text,
  textColor = "text-current", 
  duration = 0.35, 
  delayChildren = 1.8, 
  staggerChildren = 0.025,
  hoverStagger = 0.025,
  className = "",
  enableHover = true,
  letterSpacing = "" 
}) => {
  const container = getContainer(delayChildren, staggerChildren)
  const letter = getLetter(duration)

  return (
    <div className={`inline-block ${className}`}>
      <Motion.span
        className="inline-flex overflow-hidden relative"
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        whileHover={enableHover ? "hover" : undefined}
      >
        {/* Main text with entry animation */}
        <span className="flex">
          {text.split("").map((char, i) => (
            <Motion.span
              key={`main-${char}-${i}`}
              className="overflow-hidden relative"
              style={{ display: "inline-block" }}
            >
              <Motion.span
                variants={{
                  ...letter,
                  hover: enableHover ? { y: "-100%" } : {},
                }}
                className={`inline-block ${textColor} flex justify-center ${letterSpacing}`}
                transition={{
                  ...letter.show.transition,
                  ...(enableHover && {
                    duration: 0.18,
                    ease: "easeInOut",
                    delay: hoverStagger * i,
                  })
                }}
              >
                {char === " " ? "\u00A0" : char}
              </Motion.span>
            </Motion.span>
          ))}
        </span>

        {/* Hover duplicate text */}
        {enableHover && (
          <span className="absolute inset-0 block">
            {text.split("").map((char, i) => (
              <Motion.span
                key={`hover-${char}-${i}`}
                className="overflow-hidden"
                style={{ display: "inline-block" }}
              >
                <Motion.span
                  variants={{
                    hidden: { y: "100%" },
                    show: { y: "100%" },
                    hover: { y: 0 },
                  }}
                  className={`inline-block ${textColor} flex justify-center ${letterSpacing}`}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    delay: hoverStagger * i,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </Motion.span>
              </Motion.span>
            ))}
          </span>
        )}
      </Motion.span>
    </div>
  )
}

export default AnimatedText