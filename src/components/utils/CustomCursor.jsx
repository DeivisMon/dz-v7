import { useState, useEffect, useRef, useCallback } from "react";

// Lerp
const lerp = (a, b, n) => (1 - n) * a + n * b;

// Global cursor position
let globalCursor = { x: 0, y: 0 };

// Cursor element
const CursorElement = ({
  size,
  viewBox,
  radius,
  filled = false,
  scaleOnEnter = 1,
  opacityOnEnter = 1,
  amount = 0.2,
  isHovered,
  isOutside = false,
  showIcon = false,
  iconType = null,
}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  const boundsRef = useRef(null);
  const renderedStyles = useRef({
    tx: { previous: 0, current: 0, amount },
    ty: { previous: 0, current: 0, amount },
    scale: { previous: 1, current: 1, amount },
    opacity: { previous: 1, current: 1, amount },
  });
  const [isVisible, setIsVisible] = useState(false);

  // Calculate bounds once
  useEffect(() => {
    if (elementRef.current) {
      boundsRef.current = { width: size, height: size };
    }
  }, [size]);

  // Handle hover state changes
  useEffect(() => {
    const styles = renderedStyles.current;
    if (isHovered) {
      styles.scale.current = scaleOnEnter;
      styles.opacity.current = opacityOnEnter;
    } else {
      styles.scale.current = 1;
      styles.opacity.current = 1;
    }
  }, [isHovered, scaleOnEnter, opacityOnEnter]);

  // Animation loop
  const animate = useCallback(() => {
    if (!elementRef.current || !boundsRef.current) return;

    const styles = renderedStyles.current;
    const bounds = boundsRef.current;

    // Update current positions based on global cursor
    styles.tx.current = globalCursor.x - bounds.width / 2;
    styles.ty.current = globalCursor.y - bounds.height / 2;

    // Interpolate all values
    for (const key in styles) {
      styles[key].previous = lerp(
        styles[key].previous,
        styles[key].current,
        styles[key].amount
      );
    }

    // Apply transforms
    elementRef.current.style.transform = `translateX(${styles.tx.previous}px) translateY(${styles.ty.previous}px) scale(${styles.scale.previous})`;
    // elementRef.current.style.opacity = styles.opacity.previous;

    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation on first mouse move
  useEffect(() => {
    const handleFirstMove = () => {
      if (!boundsRef.current) return;

      const styles = renderedStyles.current;
      const bounds = boundsRef.current;

      // Set initial positions
      styles.tx.previous = styles.tx.current =
        globalCursor.x - bounds.width / 2;
      styles.ty.previous = styles.ty.current =
        globalCursor.y - bounds.height / 2;

      // Show element
      setIsVisible(true);

      // Start animation loop
      animate();

      window.removeEventListener("mousemove", handleFirstMove);
    };

    window.addEventListener("mousemove", handleFirstMove);

    return () => {
      window.removeEventListener("mousemove", handleFirstMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Icon components
  const renderIcon = () => {
    if (!showIcon || !iconType) return null;

    const centerX = size / 2;
    const centerY = size / 2;

    switch (iconType) {
      case "expand":
        return (
          <g
            className="mix-blend-difference"
            stroke="white"
            strokeWidth="1"
            fill="none"
            opacity="1"
            transform={`rotate(135 ${centerX} ${centerY})`}
          >
            <path
              d={`
                M${centerX - 6},${centerY} 
                L${centerX - 2},${centerY - 4} 
                M${centerX - 6},${centerY} 
                L${centerX - 2},${centerY + 4}
            `}
            />
            <path
              d={`
                M${centerX + 6},${centerY} 
                L${centerX + 2},${centerY - 4} 
                M${centerX + 6},${centerY} 
                L${centerX + 2},${centerY + 4}
            `}
            />
          </g>
        );
      case "close":
        return (
          <g className="mix-blend-difference" fill="white" opacity="1" strokeWidth="1" stroke="white">
            {/* X icon */}
            <line
              x1={centerX - 4}
              y1={centerY - 4}
              x2={centerX + 4}
              y2={centerY + 4}
            />
            <line
              x1={centerX + 4}
              y1={centerY - 4}
              x2={centerX - 4}
              y2={centerY + 4}
            />
          </g>
        );
      case "view":
        return (
          <g className="mix-blend-difference" fill="white" opacity="1">
            {/* Eye icon */}
            <ellipse
              cx={centerX}
              cy={centerY}
              rx="8"
              ry="5"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <circle cx={centerX} cy={centerY} r="3" fill="white" />
          </g>
        );
         case "up":
        return (
          <g
            className="mix-blend-difference"
            stroke="white"
            strokeWidth="1"
            fill="none"
            opacity="1"
            transform={`rotate(90 ${centerX} ${centerY})`}
          >
           <path
              d={`
                M${centerX - 6},${centerY} 
                L${centerX - 2},${centerY - 4} 
                M${centerX - 6},${centerY} 
                L${centerX - 2},${centerY + 4}
              `}
            />
          </g>
        );
      case "link":
        return (
          <g className="mix-blend-difference" fill="none" stroke="white" strokeWidth="1.5" opacity="1">
            <line
              x1={centerX - 4}
              y1={centerY + 4}
              x2={centerX + 4}
              y2={centerY - 4}
            />
            <polyline
              points={`${centerX + 1},${centerY - 4} ${centerX + 4},${
                centerY - 4
              } ${centerX + 4},${centerY - 1}`}
            />
          </g>
        );

case "prev":
  return (
    <path
      d={`
        M${centerX + 4},${centerY - 6}
        L${centerX - 4},${centerY}
        L${centerX + 4},${centerY + 6}
      `}
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mix-blend-difference"
    />
  );

case "next":
  return (
    <path
      d={`
        M${centerX - 4},${centerY - 6}
        L${centerX + 4},${centerY}
        L${centerX - 4},${centerY + 6}
      `}
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mix-blend-difference"
    />
  );


      default:
        return null;
    }
  };

return (
  <div
    ref={elementRef}
    className={`fixed top-0 left-0 pointer-events-none z-[10000] transition-opacity duration-300 ease-in-out
      ${isVisible && !isOutside ? "opacity-100" : "opacity-0"} mix-blend-difference`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox={viewBox}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill={filled ? "white" : "none"}
        stroke={filled ? "none" : "white"}
        strokeWidth={filled ? 0 : 1}
      />
      {renderIcon()}
    </svg>
  </div>
);
};

// Main cursor component
const CustomCursor = ({ triggerSelector = ".cursor-trigger" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [iconType, setIconType] = useState(null);
  const [showCursor, setShowCursor] = useState(false);
  const [isOutside, setIsOutside] = useState(false);

useEffect(() => {
  const handleMouseOut = (e) => {
    if (!e.relatedTarget && !e.toElement) {
      setIsOutside(true); 
    }
  };

  const handleMouseOver = (e) => {
    if (!e.relatedTarget && !e.fromElement) {
      setIsOutside(false); // entered viewport
    }
  };

  window.addEventListener("mouseout", handleMouseOut);
  window.addEventListener("mouseover", handleMouseOver);

  return () => {
    window.removeEventListener("mouseout", handleMouseOut);
    window.removeEventListener("mouseover", handleMouseOver);
  };
}, []);


  // Global mouse position
  useEffect(() => {
    const updateCursor = (e) => {
      globalCursor.x = e.clientX;
      globalCursor.y = e.clientY;
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  // Function to check what element is currently under the cursor
  const checkElementUnderCursor = useCallback(() => {
    const elementUnderCursor = document.elementFromPoint(
      globalCursor.x,
      globalCursor.y
    );
    if (!elementUnderCursor) return;

    const triggerElement = elementUnderCursor.closest(triggerSelector);

    if (triggerElement) {
      setIsHovered(true);

      const cursorType =
        triggerElement.dataset.cursorType ||
        triggerElement.getAttribute("data-cursor") ||
        (triggerElement.classList.contains("cursor-expand")
          ? "expand"
          : triggerElement.classList.contains("cursor-close")
          ? "close"
          : triggerElement.classList.contains("cursor-view")
          ? "view"
          : triggerElement.classList.contains("cursor-link")
          ? "link"
          : triggerElement.classList.contains("cursor-up")
          ? "up"
          : triggerElement.classList.contains("cursor-next")
          ? "next"
          : triggerElement.classList.contains("cursor-prev")
          ? "prev"
          : null);

      setIconType(cursorType);
    } else {
      setIsHovered(false);
      setIconType(null);
    }
  }, [triggerSelector]);

  // Handle hover events and detect cursor type
  useEffect(() => {
    const handleMouseEnter = (e) => {
      setIsHovered(true);

      // Detect cursor type based on element attributes or classes
      const element = e.target.closest(triggerSelector);
      if (!element) return;

      const cursorType =
        element.dataset.cursorType ||
        element.getAttribute("data-cursor") ||
        (element.classList.contains("cursor-expand")
          ? "expand"
          : element.classList.contains("cursor-close")
          ? "close"
          : element.classList.contains("cursor-view")
          ? "view"
          : element.classList.contains("cursor-link")
          ? "link"
          : element.classList.contains("cursor-up")
          ? "up"
          : element.classList.contains("cursor-next")
          ? "next"
          : element.classList.contains("cursor-prev")
          ? "prev"
          : null);

      setIconType(cursorType);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIconType(null);
    };

    const updateEventListeners = () => {
      const elements = document.querySelectorAll(triggerSelector);

      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        elements.forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    };

    // Initial setup
    const cleanup = updateEventListeners();

    // Listen for DOM changes and re-check cursor state
    const observer = new MutationObserver((mutations) => {
      let shouldRecheck = false;

      mutations.forEach((mutation) => {
        // Check if any nodes were added/removed or attributes changed
        if (
          mutation.type === "childList" ||
          (mutation.type === "attributes" &&
            (mutation.attributeName === "data-cursor-type" ||
              mutation.attributeName === "class"))
        ) {
          shouldRecheck = true;
        }
      });

      if (shouldRecheck) {
        updateEventListeners();
        setTimeout(checkElementUnderCursor, 10);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cursor-type", "class"],
    });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [triggerSelector, checkElementUnderCursor]);

  // Check for fine pointer support
  useEffect(() => {
    const mediaQuery = window.matchMedia("(any-pointer: fine)");
    setShowCursor(mediaQuery.matches);

    const handleChange = (e) => setShowCursor(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Expose the refresh function globally for manual cursor updates
  useEffect(() => {
    window.refreshCursor = checkElementUnderCursor;
    return () => {
      delete window.refreshCursor;
    };
  }, [checkElementUnderCursor]);

  if (!showCursor) return null;

  return (
    <>
      {/* Small filled cursor dot */}
      <CursorElement
        size={24}
        viewBox="0 0 24 24"
        radius={6}
        filled={true}
        scaleOnEnter={0}
        opacityOnEnter={0}
        amount={0.2}
        isHovered={isHovered}
        isOutside={isOutside}
        showIcon={false}
      />

      {/* Large cursor circle with icon */}
      <CursorElement
        size={72}
        viewBox="0 0 72 72"
        radius={16}
        filled={false}
        scaleOnEnter={1.5}
        opacityOnEnter={1}
        amount={0.15}
        isHovered={isHovered}
        isOutside={isOutside}
        showIcon={true}
        iconType={iconType}
      />
    </>
  );
};

export default CustomCursor;
