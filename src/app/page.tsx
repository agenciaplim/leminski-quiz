"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export default function Home() {
  const { playSfx } = useAudio();
  return (
    <div className="flex flex-col items-center w-full min-h-full p-4 md:p-10 text-center overflow-y-auto relative">
      
      {/* Background Image da Home */}
      <div 
        className="absolute top-[12%] md:top-[15%] left-0 right-0 h-[35%] z-0 opacity-15 pointer-events-none mix-blend-multiply" 
        style={{ 
          backgroundImage: 'url(/arte-leminski.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} 
      />

      {/* Logos Area (Top) */}
      <div className="w-full relative z-10 flex justify-between items-start px-2 md:px-10 pt-4 md:pt-8 opacity-90">
        <div className="text-left flex flex-col items-start">
          <p className="text-xs md:text-sm tracking-widest text-leminski-blue uppercase mb-2 md:mb-3 font-bold">Realização</p>
          <img src="/logo-realizacao.png" alt="Realização - Festival Paulo Leminski" className="h-12 md:h-16 lg:h-20 object-contain" />
        </div>
      </div>

      {/* Main Content (Center) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-12 w-full my-8">
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest text-leminski-blue uppercase drop-shadow-[2px_2px_0px_rgba(25,43,77,0.3)]">
            Festival
          </h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-leminski-light leading-tight drop-shadow-[4px_4px_0px_#192B4D]">
            PAULO <br /> LEMINSKI
          </h1>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-lg mt-6 md:mt-10">
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
      <div className="relative z-10 w-full mt-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-90 bg-white/20 p-4 md:p-6 rounded-[2rem] items-end">
        {/* Rouanet */}
        <div className="flex flex-col items-center">
            <img src="/logo-rouanet.png" alt="Lei Rouanet" className="h-12 md:h-16 object-contain mix-blend-multiply" />
        </div>
        
        {/* Patrocinadores */}
        <div className="flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-widest text-leminski-blue uppercase mb-4 font-bold">Patrocínio</p>
            <div className="flex items-center gap-6 md:gap-8">
                <img src="/logo-ourocard.png" alt="Ourocard" className="h-10 md:h-14 object-contain mix-blend-multiply" />
                <img src="/logo-bb.png" alt="Itaipu" className="h-12 md:h-16 object-contain mix-blend-multiply" />
            </div>
        </div>

        {/* MinC */}
        <div className="flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-widest text-leminski-blue uppercase mb-4 font-bold">Incentivo Cultural</p>
            <img src="/logo-minc.png" alt="Ministério da Cultura" className="h-8 md:h-10 object-contain mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
}
