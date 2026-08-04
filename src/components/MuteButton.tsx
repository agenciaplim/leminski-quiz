"use client";

import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

export default function MuteButton() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-leminski-blue text-white rounded-full shadow-[4px_4px_0px_#192B4D] hover:bg-leminski-blue/90 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
      aria-label={isMuted ? "Ativar som" : "Desativar som"}
    >
      {isMuted ? (
        <VolumeX className="w-8 h-8" />
      ) : (
        <Volume2 className="w-8 h-8" />
      )}
    </button>
  );
}
