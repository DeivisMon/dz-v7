import { useState } from "react";
import { useResponsive } from "../hooks/useResopnsive";

export default function ContactForm() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const responsive = useResponsive();

  const handleSend = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setIsFlipped(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
      <div
        className="w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side - Form */}
        <div
          className="absolute inset-0 flex items-center justify-center "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex flex-col gap-3 lg:gap-4 w-full">
            <h2 className="text-md lg:text-3xl font-bold text-center tracking-[clamp(0.5em,calc(0.05em+0.3vw),0.35em)] lg:mb-2 text-header">
              Parašyk man
            </h2>
            <input
              className="p-1 md:pt-6 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg"
              placeholder="Vardas"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <input
              className="p-1 md:pt-6 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg"
              type="email"
              placeholder="El.paštas"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <input
              className="p-1 md:pt-6 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg"
              type="tel"
              placeholder="Telefonas"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <textarea
              className="p-1 md:pt-3 border-b border-white/40 focus:outline-none focus:border-white/80 bg-transparent text-muted text-sm lg:text-lg resize-none"
              placeholder="Tavo Žinutė"
              rows={responsive.isShortScreen ? "1" : "3"}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
            <button
              className="bg-gray-500 text-text font-bold py-1 md:py-6 hover:bg-gray-200 hover:text-gray-900 transition duration-300 ease-in-out mt-1 uppercase"
              type="button"
              onClick={handleSend}
            >
              Siųsti
            </button>
          </div>
        </div>

        {/* Back Side - Success Message */}
        <div
          className="absolute inset-0 text-text flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h2 className="font-bold mb-4 text-center text-xl sm:text-3xl lg:text-4xl">
            Pranešimas išsiųstas
          </h2>
          <p className="text-md sm:text-xl">Ačiū! Netrukus susisieksime.</p>
        </div>
      </div>
    </div>
  );
}
