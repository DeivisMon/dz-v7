// ShaderOverlay.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderOverlay({ currentSlideIndex, imgRefs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = width;
    captureCanvas.height = height;
    const ctx = captureCanvas.getContext("2d");

    const captureTexture = new THREE.CanvasTexture(captureCanvas);
    captureTexture.minFilter = THREE.LinearFilter;
    captureTexture.magFilter = THREE.LinearFilter;

    const gridSize = 25;
    const totalSize = gridSize * gridSize * 4;
    const data = new Float32Array(totalSize);
    for (let i = 3; i < totalSize; i += 4) data[i] = 1.0;

    const dataTexture = new THREE.DataTexture(
      data,
      gridSize,
      gridSize,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.magFilter = dataTexture.minFilter = THREE.NearestFilter;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uDataTexture;
      uniform sampler2D uScreenTexture;
      varying vec2 vUv;
      void main() {
        vec2 offset = texture2D(uDataTexture, vUv).rg;
        vec2 uv = vUv + offset * 0.01;
        uv = clamp(uv, 0.0, 1.0);
        gl_FragColor = texture2D(uScreenTexture, uv);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uDataTexture: { value: dataTexture },
        uScreenTexture: { value: captureTexture },
      },
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
    const settings = {
      relaxation: 0.925,
      mouseInfluence: 0.25,
      strength: 0.1,
    };

    const captureScreen = () => {
      ctx.clearRect(0, 0, width, height);
      const img = imgRefs.current?.[currentSlideIndex];
      if (img?.complete && img.naturalWidth > 0) {
        try {
          ctx.drawImage(img, 0, 0, width, height);
        } catch (e) {
          console.warn("CORS or image not ready");
        }
      }
      captureTexture.needsUpdate = true;
    };

    captureScreen();

    const updateDataTexture = () => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] *= settings.relaxation;
        data[i + 1] *= settings.relaxation;
      }

      if (Math.abs(mouse.vX) < 0.001 && Math.abs(mouse.vY) < 0.001) {
        mouse.vX *= 0.9;
        mouse.vY *= 0.9;
        dataTexture.needsUpdate = true;
        return;
      }

      const gridMouseX = gridSize * mouse.x;
      const gridMouseY = gridSize * (1 - mouse.y);
      const maxDist = gridSize * settings.mouseInfluence;
      const maxDistSq = maxDist * maxDist;
      const aspect = height / width;
      const strengthFactor = settings.strength * 100;

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
          if (distance < maxDistSq) {
            const index = 4 * (i + gridSize * j);
            const dist = Math.sqrt(distance);
            const power = Math.min(10, maxDist / (dist + 0.001));
            data[index] += strengthFactor * mouse.vX * power;
            data[index + 1] -= strengthFactor * mouse.vY * power;
          }
        }
      }

      mouse.vX *= 0.9;
      mouse.vY *= 0.9;
      dataTexture.needsUpdate = true;
    };

    let lastCapture = Date.now();
    const CAPTURE_INTERVAL = 300;

    const animate = () => {
      const now = Date.now();
      if (now - lastCapture > CAPTURE_INTERVAL) {
        captureScreen();
        lastCapture = now;
      }
      updateDataTexture();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      const newX = e.clientX / width;
      const newY = e.clientY / height;
      mouse.vX = newX - mouse.prevX;
      mouse.vY = newY - mouse.prevY;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = newX;
      mouse.y = newY;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      captureCanvas.width = w;
      captureCanvas.height = h;
      setTimeout(captureScreen, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      captureTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentSlideIndex]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}