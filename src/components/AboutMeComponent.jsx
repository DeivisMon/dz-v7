import { useState, useEffect } from "react";
import { galleryData } from "./galleryData";

const items = galleryData.filter((item) => item.tag.includes("menas"));

const images = items.map((item, i) => ({
  src: item.img,
  alt: `gallery image ${i + 1}`,
}));

const words = ["Sviesą.", "Spalvas.", "Istorijas.", "Emocijas.", "Momentus."];

/* ── animated cycling word ── */
function AnimatedWord() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const out = setTimeout(() => setPhase("out"), 2500);
    return () => clearTimeout(out);
  }, [index]);

  useEffect(() => {
    if (phase === "out") {
      const swap = setTimeout(() => {
        setIndex((p) => (p + 1) % words.length);
        setPhase("in");
      }, 500);
      return () => clearTimeout(swap);
    }
  }, [phase]);

  return (
    <span style={{ display: "inline-block" }}>
      <span
        style={{
          display: "inline-block",
          fontStyle: "italic",
          opacity: phase === "in" ? 1 : 0,
          transform: phase === "in" ? "translateY(0)" : "translateY(-5px) scale(0.975) rotateX(-60deg)",
          filter: phase === "in" ? "blur(0)" : "blur(5px)",
          transition: "all 0.75s cubic-bezier(0.22,1,0.36,1)",
          textTransform: "uppercase",
        }}
        className="font-bold"
      >
        {words[index]}
      </span>
    </span>
  );
}

/* ── single marquee image tile ── */
function MarqueeImage({ src, alt }) {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        width: 260,
        height: 172,
        flexShrink: 0,
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          opacity: h ? 1 : 0.68,
          transform: h ? "scale(1.07)" : "scale(1)",
          transition:
            "opacity .4s ease, transform .5s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ── infinite marquee row ── */
function MarqueeRow({ dir = 1, dur = 42 }) {
  // triple the array so seamless loop
  const items = [...images, ...images, ...images];
  const itemW = 260,
    gap = 14;
  const segW = images.length * (itemW + gap); // one full segment width

  const name = dir > 0 ? "mL" : "mR";

  return (
    <>
      <style>{`
        @keyframes mL { from { transform: translateX(0) } to { transform: translateX(-${segW}px) } }
        @keyframes mR { from { transform: translateX(-${segW}px) } to { transform: translateX(0) } }
      `}</style>
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: `${gap}px`,
            width: `${items.length * (itemW + gap)}px`,
            animation: `${name} ${dur}s linear infinite`,
          }}
        >
          {items.map((img, i) => (
            <MarqueeImage key={i} src={img.src} alt={img.alt} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ── main page ── */
export default function About() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const f = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(20px)",
    transition: `opacity .85s cubic-bezier(0.22,1,0.36,1) ${d}s, transform .85s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#e8e0d4",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 880,
          height: 880,
          borderRadius: "20%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 68%)",
          filter: "blur(72px)",
        }}
      />

      {/* center content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px 44px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* word line */}
        <div
          style={{
            ...f(0.68),
            marginBottom: 34,
            fontSize: "clamp(1.45rem,3.6vw,2.5rem)",
            fontWeight: 300,
            letterSpacing: "0.1em",
            width: "100%",
            textAlign: "center",
          }}
          className="font-bold"
        >
          Raskime Jusu
          <span
            style={{
              display: "block",
              // width: "10ch", 
            }}
          >
            <AnimatedWord />
          </span>
        </div>

        {/* bio */}
        <p
          style={{
            ...f(0.82),
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 610,
            margin: 0,
            color: "#564e44",
            fontSize: "1.3rem",
            lineHeight: 1.95,
            fontWeight: 300,
          }}
        >
          Sveiki as Darius, fotografas is Klaipedos, susitelkęs į atmosferą,
          žmogaus buvimą ir ramias akimirkas. Tyrinėjantis šviesą, tekstūrą ir
          judėjimą per vaizdinį pasakojimą.
          {/* gold rule */}
          <span
            style={{
              marginTop: 34,
              height: 1,
              background: "#564e44",
              width: on ? "80%" : 0,
              transition: "width 1.1s cubic-bezier(0.22,1,0.36,1) 1.25s",
            }}
          />
        </p>

        {/* stats */}
        <div style={{ ...f(1.4), display: "flex", gap: 44, marginTop: 26 }}>
          {[
            ["5+", "Metai patirties"],
            ["100000+", "Nuotraukų"],
            ["200+", "Laimingų Klientų"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  color: "#a0a0a0",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#564e44",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  marginTop: 5,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* marquee */}
      <div
        style={{
          width: "100%",
          position: "relative",
          zIndex: 10,
          paddingBottom: 28,
          paddingTop: 6,
        }}
      >
        {/* edge fades */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: 88,
            background: "linear-gradient(to right,#00000,transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0 0 0 auto",
            width: 88,
            background: "linear-gradient(to left,#0e0e0e,transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <MarqueeRow dir={1} dur={124} />
      </div>
    </div>
  );
}
