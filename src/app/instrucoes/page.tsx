"use client";

import Link from "next/link";
import { ChevronRight, Brain, Clock, Trophy } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useEffect } from "react";

export default function Instrucoes() {
  const { playSfx } = useAudio();

  useEffect(() => {
    playSfx('start');
  }, [playSfx]);
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-full p-4 md:p-10 text-center overflow-y-auto">
      <h1 className="text-3xl md:text-5xl font-black tracking-widest text-leminski-light uppercase mb-6 md:mb-8 drop-shadow-[4px_4px_0px_#192B4D] mt-4 md:mt-10">
        Como Funciona
      </h1>

      <div className="flex flex-col w-full space-y-4 md:space-y-8 max-w-2xl mx-auto my-4 md:my-8">
        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl flex items-center text-left border-l-8 border-l-leminski-blue">
          <div className="bg-leminski-peach p-3 md:p-4 rounded-full border-2 border-leminski-blue mr-4 md:mr-6 shrink-0 shadow-[2px_2px_0px_#192B4D]">
            <Brain className="w-8 h-8 md:w-12 md:h-12 text-leminski-blue" />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-black text-leminski-blue mb-1 md:mb-2 uppercase">9 Perguntas</h3>
            <p className="text-sm md:text-xl text-leminski-blue font-medium opacity-90">
              Você responderá a 3 fáceis, 3 médias e 3 difíceis. Quanto mais difícil a pergunta, mais pontos!
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl flex items-center text-left border-l-8 border-l-leminski-blue">
          <div className="bg-leminski-red p-3 md:p-4 rounded-full border-2 border-leminski-blue mr-4 md:mr-6 shrink-0 shadow-[2px_2px_0px_#192B4D]">
            <Clock className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-black text-leminski-blue mb-1 md:mb-2 uppercase">20 Segundos</h3>
            <p className="text-sm md:text-xl text-leminski-blue font-medium opacity-90">
              Seja rápido! Se o cronômetro zerar, a pergunta é dada como errada e você não pontua.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl flex items-center text-left border-l-8 border-l-leminski-blue">
          <div className="bg-yellow-400 p-3 md:p-4 rounded-full border-2 border-leminski-blue mr-4 md:mr-6 shrink-0 shadow-[2px_2px_0px_#192B4D]">
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-leminski-blue" />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-black text-leminski-blue mb-1 md:mb-2 uppercase">Bônus de Rapidez</h3>
            <p className="text-sm md:text-xl text-leminski-blue font-medium opacity-90">
              Sua pontuação final multiplica pela sua velocidade no total do jogo. Termine rápido para escalar no ranking!
            </p>
          </div>
        </div>
      </div>

      <div className="w-full pb-8 md:pb-20 mt-8 md:mt-10 shrink-0">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center w-fit mx-auto py-4 px-8 md:py-6 md:px-12 rounded-full glass-button text-xl md:text-3xl font-black uppercase tracking-wider animate-bounce whitespace-nowrap"
        >
          Iniciar Quiz
          <ChevronRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10" />
        </Link>
      </div>
    </div>
  );
}
