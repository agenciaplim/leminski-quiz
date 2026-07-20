"use client";

import { useEffect, useState } from "react";
import { db, Participant } from "@/lib/db";
import { Download, Search, Settings, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminPanel() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [rankingClosed, setRankingClosed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const all = await db.participants.toArray();
    // Sort by playedAt DESC by default
    all.sort((a, b) => b.playedAt - a.playedAt);
    setParticipants(all);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(participants, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "leminski_quiz_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClear = async () => {
    if (confirm("Tem certeza que deseja APAGAR TODOS os dados locais? Esta ação não pode ser desfeita.")) {
      await db.participants.clear();
      fetchData();
    }
  };

  const filtered = participants.filter(p => 
    p.cpf.includes(search) || 
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full p-10 bg-gray-950">
      <header className="flex items-center justify-between mb-8 glass-panel p-6 rounded-2xl">
        <div className="flex items-center space-x-4">
          <Settings className="w-10 h-10 text-pink-500" />
          <h1 className="text-3xl font-bold">Painel Administrativo Plim</h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="px-6 py-3 bg-gray-800 rounded-full font-medium hover:bg-gray-700 transition">
            Voltar ao Totem
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-300">Status Operacional</h3>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
              <span>Totem Local</span>
              <span className="text-green-400 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
              <span>Sincronização</span>
              <span className="text-yellow-400 font-bold">OFFLINE (Mock)</span>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
              <span>Total Registros</span>
              <span className="font-bold text-2xl">{participants.length}</span>
            </div>
          </div>

          <hr className="border-gray-700" />

          <div className="space-y-4">
            <button 
              onClick={handleExport}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center transition"
            >
              <Download className="w-5 h-5 mr-2" /> Exportar Dados (JSON)
            </button>

            <button 
              onClick={() => setRankingClosed(!rankingClosed)}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition ${rankingClosed ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <ShieldAlert className="w-5 h-5 mr-2" /> 
              {rankingClosed ? "Ranking Encerrado (Abrir)" : "Encerrar Ranking"}
            </button>

            <button 
              onClick={handleClear}
              className="w-full py-4 bg-red-900/50 text-red-400 border border-red-900 hover:bg-red-900/80 rounded-xl font-bold flex items-center justify-center transition mt-8"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Limpar Banco Local
            </button>
          </div>
        </div>

        {/* Main Content Area - Table */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Participantes Locais</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por Nome ou CPF..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-black/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500 w-80"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto no-scrollbar rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 sticky top-0">
                <tr>
                  <th className="p-4 font-semibold">Data/Hora</th>
                  <th className="p-4 font-semibold">Nome</th>
                  <th className="p-4 font-semibold">CPF</th>
                  <th className="p-4 font-semibold">Contato</th>
                  <th className="p-4 font-semibold text-right">Pontos</th>
                  <th className="p-4 font-semibold text-right">Tempo (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4 text-gray-400">{new Date(p.playedAt).toLocaleString('pt-BR')}</td>
                    <td className="p-4 font-medium">{p.fullName} <br/><span className="text-xs text-gray-500">{p.displayName}</span></td>
                    <td className="p-4">{p.cpf}</td>
                    <td className="p-4">{p.contact}</td>
                    <td className="p-4 text-right font-bold text-pink-400">{p.score}</td>
                    <td className="p-4 text-right text-gray-300">{p.timeMs}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
