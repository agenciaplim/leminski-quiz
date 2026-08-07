"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db, Participant } from "@/lib/db";
import { supabase } from "@/lib/supabase";
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

      // Calculate Rank using identical logic to ranking/page.tsx
      try {
        const localAll = await db.participants.toArray();
        let finalData: any[] = [];
        
        if (navigator.onLine) {
          const { data, error } = await supabase
            .from('participants')
            .select('id, displayName, score, timeMs, cpf')
            .order('score', { ascending: false })
            .order('timeMs', { ascending: true });
            
          if (!error && data) {
            const localUnsynced = localAll.filter(p => !p.synced && p.status === 'concluido');
            const unsyncedCpfs = localUnsynced.map(p => p.cpf);
            const cleanSupabaseData = data.filter(p => !unsyncedCpfs.includes(p.cpf));
            finalData = [...cleanSupabaseData, ...localUnsynced];
          } else {
            finalData = localAll.filter(p => p.status === 'concluido');
          }
        } else {
          finalData = localAll.filter(p => p.status === 'concluido');
        }

        const sorted = finalData.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeMs - b.timeMs;
        });

        const position = sorted.findIndex(p => p.cpf === sessionCpf) + 1;
        setRankPosition(position > 0 ? position : 1);
        setTotalPlayers(sorted.length > 0 ? sorted.length : 1);
      } catch (err) {
        console.error("Erro ao calcular rank", err);
      }
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
        <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase text-leminski-light drop-shadow-[4px_4px_0px_#192B4D] mt-4">
          Fim de Jogo!
        </h1>

        <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl flex flex-col items-center space-y-6 md:space-y-10">
          <h2 className="text-2xl md:text-4xl font-black text-leminski-blue break-words max-w-full uppercase">
            {participant.displayName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
            <div className="bg-white border-4 border-leminski-blue p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-[4px_4px_0px_#192B4D]">
              <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 mb-2 md:mb-4" />
              <span className="text-sm md:text-2xl text-leminski-blue font-bold mb-1 uppercase tracking-wider">Pontuação</span>
              <span className="text-3xl md:text-5xl font-black text-leminski-blue">{participant.score}</span>
            </div>

            <div className="bg-white border-4 border-leminski-blue p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-[4px_4px_0px_#192B4D]">
              <Clock className="w-8 h-8 md:w-12 md:h-12 text-leminski-red mb-2 md:mb-4" />
              <span className="text-sm md:text-2xl text-leminski-blue font-bold mb-1 uppercase tracking-wider">Tempo</span>
              <span className="text-2xl md:text-4xl font-black text-leminski-blue">{formatTime(participant.timeMs)}</span>
            </div>
          </div>

          <div className="w-full bg-leminski-peach border-4 border-leminski-blue p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-[4px_4px_0px_#192B4D]">
            <Trophy className="w-8 h-8 md:w-16 md:h-16 text-leminski-blue mb-2 md:mb-4" />
            <span className="text-base md:text-2xl text-leminski-blue font-bold mb-1 md:mb-2 uppercase tracking-wider">Sua Posição Oficial</span>
            <span className="text-5xl md:text-7xl font-black text-leminski-blue mb-4 md:mb-8">
              {rankPosition}º <span className="text-xl md:text-3xl font-bold ml-1 md:ml-2">de {totalPlayers}</span>
            </span>
            
            <Link 
              href="/ranking"
              className="flex items-center justify-center bg-leminski-blue hover:bg-leminski-blue/90 border-2 border-leminski-blue transition-colors py-3 px-6 md:py-4 md:px-8 rounded-full text-base md:text-xl font-bold text-white w-full max-w-xs whitespace-nowrap shadow-[4px_4px_0px_rgba(25,43,77,0.3)] active:translate-y-1 active:shadow-none"
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
