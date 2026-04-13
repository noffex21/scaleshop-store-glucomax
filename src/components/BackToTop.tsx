"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 right-4 z-[100] w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all active:scale-95"
    >
      {/* Top bar line */}
      <div className="flex flex-col items-center justify-center gap-0">
        <div className="w-4 h-[2px] bg-gray-800 rounded-full mb-[3px]" />
        <ArrowUp className="w-4 h-4 text-gray-800" strokeWidth={2.5} />
      </div>
    </button>
  );
}
