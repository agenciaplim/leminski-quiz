"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db, Participant } from "@/lib/db";
import { Trophy, Clock, Star, ArrowRight, BarChart2 } from "lucide-react";

export default function Resultado() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [rankPosition, setRankPosition] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);

  useEffect(() => {
    const fetchResults = async () => {
      const sessionCpf = sessionStorage.getItem("quiz_cpf");
      if (!sessionCpf) {
        router.push("/");
        return;
      }

      const me = await db.participants.where("cpf").equals(sessionCpf).first();
      if (!me) {
        router.push("/");
        return;
      }

      setParticipant(me);

      // Calculate Rank
      const all = await db.participants.toArray();
      const sorted = all.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeMs - b.timeMs; // Menor tempo ganha em caso de empate
      });

      const position = sorted.findIndex(p => p.cpf === sessionCpf) + 1;
      setRankPosition(position);
      setTotalPlayers(sorted.length);
    };

    fetchResults();
  }, [router]);

  const handleRestart = () => {
    sessionStorage.removeItem("quiz_cpf");
    router.push("/");
  };

  if (!participant) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col items-center w-full min-h-full p-4 md:p-10 text-center overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6 md:space-y-12 my-auto py-6 md:py-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md mt-4">
          Fim de Jogo!
        </h1>

        <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl flex flex-col items-center space-y-6 md:space-y-10 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-leminski-pink rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>

          <h2 className="text-2xl md:text-4xl font-bold text-leminski-peach z-10 break-words max-w-full">
            {participant.displayName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full z-10">
            <div className="bg-black/40 p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
              <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mb-2 md:mb-4" />
              <span className="text-sm md:text-2xl text-gray-400 font-medium mb-1">Pontuação</span>
              <span className="text-3xl md:text-5xl font-black text-white">{participant.score}</span>
            </div>

            <div className="bg-black/40 p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
              <Clock className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mb-2 md:mb-4" />
              <span className="text-sm md:text-2xl text-gray-400 font-medium mb-1">Tempo</span>
              <span className="text-2xl md:text-4xl font-bold text-white">{formatTime(participant.timeMs)}</span>
            </div>
          </div>

          <div className="w-full bg-black/40 p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center z-10 border border-yellow-500/30">
            <Trophy className="w-8 h-8 md:w-16 md:h-16 text-yellow-500 mb-2 md:mb-4" />
            <span className="text-base md:text-2xl text-gray-400 font-medium mb-1 md:mb-2">Sua Posição (Neste Totem)</span>
            <span className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent mb-4 md:mb-8">
              {rankPosition}º <span className="text-xl md:text-3xl text-gray-500 font-medium ml-1 md:ml-2">de {totalPlayers}</span>
            </span>
            
            <Link 
              href="/ranking"
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/20 py-3 px-6 md:py-4 md:px-8 rounded-full text-base md:text-xl font-bold text-white w-full max-w-xs whitespace-nowrap"
            >
              <BarChart2 className="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3" />
              Ver Ranking
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full pb-8 md:pb-10 mt-6 md:mt-8 shrink-0">
        <button
          onClick={handleRestart}
          className="inline-flex items-center justify-center w-fit mx-auto py-4 px-8 md:py-6 md:px-12 rounded-full glass-button text-xl md:text-3xl font-bold uppercase tracking-wider whitespace-nowrap"
        >
          Voltar ao Início
          <ArrowRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10" />
        </button>
      </div>
    </div>
  );
}
