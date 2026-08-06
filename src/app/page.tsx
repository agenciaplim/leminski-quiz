"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export default function Home() {
  const { playSfx } = useAudio();
  return (
    <div 
      className="flex flex-col items-center justify-between w-full min-h-full p-4 md:p-10 text-center overflow-y-auto relative"
      style={{
        backgroundImage: "url('/arte-leminski.png')",
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#E34832" // Cor exata do CSS bg-leminski-red para mesclar bordas invisivelmente
      }}
    >
      
      {/* Overlay escuro sutil para garantir legibilidade, se necessário */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* Main Content (Center) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end md:justify-center space-y-6 md:space-y-8 w-full my-4 mt-[30vh] md:mt-48">
        
        <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-lg mt-auto">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 md:mb-4 uppercase tracking-wider text-leminski-blue">Quiz Interativo</h3>
          <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed opacity-90">
            Teste seus conhecimentos sobre o poeta e o festival e concorra a prêmios exclusivos!
          </p>
        </div>
      </div>

      {/* Action Button (Bottom) */}
      <div className="relative z-10 w-full flex flex-col items-center shrink-0 space-y-8 pb-4 md:pb-8">
        <Link
          href="/cadastro"
          onClick={() => playSfx('select')}
          className="inline-flex items-center justify-center w-fit mx-auto py-4 px-8 md:py-6 md:px-12 rounded-full glass-button text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wider animate-bounce whitespace-nowrap"
        >
          Tocar para Iniciar
          <ChevronRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10" />
        </Link>

        {/* Logos Area (Rodapé) */}
        <div className="w-full flex justify-between items-end px-4 md:px-12 pt-4 border-t-2 border-leminski-blue/20">
          <div className="text-left flex flex-col items-start">
            <p className="text-[10px] md:text-xs tracking-widest text-leminski-blue uppercase mb-1 md:mb-2 font-bold">Realização</p>
            <img src="/logo-realizacao.png" alt="Realização" className="h-8 md:h-12 lg:h-16 object-contain" />
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] md:text-xs tracking-widest text-leminski-blue uppercase mb-1 md:mb-2 font-bold">Patrocínio</p>
            <img src="/logo-patrocinio.png" alt="Patrocínio" className="h-8 md:h-12 lg:h-16 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
