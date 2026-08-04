"use client";

import { useEffect, useState } from "react";
import { db, Participant } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import Link from "next/link";

export default function Ranking() {
  const [topPlayers, setTopPlayers] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // 1. Pega do IndexedDB local (sempre rápido e garantido)
        const local = await db.participants.toArray();
        let remote: any[] = [];
        
        // 2. Se tiver internet, tenta puxar do Supabase
        if (navigator.onLine) {
          const { data, error } = await supabase
            .from('participants')
            .select('*')
            .order('score', { ascending: false })
            .order('timeMs', { ascending: true })
            .limit(50);
            
          if (!error && data) {
            remote = data;
          }
        }

        // 3. Funde os dois (para garantir que alguém que acabou de jogar offline apareça + dados do outro totem)
        const map = new Map();
        
        // Coloca os remotos no map (chave = cpf)
        remote.forEach(p => map.set(p.cpf, p));
        
        // Coloca/Atualiza os locais (se for mais recente ou se não estiver no remoto)
        local.forEach(p => {
          if (!map.has(p.cpf) || p.score > map.get(p.cpf).score) {
             map.set(p.cpf, p);
          }
        });

        // 4. Converte devolta pra array e ordena
        const all = Array.from(map.values());
        const sorted = all.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeMs - b.timeMs; // Menor tempo
        });
        
        setTopPlayers(sorted.slice(0, 10)); // Top 10
      } catch (err) {
        console.error("Erro ao montar ranking", err);
      }
    };

    fetchRanking();
    // Atualiza a cada 5 segundos para o modo display
    const interval = setInterval(fetchRanking, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-10 bg-leminski-peach">
      <header className="flex items-center justify-between mb-10 shrink-0">
        <Link href="/" className="p-4 rounded-full glass-panel active:translate-y-1 transition-transform flex justify-center items-center">
          <ArrowLeft className="w-8 h-8 text-leminski-blue" />
        </Link>
        <div className="flex items-center space-x-4">
          <Trophy className="w-12 h-12 text-leminski-blue" />
          <h1 className="text-5xl font-black text-leminski-light uppercase tracking-widest drop-shadow-[4px_4px_0px_#192B4D]">
            Ranking Oficial
          </h1>
        </div>
        <div className="w-16 shrink-0"></div> {/* Spacer for center alignment */}
      </header>

      <div className="flex-1 flex flex-col space-y-4 pb-10 max-w-4xl mx-auto w-full">
        {topPlayers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-3xl text-leminski-light font-bold">
            Ainda não há jogadores registrados.
          </div>
        ) : (
          topPlayers.map((player, index) => {
            const isTop3 = index < 3;
            let rowClass = "glass-panel p-6 flex items-center justify-between transition-all mt-2";
            let posClass = "text-3xl font-bold w-16 text-center text-leminski-blue";
            
            if (index === 0) {
              rowClass = "bg-yellow-400 border-4 border-leminski-blue p-8 rounded-[1.5rem] flex items-center justify-between transform scale-105 shadow-[4px_4px_0px_#192B4D] my-4";
              posClass = "text-5xl font-black text-leminski-blue w-20 text-center";
            } else if (index === 1) {
              rowClass = "bg-gray-300 border-4 border-leminski-blue p-6 rounded-[1.5rem] flex items-center justify-between shadow-[4px_4px_0px_#192B4D] mt-2";
              posClass = "text-4xl font-black text-leminski-blue w-16 text-center";
            } else if (index === 2) {
              rowClass = "bg-orange-400 border-4 border-leminski-blue p-6 rounded-[1.5rem] flex items-center justify-between shadow-[4px_4px_0px_#192B4D] mt-2";
              posClass = "text-4xl font-black text-leminski-blue w-16 text-center";
            }

            return (
              <div key={player.id} className={rowClass}>
                <div className="flex items-center space-x-6">
                  <div className={posClass}>
                    {index === 0 ? <Medal className="w-12 h-12 text-leminski-blue mx-auto" /> : `${index + 1}º`}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-leminski-blue uppercase">{player.displayName}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-leminski-blue/70 uppercase tracking-widest font-bold">Pontos</span>
                    <span className={`font-black text-leminski-blue ${index === 0 ? 'text-5xl' : 'text-4xl'}`}>
                      {player.score}
                    </span>
                  </div>
                  <div className="flex flex-col items-end w-24">
                    <span className="text-sm text-leminski-blue/70 uppercase tracking-widest font-bold">Tempo</span>
                    <span className="text-2xl font-bold text-leminski-blue">
                      {formatTime(player.timeMs)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
