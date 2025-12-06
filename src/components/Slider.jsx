import { useEffect, useRef } from "react";
import { sliderData } from "./sliderData";

const Slider = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const config = {
      SCROLL_SPEED: 1.75,
      LERP_FACTOR: 0.05,
      MAX_VELOCITY: 150,
      SNAP_THRESHOLD: 0.5, // How close to stop before snapping
      SNAP_DELAY: 500, // Delay before snapping starts (reduced for faster response)
    };

    const totalSlideCount = sliderData.length;

    const state = {
      currentX: 0,
      targetX: 0,
      slideWidth: 510,
      slides: [],
      isDragging: false,
      startX: 0,
      lastX: 0,
      lastMouseX: 0,
      lastScrollTime: Date.now(),
      isMoving: false,
      velocity: 0,
      lastCurrentX: 0,
      dragDistance: 0,
      hasActuallyDragged: false,
      isHorizontalMobile: false,
      isVerticalMobile: false,
      shouldSnap: false,
      snapTimeout: null,
    };

    function checkMobile() {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isSmallScreen = window.innerWidth < 768;
      
      state.isVerticalMobile = isPortrait && isSmallScreen;
      state.isHorizontalMobile = window.innerHeight < 500 && !state.isVerticalMobile;
      
      console.log('Device check:', {
        isPortrait,
        isSmallScreen,
        isVerticalMobile: state.isVerticalMobile,
        isHorizontalMobile: state.isHorizontalMobile,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    function createSlideElement(index) {
      const slide = document.createElement("div");
      slide.className = "slide";

      if (state.isVerticalMobile) {
        slide.style.width = "95vw";
        slide.style.height = "90vh";
      } else if (state.isHorizontalMobile) {
        slide.style.width = "175px";
        slide.style.height = "80vh";
      }

      const imageContainer = document.createElement("div");
      imageContainer.className = "slide-image";

      const img = document.createElement("img");
      const dataIndex = index % totalSlideCount;
      img.src = sliderData[dataIndex].img;
      img.alt = sliderData[dataIndex].title;

      const overlay = document.createElement("div");
      overlay.className = "slide-overlay";

      imageContainer.appendChild(img);
      slide.appendChild(imageContainer);
      slide.appendChild(overlay);

      return slide;
    }

    function initializeSlides() {
      const track = sliderRef.current?.querySelector(".slide-track");
      if (!track) return;

      track.innerHTML = "";
      state.slides = [];

      checkMobile();
      
      if (state.isVerticalMobile) {
        // Calculate 95vw + margins (2.5vw each side = 5vw total)
        // Total space per slide = 95vw + 5vw = 100vw (full width)
        state.slideWidth = window.innerWidth;
      } else if (state.isHorizontalMobile) {
        // 175px width + 10px for margins
        state.slideWidth = 185;
      } else {
        // Desktop: 500px width + 10px for margins
        state.slideWidth = 510;
      }

      const copies = 6;
      const totalSlides = totalSlideCount * copies;

      for (let i = 0; i < totalSlides; i++) {
        const slide = createSlideElement(i);
        track.appendChild(slide);
        state.slides.push(slide);
      }

      const startOffset = -(totalSlideCount * state.slideWidth * 2);
      state.currentX = startOffset;
      state.targetX = startOffset;
    }

    function updateSlidePositions() {
      const track = sliderRef.current?.querySelector(".slide-track");
      if (!track) return;

      const sequenceWidth = state.slideWidth * totalSlideCount;

      if (state.currentX > -sequenceWidth * 1) {
        state.currentX -= sequenceWidth;
        state.targetX -= sequenceWidth;
      } else if (state.currentX < -sequenceWidth * 4) {
        state.currentX += sequenceWidth;
        state.targetX += sequenceWidth;
      }

      track.style.transform = `translate3d(${state.currentX}px, 0, 0)`;
    }

    function updateParallax() {
      const viewportCenter = window.innerWidth / 2;

      state.slides.forEach((slide) => {
        const img = slide.querySelector("img");
        if (!img) return;

        const slideRect = slide.getBoundingClientRect();

        if (
          slideRect.right < -500 ||
          slideRect.left > window.innerWidth + 500
        ) {
          return;
        }

        const slideCenter = slideRect.left + slideRect.width / 2;
        const distanceFromCenter = slideCenter - viewportCenter;
        const parallaxOffset = distanceFromCenter * -0.25;

        img.style.transform = `translateX(${parallaxOffset}px) scale(2.25)`;
      });
    }

    function snapToNearestSlide() {
      if (!state.isVerticalMobile) {
        console.log('Not vertical mobile, snap skipped');
        return;
      }

      console.log('SNAP TRIGGERED!');
      const viewportCenter = window.innerWidth / 2;
      
      // Calculate the offset needed to center a slide
      const slideCenter = state.slideWidth / 2;
      const centerOffset = viewportCenter - slideCenter;
      
      // Find which slide should be centered based on current position
      const currentOffset = state.currentX + centerOffset;
      const nearestSlideIndex = Math.round(currentOffset / state.slideWidth);
      
      // Calculate the target position to center that slide
      const newTarget = (nearestSlideIndex * state.slideWidth) - centerOffset;
      
      console.log('Current X:', state.currentX);
      console.log('Target X before snap:', state.targetX);
      console.log('New Target X:', newTarget);
      console.log('Distance to snap:', Math.abs(newTarget - state.currentX));
      
      state.targetX = newTarget;
    }

    function checkAndInitiateSnap() {
      if (!state.isVerticalMobile || state.isDragging) {
        if (state.snapTimeout) {
          clearTimeout(state.snapTimeout);
          state.snapTimeout = null;
        }
        return;
      }

      console.log('Check snap - velocity:', state.velocity, 'isDragging:', state.isDragging);

      // Clear existing timeout
      if (state.snapTimeout) {
        clearTimeout(state.snapTimeout);
      }

      // Set timeout to snap after movement stops
      state.snapTimeout = setTimeout(() => {
        const timeSinceScroll = Date.now() - state.lastScrollTime;
        const isStill = state.velocity < config.SNAP_THRESHOLD;
        
        console.log('Snap check:', { timeSinceScroll, isStill, velocity: state.velocity, isDragging: state.isDragging });
        
        if (timeSinceScroll > 50 && isStill && !state.isDragging) {
          console.log('CONDITIONS MET - SNAPPING NOW');
          snapToNearestSlide();
        }
      }, config.SNAP_DELAY);
    }

    function updateMovingState() {
      state.velocity = Math.abs(state.currentX - state.lastCurrentX);
      state.lastCurrentX = state.currentX;

      const isSlowEnough = state.velocity < 0.1;
      const hasBeenStillLongEnough = Date.now() - state.lastScrollTime > 200;
      
      const wasMoving = state.isMoving;
      state.isMoving =
        state.hasActuallyDragged || !isSlowEnough || !hasBeenStillLongEnough;

      document.documentElement.style.setProperty(
        "--slider-moving",
        state.isMoving ? "1" : "0"
      );

      // Trigger snap when transitioning from moving to not moving
      if (wasMoving && !state.isMoving && !state.isDragging && state.isVerticalMobile) {
        console.log('Stopped moving - initiating snap');
        checkAndInitiateSnap();
      }
    }

    function animate() {
      state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;

      updateMovingState();
      updateSlidePositions();
      updateParallax();

      requestAnimationFrame(animate);
    }

    function handleWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      e.preventDefault();
      state.lastScrollTime = Date.now();
      state.shouldSnap = false;

      const scrollDelta = e.deltaY * config.SCROLL_SPEED;
      state.targetX -= Math.max(
        Math.min(scrollDelta, config.MAX_VELOCITY),
        -config.MAX_VELOCITY
      );
    }

    function handleTouchStart(e) {
      state.isDragging = true;
      state.shouldSnap = false;
      state.startX = e.touches[0].clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.hasActuallyDragged = false;
      state.lastScrollTime = Date.now();
      
      if (state.snapTimeout) {
        clearTimeout(state.snapTimeout);
        state.snapTimeout = null;
      }
    }

    function handleTouchMove(e) {
      if (!state.isDragging) return;

      const deltaX = (e.touches[0].clientX - state.startX) * 1.5;
      state.targetX = state.lastX + deltaX;
      state.dragDistance = Math.abs(deltaX);

      if (state.dragDistance > 5) {
        state.hasActuallyDragged = true;
      }

      state.lastScrollTime = Date.now();
    }

    function handleTouchEnd() {
      state.isDragging = false;
      state.lastScrollTime = Date.now();
      setTimeout(() => {
        state.hasActuallyDragged = false;
      }, 100);
    }

    function handleMouseDown(e) {
      e.preventDefault();
      state.isDragging = true;
      state.shouldSnap = false;
      state.startX = e.clientX;
      state.lastMouseX = e.clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.hasActuallyDragged = false;
      state.lastScrollTime = Date.now();
      
      if (state.snapTimeout) {
        clearTimeout(state.snapTimeout);
        state.snapTimeout = null;
      }
    }

    function handleMouseMove(e) {
      if (!state.isDragging) return;

      e.preventDefault();
      const deltaX = (e.clientX - state.lastMouseX) * 2;
      state.targetX += deltaX;
      state.lastMouseX = e.clientX;
      state.dragDistance += Math.abs(deltaX);

      if (state.dragDistance > 5) {
        state.hasActuallyDragged = true;
      }

      state.lastScrollTime = Date.now();
    }

    function handleMouseUp() {
      state.isDragging = false;
      state.lastScrollTime = Date.now();
      setTimeout(() => {
        state.hasActuallyDragged = false;
      }, 100);
    }

    function handleResize() {
      initializeSlides();
    }

    function initializeEventListeners() {
      const slider = sliderRef.current;
      if (!slider) return;

      slider.addEventListener("wheel", handleWheel, { passive: false });
      slider.addEventListener("touchstart", handleTouchStart);
      slider.addEventListener("touchmove", handleTouchMove);
      slider.addEventListener("touchend", handleTouchEnd);
      slider.addEventListener("mousedown", handleMouseDown);
      slider.addEventListener("mouseleave", handleMouseUp);
      slider.addEventListener("dragstart", (e) => e.preventDefault());

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("resize", handleResize);

      return () => {
        slider.removeEventListener("wheel", handleWheel);
        slider.removeEventListener("touchstart", handleTouchStart);
        slider.removeEventListener("touchmove", handleTouchMove);
        slider.removeEventListener("touchend", handleTouchEnd);
        slider.removeEventListener("mousedown", handleMouseDown);
        slider.removeEventListener("mouseleave", handleMouseUp);
        slider.removeEventListener("dragstart", (e) => e.preventDefault());

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("resize", handleResize);
      };
    }

    function initializeSlider() {
      initializeSlides();
      const cleanup = initializeEventListeners();
      animate();
      return cleanup;
    }

    const cleanup = initializeSlider();

    return cleanup;
  }, []);

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slide-track"></div>
    </div>
  );
};
export default Slider;
