import { useState, useEffect } from "react";
import { galleryData } from "./galleryData";

const items = galleryData.filter((item) => item.tag.includes("menas"));

const images = items.map((item, i) => ({
  src: item.img,
  alt: `gallery image ${i + 1}`,
}));

const words = ["Šviesą", "Spalvas", "Istorijas", "Emocijas", "Momentą"];

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
    <span className="inline-block">
      <span
        className="inline-block font-bold italic uppercase transition-all text-accent duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: phase === "in" ? 1 : 0,
          transform:
            phase === "in"
              ? "translateY(0)"
              : "translateY(-5px) scale(0.975) rotateX(-60deg)",
          filter: phase === "in" ? "blur(0)" : "blur(5px)",
        }}
      >
        {words[index]}
      </span>
    </span>
  );
}

/* ── single marquee image tile ── */
function MarqueeImage({ src, alt }) {
  return (
    <div className="w-[170px] h-[112px] md:w-[260px] md:h-[172px] shrink-0 overflow-hidden group">
      <img
        src={src}
        alt={alt}
        className="
          w-full h-full object-cover object-top pointer-events-none
          opacity-70 scale-100
          transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:opacity-100
          group-hover:scale-[1.07]
        "
      />
    </div>
  );
}

/* ── infinite marquee row ── */
function MarqueeRow({ dir = 1, dur = 42 }) {
  const items = [...images, ...images, ...images];
  const itemW = 260;
  const gap = 14;
  const segW = images.length * (itemW + gap);
  const name = dir > 0 ? "mL" : "mR";

  return (
    <>
      <style>{`
        @keyframes mL {
          from { transform: translateX(0) }
          to { transform: translateX(-${segW}px) }
        }
        @keyframes mR {
          from { transform: translateX(-${segW}px) }
          to { transform: translateX(0) }
        }
      `}</style>

      <div className="overflow-hidden w-full">
        <div
          className="flex gap-[4px] xl:gap-[14px]"
          style={{
            width: items.length * (itemW + gap),
            animation: `${name} ${dur}s linear infinite`,
          }}
        >
          {items.map((img, i) => (
            <MarqueeImage key={i} {...img} />
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

  const fadeUp = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(20px)",
    transition: `opacity .85s cubic-bezier(0.22,1,0.36,1) ${d}s,
                 transform .85s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  });

  const fadeMarquee = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateX(0)" : "translateX(-80px)",
    transition: `opacity .85s cubic-bezier(0.22,1,0.36,1) ${d}s,
                 transform .85s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  });

  return (
    <div className="h-[100dvh] flex flex-col bg-bckg text-text">
      {/* ambient glow */}
      {/* <div
        className="
          fixed top-[5%] left-1/2 -translate-x-1/2
          w-[880px] h-[880px] rounded-[20%]
          pointer-events-none blur-[72px]
        "
        style={{
          background:
            "radial-gradient(circle, rgba(166,124,82,0.06) 0%, transparent 68%)",
        }}
      /> */}

      {/* center content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pb-2">
        {/* word line */}
        <div
          style={fadeUp(0.68)}
          className="
            mb-3 md:mb-7 flex items-center font-medium tracking-[0.1em]
            text-[clamp(1.25rem,2.5vw,2.5rem)]
          "
        >
          Įamžinkime Jūsų&nbsp;
          <span className="block w-[10ch]">
            <AnimatedWord />
          </span>
        </div>

        {/* bio */}
        <p
          style={fadeUp(0.82)}
          className="
            max-w-[610px] text-center text-muted
            leading-[1.95] font-extralight  md:text-xl text-md
            flex flex-col items-center
          "
        >
          Sveiki as Darius, fotografas is Klaipedos, susitelkęs į atmosferą,
          žmogaus buvimą ir ramias akimirkas. Tyrinėjantis šviesą, tekstūrą ir
          judėjimą per vaizdinį pasakojimą.

          <span
            className="mt-2 md:mt-8 h-px bg-border transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: on ? "80%" : 0 }}
          />
        </p>

        {/* stats */}
        <div
          style={fadeUp(1.4)}
          className="mt-2 md:mt-6 flex gap-8"
        >
          {[
            ["5+", "Metai patirties"],
            ["100000+", "Nuotraukų"],
            ["200+", "Laimingų Klientų"],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-xl md:text-4xl font-light text-accent tracking-wide">
                {v}
              </div>
              <div className="mt-1 text-[0.5rem] md:text-nd uppercase tracking-[0.24em] text-muted">
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* categories */}
        <div className="flex flex-col items-center">
          <span
            className="mt-4 md:mt-8 h-px bg-border transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: on ? "80%" : 0 }}
          />

          <div
            style={fadeUp(1.4)}
            className="mt-4 md:mt-14 flex flex-col items-center md:flex-row gap-2 md:gap-8"
          >
            {[
              "Fotosesijos",
              "Renginiai",
              "Sporto varžybos",
              "Komercinė fotografija",
              "Kraštovaizdžiai",
            ].map((l) => (
              <div key={l} className="text-xs md:text-md uppercase tracking-[0.24em] text-text">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* marquee */}
      <div style={fadeMarquee(.25)} className="relative z-10 w-full md:pb-6">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[88px] bg-gradient-to-r from-black to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[88px] bg-gradient-to-l from-[#0e0e0e] to-transparent z-20" />

        <MarqueeRow dir={1} dur={124} />
      </div>
    </div>
  );
}
