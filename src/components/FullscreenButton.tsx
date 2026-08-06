"use client";

import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Erro ao tentar entrar em tela cheia:", err);
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.error("Erro ao tentar sair de tela cheia:", err);
        }
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-leminski-blue text-white rounded-full shadow-xl hover:bg-leminski-blue/90 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center border-2 border-transparent hover:border-white/20"
      aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
    >
      {isFullscreen ? (
        <Minimize className="w-8 h-8" />
      ) : (
        <Maximize className="w-8 h-8" />
      )}
    </button>
  );
}
