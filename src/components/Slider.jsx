import "./slider.css";
import { useEffect, useRef } from "react";
import { useDeviceType } from "./hooks/useDeviceType";
import { sliderData } from "./sliderData";

const Slider = () => {
  const sliderRef = useRef(null);
  const { isVerticalMobile, isHorizontalMobile } = useDeviceType();

  useEffect(() => {
    const config = {
      SCROLL_SPEED: 1.75,
      LERP_FACTOR: 0.05,
      MAX_VELOCITY: 150,
      SNAP_THRESHOLD: 0.5,
      SNAP_DELAY: 100,
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
      snapTimeout: null,
    };

    function createSlideElement(index) {
      const slide = document.createElement("div");
      slide.className = "slide";

      if (isVerticalMobile) {
        slide.style.width = "97vw";
        slide.style.height = "90vh";
      } else if (isHorizontalMobile) {
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
      
      if (isVerticalMobile) {
        state.slideWidth = window.innerWidth;
      } else if (isHorizontalMobile) {
        state.slideWidth = 185;
      } else {
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

        img.style.transform = `translateX(${parallaxOffset}px) scale(1.75)`;
      });
    }

    function snapToNearestSlide() {
      if (!isVerticalMobile) {
        return;
      }

      const viewportCenter = window.innerWidth / 2;
      
      const slideCenter = state.slideWidth / 2;
      const centerOffset = viewportCenter - slideCenter;
      
      const currentOffset = state.currentX + centerOffset;
      const nearestSlideIndex = Math.round(currentOffset / state.slideWidth);
      
      const newTarget = (nearestSlideIndex * state.slideWidth) - centerOffset;
      
      state.targetX = newTarget;
    }

    function checkAndInitiateSnap() {
      if (!isVerticalMobile || state.isDragging) {
        if (state.snapTimeout) {
          clearTimeout(state.snapTimeout);
          state.snapTimeout = null;
        }
        return;
      }

      if (state.snapTimeout) {
        clearTimeout(state.snapTimeout);
      }

      state.snapTimeout = setTimeout(() => {
        const timeSinceScroll = Date.now() - state.lastScrollTime;
        const isStill = state.velocity < config.SNAP_THRESHOLD;
        
        if (timeSinceScroll > 50 && isStill && !state.isDragging) {
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

      if (wasMoving && !state.isMoving && !state.isDragging && isVerticalMobile) {
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
  }, [isVerticalMobile, isHorizontalMobile]);

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slide-track"></div>
    </div>
  );
};

export default Slider;
