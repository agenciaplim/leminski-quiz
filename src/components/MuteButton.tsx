"use client";

import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX, Plus, Minus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MuteButton() {
  const { isMuted, volume, toggleMute, changeVolume } = useAudio();
  const pathname = usePathname();

  if (pathname === '/admin') return null;

  const isQuiz = pathname?.startsWith('/quiz');
  const positionClass = isQuiz ? "bottom-6" : "top-6";

  return (
    <div className={`fixed ${positionClass} right-6 z-50 flex items-center bg-leminski-blue text-white rounded-full shadow-xl overflow-hidden border-2 border-transparent hover:border-white/20 transition-all`}>
      <button
        onClick={() => changeVolume(-0.1)}
        className="w-12 h-14 flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors"
        aria-label="Diminuir som"
        disabled={volume <= 0}
      >
        <Minus className="w-5 h-5" />
      </button>

      <button
        onClick={toggleMute}
        className="w-14 h-14 flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors border-x border-white/10"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={() => changeVolume(0.1)}
        className="w-12 h-14 flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors"
        aria-label="Aumentar som"
        disabled={volume >= 1}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
