import { useState, useEffect } from "react";

const images = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/photo${i + 1}/400/300`,
  alt: `Portfolio ${i + 1}`,
}));

const words = ["Sviesa.", "Seselius.", "Istorijas.", "Emocijas.", "Momentus."];

/* ── animated cycling word ── */
function AnimatedWord() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const out = setTimeout(() => setPhase("out"), 1900);
    return () => clearTimeout(out);
  }, [index]);

  useEffect(() => {
    if (phase === "out") {
      const swap = setTimeout(() => {
        setIndex((p) => (p + 1) % words.length);
        setPhase("in");
      }, 420);
      return () => clearTimeout(swap);
    }
  }, [phase]);

  return (
    <span style={{ display: "inline-block", textAlign: "left" }}>
      <span
        style={{
          display: "inline-block",
          color: "#c9a96e",
          fontStyle: "italic",
          opacity: phase === "in" ? 1 : 0,
          transform: phase === "in" ? "translateY(0)" : "translateY(-18px)",
          filter: phase === "in" ? "blur(0)" : "blur(5px)",
          transition: "all 0.42s cubic-bezier(0.22,1,0.36,1)",
        }}
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
        width: 260, height: 172, flexShrink: 0,
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <img
        src={src} alt={alt}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: h ? 1 : 0.68,
          transform: h ? "scale(1.07)" : "scale(1)",
          transition: "opacity .4s ease, transform .5s cubic-bezier(0.22,1,0.36,1)",
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
  const itemW = 260, gap = 14;
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
            display: "flex", gap: `${gap}px`,
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
  useEffect(() => { const t = setTimeout(() => setOn(true), 50); return () => clearTimeout(t); }, []);

  const f = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(20px)",
    transition: `opacity .85s cubic-bezier(0.22,1,0.36,1) ${d}s, transform .85s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  });

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
color: "#e8e0d4",
    //   fontFamily: "'Playfair Display',Georgia,serif", position: "relative", overflow: "hidden",
    }}>
      {/* ambient glow */}
      <div style={{
        position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: 880, height: 880, borderRadius: "20%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 68%)",
        filter: "blur(72px)",
      }} />


      {/* center content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px 44px", position: "relative", zIndex: 10 }}>

        {/* label */}
        <div style={{ ...f(0.3), marginBottom: 18 }}>
          <span style={{ fontSize: "1.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#564e44", fontFamily: "'Gill Sans','Helvetica Neue',sans-serif" }}>
            — Apie mane —
          </span>
        </div>

        {/* name */}
        <h1 style={{
          ...f(0.42), textAlign: "center", margin: "0 0 14px",
          fontSize: "clamp(2.5rem,6.2vw,4.8rem)", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#e8e0d4",
        }}>
          Darius
          <span style={{ fontWeight: 300, color: "#a89a85" }}>Žvinklys</span>
        </h1>

        {/* word line */}
        <div style={{
          ...f(0.68), marginBottom: 34,
          fontSize: "clamp(1.45rem,3.6vw,2.5rem)", fontWeight: 300, letterSpacing: "0.01em",
        //   width: "100%", minWidth: "500px",
        }}>
          As iamzinu <AnimatedWord />
        </div>

        {/* bio */}
        <p style={{
          ...f(0.82), textAlign: "center", maxWidth: 510, margin: 0,
          color: "#6a6258", fontSize: "1.3rem", lineHeight: 1.95, fontWeight: 300,
        }}>
          Fotografas, susitelkęs į atmosferą, žmogaus buvimą ir ramias akimirkas. Tyrinėjantis šviesą, tekstūrą ir judėjimą per vaizdinį pasakojimą.
        </p>

        {/* gold rule */}
        <div style={{
          marginTop: 34, height: 1, background: "#c9a96e",
          width: on ? 354 : 0, transition: "width 1.1s cubic-bezier(0.22,1,0.36,1) 1.25s",
        }} />

        {/* stats */}
        <div style={{ ...f(1.4), display: "flex", gap: 44, marginTop: 26 }}>
          {[["5+","Metai patirties"],["10000+","Nuotrauku"],["200+","Laimingų Klientų"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.35rem", color: "#c9a96e", fontWeight: 300, letterSpacing: "0.04em" }}>{v}</div>
              <div style={{ fontSize: "0.56rem", color: "#564e44", textTransform: "uppercase", letterSpacing: "0.24em", fontFamily: "'Gill Sans','Helvetica Neue',sans-serif", marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* marquee */}
      <div style={{ width: "100%", position: "relative", zIndex: 10, paddingBottom: 28, paddingTop: 6 }}>
        {/* edge fades */}
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: 88, background: "linear-gradient(to right,#00000,transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: "0 0 0 auto", width: 88, background: "linear-gradient(to left,#0e0e0e,transparent)", zIndex: 2, pointerEvents: "none" }} />

        <MarqueeRow dir={1} dur={44} />
      </div>
    </div>
  );
}