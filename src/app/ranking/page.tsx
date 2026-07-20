"use client";

import { useEffect, useState } from "react";
import { db, Participant } from "@/lib/db";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import Link from "next/link";

export default function Ranking() {
  const [topPlayers, setTopPlayers] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const all = await db.participants.toArray();
      const sorted = all.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeMs - b.timeMs; // Menor tempo
      });
      setTopPlayers(sorted.slice(0, 10)); // Top 10
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
    <div className="flex flex-col w-full h-full p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <header className="flex items-center justify-between mb-10">
        <Link href="/" className="p-4 rounded-full glass-panel active:scale-95 transition-transform">
          <ArrowLeft className="w-8 h-8" />
        </Link>
        <div className="flex items-center space-x-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 uppercase tracking-widest drop-shadow-lg">
            Ranking Oficial
          </h1>
        </div>
        <div className="w-16"></div> {/* Spacer for center alignment */}
      </header>

      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto no-scrollbar pb-10 max-w-4xl mx-auto w-full">
        {topPlayers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-3xl text-gray-400">
            Ainda não há jogadores registrados.
          </div>
        ) : (
          topPlayers.map((player, index) => {
            const isTop3 = index < 3;
            let rowClass = "glass-panel p-6 rounded-3xl flex items-center justify-between transition-all";
            let posClass = "text-3xl font-bold w-16 text-center";
            
            if (index === 0) {
              rowClass = "bg-gradient-to-r from-yellow-600/40 to-yellow-400/20 border border-yellow-400/50 p-8 rounded-3xl flex items-center justify-between transform scale-105 shadow-[0_0_30px_rgba(234,179,8,0.3)] my-4";
              posClass = "text-5xl font-black text-yellow-400 w-20 text-center";
            } else if (index === 1) {
              rowClass = "bg-gradient-to-r from-gray-400/30 to-gray-300/10 border border-gray-300/40 p-6 rounded-3xl flex items-center justify-between";
              posClass = "text-4xl font-bold text-gray-300 w-16 text-center";
            } else if (index === 2) {
              rowClass = "bg-gradient-to-r from-amber-700/40 to-amber-600/20 border border-amber-600/40 p-6 rounded-3xl flex items-center justify-between";
              posClass = "text-4xl font-bold text-amber-500 w-16 text-center";
            }

            return (
              <div key={player.id} className={rowClass}>
                <div className="flex items-center space-x-6">
                  <div className={posClass}>
                    {index === 0 ? <Medal className="w-12 h-12 text-yellow-400 mx-auto" /> : `${index + 1}º`}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">{player.displayName}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Pontos</span>
                    <span className={`font-black ${index === 0 ? 'text-5xl text-yellow-400' : 'text-4xl text-white'}`}>
                      {player.score}
                    </span>
                  </div>
                  <div className="flex flex-col items-end w-24">
                    <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Tempo</span>
                    <span className="text-2xl font-bold text-gray-200">
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
