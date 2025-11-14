import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

// Fullscreen Wiper using one WebGL quad + fragment shader.
// - Fast: single draw call
// - Configurable grid (rows/cols) and stagger amount
// - Use `start()` to trigger the wipe; by default it auto-runs once on mount

export default function WiperGL({
  rows = 16,
  cols = 16,
  duration = 1.25, // total duration of the wipe progress from 0->1
  staggerAmount = 1.25, // how much extra stagger to apply across the grid
  autoStart = true,
  zIndex = 99999,
  onComplete = () => {},
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2, 2]} />
          <WiperMaterial
            rows={rows}
            cols={cols}
            duration={duration}
            staggerAmount={staggerAmount}
            autoStart={autoStart}
            onComplete={onComplete}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

function WiperMaterial({ rows, cols, duration, staggerAmount, autoStart, onComplete }) {
  const matRef = useRef();
  const { viewport } = useThree();

  // shaders
  const vertex = useMemo(() => {
    return `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }, []);

  const fragment = useMemo(() => {
    return `
      precision highp float;
      varying vec2 vUv;

      uniform float u_progress; // 0..1 global progress
      uniform float u_rows;
      uniform float u_cols;
      uniform float u_staggerAmount; // how many seconds spread across the grid

      // ease in-out
      float ease(float t) {
        return t * t * (3.0 - 2.0 * t);
      }

      void main() {
        // compute which tile we're in
        vec2 gridUV = vUv * vec2(u_cols, u_rows);
        vec2 tileIndex = floor(gridUV);
        vec2 tileFrac = fract(gridUV);

        // convert tile index to normalized coordinates (0..1)
        float nx = tileIndex.x / (u_cols - 1.0);
        float ny = tileIndex.y / (u_rows - 1.0);

        // Create a stagger delay based on row-first order from the top
        // We want top rows to start earlier -> use ny
        float delay = ny * u_staggerAmount;

        // Local tile progress: subtract delay and clamp
        float local = clamp((u_progress - delay) / (1.0 - u_staggerAmount), 0.0, 1.0);
        local = ease(local);

        // tile shrink effect: produce a mask that goes from full to zero
        // We'll shrink tiles by scaling the coordinate around center and use smoothstep
        vec2 centered = tileFrac - 0.5;
        float tileScale = mix(1.0, 0.0, local); // 1 -> 0
        vec2 scaled = centered / tileScale + 0.5;

        // if tileScale is 0, avoid divide by zero
        if (tileScale < 0.001) {
          // fully gone
          discard; // fully transparent
        }

        // compute mask using a soft edge
        float edge = 0.02; // softness
        float mask = smoothstep(0.0, edge, scaled.x) * (1.0 - smoothstep(1.0 - edge, 1.0, scaled.x));
        mask *= smoothstep(0.0, edge, scaled.y) * (1.0 - smoothstep(1.0 - edge, 1.0, scaled.y));

        // final color: black tile with mask alpha
        vec3 col = vec3(0.0);
        float alpha = mask;

        if (alpha <= 0.0) discard; // transparent pixel

        gl_FragColor = vec4(col, alpha);
      }
    `;
  }, []);

  // initialize the material and uniforms
  useEffect(() => {
    if (!matRef.current) return;
    const mat = matRef.current;

    // ensure correct numeric types
    mat.uniforms.u_rows.value = rows;
    mat.uniforms.u_cols.value = cols;
    mat.uniforms.u_staggerAmount.value = staggerAmount;
    mat.uniforms.u_progress.value = 0.0;

    // auto-start animation
    if (autoStart) {
      const tl = gsap.timeline({ onComplete: onComplete });
      tl.to(mat.uniforms.u_progress, { value: 1, duration: duration, ease: "power2.inOut" });
      return () => tl.kill();
    }
  }, [rows, cols, duration, staggerAmount, autoStart, onComplete]);

  // useFrame to update if you want other effects (not required now)
  useFrame(() => {
    // no-op: uniforms are driven by GSAP for smooth timing and to avoid per-frame JS math
  });

  // Return a shaderMaterial using the raw three ShaderMaterial via args prop
  return (
    // @ts-ignore - react-three-fiber supports shaderMaterial via primitive or <shaderMaterial args=... />
    <shaderMaterial
      ref={matRef}
      transparent
      depthTest={false}
      depthWrite={false}
      uniforms={{
        u_progress: { value: 0.0 },
        u_rows: { value: rows },
        u_cols: { value: cols },
        u_staggerAmount: { value: staggerAmount },
      }}
      vertexShader={vertex}
      fragmentShader={fragment}
    />
  );
}


/* Usage:

1) Install deps:
   npm i three @react-three/fiber gsap

2) Import and use:
   import WiperGL from "./WiperGL";
   <WiperGL rows={12} cols={12} duration={1.2} />

Notes:
- This shader renders black tiles as transparent holes over the canvas (canvas is transparent),
  so the page underneath will be revealed as tiles shrink.
- The fragment shader uses `discard` for fully transparent pixels; that keeps blending cheap.
- Tweak `rows` and `cols` to balance visual detail vs performance (8-12 is usually perfect).
- If you prefer the wipe to run on-demand, set `autoStart={false}` and expose control by
  animating the material uniform from outside (via ref) or wiring a global event.
*/
