"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export default function Home() {
  const { playSfx } = useAudio();
  return (
    <div className="flex flex-col items-center w-full min-h-full p-4 md:p-10 text-center overflow-y-auto relative">
      




      {/* Main Content (Center) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8 w-full my-8">
        
        {/* Imagem Central */}
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl px-4 md:px-0 shrink-0 mt-4">
          <img 
            src="/arte-leminski.png" 
            alt="Arte Festival Paulo Leminski" 
            className="w-full h-auto object-contain mix-blend-multiply" 
          />
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-lg">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 md:mb-4 uppercase tracking-wider">Quiz Interativo</h3>
          <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed opacity-90">
            Teste seus conhecimentos sobre o poeta e o festival e concorra a prêmios exclusivos!
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 w-full pb-8 shrink-0">
        <Link
          href="/cadastro"
          onClick={() => playSfx('select')}
          className="inline-flex items-center justify-center w-fit mx-auto py-4 px-8 md:py-6 md:px-12 rounded-full glass-button text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wider animate-bounce whitespace-nowrap"
        >
          Tocar para Iniciar
          <ChevronRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10" />
        </Link>
      </div>

      {/* Patrocinadores (Bottom) */}
      <div className="relative z-10 w-full mt-auto flex flex-col md:flex-row items-start justify-center gap-8 md:gap-16 opacity-100 bg-white p-4 md:p-6 rounded-[2rem]">
        {/* Rouanet */}
        <div className="flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-widest uppercase mb-4 font-bold opacity-0 select-none pointer-events-none">X</p>
            <div className="h-12 md:h-20 flex items-center justify-center">
              <img src="/logo-rouanet.png" alt="Lei Rouanet" className="h-12 md:h-16 object-contain mix-blend-multiply" />
            </div>
        </div>
        
        {/* Patrocinadores */}
        <div className="flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-widest text-leminski-blue uppercase mb-4 font-bold">Patrocínio</p>
            <div className="h-12 md:h-20 flex items-center gap-6 md:gap-8 justify-center">
                <img src="/logo-ourocard.png" alt="Ourocard" className="h-10 md:h-14 object-contain mix-blend-multiply" />
                <img src="/logo-bb.png" alt="Itaipu" className="h-12 md:h-16 object-contain mix-blend-multiply" />
            </div>
        </div>

        {/* MinC */}
        <div className="flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-widest text-leminski-blue uppercase mb-4 font-bold">Incentivo Cultural</p>
            <div className="h-12 md:h-20 flex items-center justify-center">
              <img src="/logo-minc.png" alt="Ministério da Cultura" className="h-8 md:h-10 object-contain mix-blend-multiply" />
            </div>
        </div>
      </div>
    </div>
  );
}
