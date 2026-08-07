"use client";

import { useEffect, useState } from "react";
import { db, Participant } from "@/lib/db";
import { Download, Search, Settings, ShieldAlert, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import FullscreenButton from "@/components/FullscreenButton";

import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [globalParticipants, setGlobalParticipants] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'local' | 'global'>('local');
  const [sortMode, setSortMode] = useState<'date' | 'score'>('date');
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  
  const [search, setSearch] = useState("");
  const [rankingClosed, setRankingClosed] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const all = await db.participants.toArray();
    // Sort by playedAt DESC by default
    all.sort((a, b) => b.playedAt - a.playedAt);
    setParticipants(all);
    setUnsyncedCount(all.filter(p => !p.synced).length);
  };

  const fetchGlobalData = async () => {
    setIsLoadingGlobal(true);
    fetchData(); // Atualiza os dados locais e contadores do menu lateral
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('playedAt', { ascending: false });
      
      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }
      setGlobalParticipants(data || []);
    } catch (err) {
      console.error("Erro ao buscar dados globais", err);
      alert("Erro ao conectar com a nuvem. Verifique o console.");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'global' && globalParticipants.length === 0) {
      fetchGlobalData();
    }
  }, [viewMode]);

  const handleExport = () => {
    const dataToExport = viewMode === 'local' ? participants : globalParticipants;
    const prefix = viewMode === 'local' ? 'local' : 'global';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `leminski_quiz_export_${prefix}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClear = async () => {
    if (viewMode === 'global') {
      alert("Não é possível apagar os dados da nuvem por aqui.");
      return;
    }
    if (confirm("Tem certeza que deseja APAGAR TODOS os dados locais? Esta ação não pode ser desfeita.")) {
      await db.participants.clear();
      fetchData();
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin2026") {
      setIsAuthenticated(true);
    } else {
      setAuthError("Senha incorreta.");
    }
  };

  const activeParticipants = viewMode === 'local' ? participants : globalParticipants;
  const filtered = activeParticipants.filter(p => {
    const cpf = p.cpf || '';
    const fullName = p.fullName || p.full_name || '';
    const displayName = p.displayName || p.display_name || '';
    
    return cpf.includes(search) || 
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      displayName.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => {
    if (sortMode === 'score') {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      // desempate por tempo (menor tempo ganha)
      const timeA = a.timeMs || a.time_ms || 0;
      const timeB = b.timeMs || b.time_ms || 0;
      return timeA - timeB;
    } else {
      // sortMode === 'date'
      const dateA = a.playedAt || a.played_at || 0;
      const dateB = b.playedAt || b.played_at || 0;
      return dateB - dateA;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 bg-leminski-peach">
        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-leminski-red mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-black text-leminski-blue uppercase mb-2">Acesso Restrito</h2>
          <p className="text-leminski-blue/70 font-medium mb-8">Digite a senha operacional para acessar o painel administrativo do totem.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {authError && <p className="text-red-500 font-bold text-sm bg-red-100 p-2 rounded-xl">{authError}</p>}
            <input 
              type="password"
              placeholder="Senha de acesso"
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-2xl p-4 text-xl text-leminski-blue focus:outline-none focus:border-leminski-red text-center"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full py-4 bg-leminski-blue text-white rounded-full font-black uppercase tracking-widest hover:bg-leminski-blue/90 shadow-[4px_4px_0px_#192B4D] active:translate-y-1 active:shadow-none transition-all">
              Acessar Painel
            </button>
          </form>
          
          <Link href="/" className="inline-block mt-8 text-sm font-bold text-leminski-blue/60 hover:text-leminski-blue">
            &larr; Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-10 bg-leminski-peach overflow-y-auto">
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 glass-panel p-4 md:p-6 rounded-2xl space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Settings className="w-8 h-8 md:w-10 md:h-10 text-leminski-blue shrink-0" />
          <h1 className="text-xl md:text-3xl font-black text-leminski-blue uppercase">Painel Administrativo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <FullscreenButton inline className="w-10 h-10 md:w-12 md:h-12 bg-leminski-blue text-white rounded-full shadow-[2px_2px_0px_#192B4D] hover:bg-leminski-blue/90 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center" />
          <Link href="/" className="px-4 py-2 md:px-6 md:py-3 bg-leminski-blue text-white rounded-full text-sm md:text-base font-bold hover:bg-leminski-blue/90 transition shadow-[2px_2px_0px_#192B4D] active:translate-y-1 active:shadow-none">
            Voltar ao Totem
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 flex-1">
        {/* Sidebar Controls */}
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-leminski-blue uppercase">Status Operacional</h3>
            
            <div className="flex flex-col bg-white border-2 border-leminski-blue p-3 md:p-4 rounded-xl shadow-[2px_2px_0px_#192B4D]">
              <span className="text-sm font-bold text-leminski-blue/70 mb-1 uppercase">Totem Local</span>
              <span className="text-green-600 font-black text-lg">ONLINE</span>
            </div>
            
            <div className="flex flex-col bg-white border-2 border-leminski-blue p-3 md:p-4 rounded-xl shadow-[2px_2px_0px_#192B4D]">
              <span className="text-sm font-bold text-leminski-blue/70 mb-1 uppercase">Sincronização</span>
              {unsyncedCount === 0 ? (
                <span className="text-green-600 font-black text-lg">SINCRONIZADO (0 na fila)</span>
              ) : (
                <span className="text-yellow-600 font-black text-lg animate-pulse">PENDENTE ({unsyncedCount} na fila)</span>
              )}
            </div>
            
            <div className="flex flex-col bg-white border-2 border-leminski-blue p-3 md:p-4 rounded-xl shadow-[2px_2px_0px_#192B4D]">
              <span className="text-sm font-bold text-leminski-blue/70 mb-1 uppercase">Total Registros (Local)</span>
              <span className="font-black text-2xl md:text-3xl text-leminski-blue">{participants.length}</span>
            </div>
          </div>

          <hr className="border-leminski-blue/30 border-2" />

          <div className="space-y-4">
            <button 
              onClick={handleExport}
              className="w-full py-3 md:py-4 bg-leminski-blue text-white border-2 border-leminski-blue rounded-xl font-bold flex flex-col items-center justify-center transition text-sm md:text-base shadow-[4px_4px_0px_#192B4D] active:translate-y-1 active:shadow-none hover:bg-leminski-blue/90"
            >
              <Download className="w-5 h-5 mb-1" /> Exportar JSON ({viewMode === 'local' ? 'Local' : 'Global'})
            </button>

            <button 
              onClick={() => setRankingClosed(!rankingClosed)}
              className={`w-full py-3 md:py-4 border-2 border-leminski-blue rounded-xl font-bold flex flex-col items-center justify-center transition text-sm md:text-base shadow-[4px_4px_0px_#192B4D] active:translate-y-1 active:shadow-none text-white ${rankingClosed ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              <ShieldAlert className="w-5 h-5 mb-1" /> 
              {rankingClosed ? "Abrir Ranking" : "Encerrar Ranking"}
            </button>

            {viewMode === 'local' && (
              <button 
                onClick={handleClear}
                className="w-full py-3 md:py-4 bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 rounded-xl font-bold flex flex-col items-center justify-center transition mt-4 text-sm md:text-base shadow-[4px_4px_0px_#EF4444] active:translate-y-1 active:shadow-none"
              >
                <Trash2 className="w-5 h-5 mb-1" /> Limpar Banco Local
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area - Table */}
        <div className="lg:col-span-3 glass-panel p-4 md:p-6 rounded-2xl flex flex-col min-h-[500px]">
          
          <div className="flex gap-4 mb-6 border-b-2 border-leminski-blue/20 pb-4">
            <button 
              onClick={() => setViewMode('local')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'local' ? 'bg-leminski-blue text-white shadow-[2px_2px_0px_#192B4D]' : 'bg-white text-leminski-blue/60 hover:bg-white/80'}`}
            >
              Participantes Locais (Este Totem)
            </button>
            <button 
              onClick={() => setViewMode('global')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'global' ? 'bg-leminski-blue text-white shadow-[2px_2px_0px_#192B4D]' : 'bg-white text-leminski-blue/60 hover:bg-white/80'}`}
            >
              Todos (Nuvem)
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl md:text-2xl font-black uppercase text-leminski-blue">
                {viewMode === 'local' ? 'Registros Locais' : 'Registros Globais'}
              </h2>
              {viewMode === 'global' && (
                <button 
                  onClick={fetchGlobalData}
                  disabled={isLoadingGlobal}
                  className="p-2 bg-leminski-blue text-white rounded-full hover:bg-leminski-blue/80 transition-all disabled:opacity-50"
                  title="Atualizar dados da nuvem"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingGlobal ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-leminski-blue/70 uppercase">Ordenar por:</span>
              <button 
                onClick={() => setSortMode('date')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${sortMode === 'date' ? 'bg-leminski-blue text-white' : 'bg-leminski-blue/10 text-leminski-blue hover:bg-leminski-blue/20'}`}
              >
                Data
              </button>
              <button 
                onClick={() => setSortMode('score')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${sortMode === 'score' ? 'bg-leminski-blue text-white' : 'bg-leminski-blue/10 text-leminski-blue hover:bg-leminski-blue/20'}`}
              >
                Ranking
              </button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-leminski-blue/50 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar CPF, Nome ou Apelido..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-white border-2 border-leminski-blue rounded-full py-2 pl-10 pr-4 text-leminski-blue font-bold focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 w-full shadow-[2px_2px_0px_#192B4D]"
              />
            </div>
          </div>

          {viewMode === 'global' && isLoadingGlobal ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-leminski-blue"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto rounded-xl border-4 border-leminski-blue bg-white shadow-[4px_4px_0px_#192B4D]">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
                <thead className="bg-leminski-blue border-b-4 border-leminski-blue">
                  <tr>
                    <th className="p-4 font-black text-white uppercase tracking-wider">Status</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">Data/Hora</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">Nome</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">CPF</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">WhatsApp</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">E-mail</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">Cidade</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">Estado</th>
                    <th className="p-4 font-black text-white uppercase tracking-wider">IP</th>
                    <th className="p-4 font-black text-right text-white uppercase tracking-wider">Pontos</th>
                    <th className="p-4 font-black text-right text-white uppercase tracking-wider">Tempo (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-leminski-blue/20">
                  {filtered.map(p => {
                    const status = p.status;
                    const score = p.score || 0;
                    const timeMs = p.timeMs || p.time_ms || 0;
                    const playedAt = p.playedAt || p.played_at || 0;
                    const fullName = p.fullName || p.full_name || '';
                    const displayName = p.displayName || p.display_name || '';
                    
                    return (
                      <tr key={p.id} className="hover:bg-leminski-peach/30 transition">
                        <td className="p-4">
                          {status === 'iniciado' || (score === 0 && timeMs === 0) ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Incompleto</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Concluído</span>
                          )}
                        </td>
                        <td className="p-4 text-leminski-blue font-medium">{new Date(playedAt).toLocaleString('pt-BR')}</td>
                        <td className="p-4 font-bold text-leminski-blue">{fullName} <br/><span className="text-xs text-leminski-blue/60">{displayName}</span></td>
                        <td className="p-4 font-medium text-leminski-blue">{p.cpf}</td>
                        <td className="p-4 font-medium text-leminski-blue">{p.whatsapp}</td>
                        <td className="p-4 font-medium text-leminski-blue">{p.email}</td>
                        <td className="p-4 font-medium text-leminski-blue">{p.city}</td>
                        <td className="p-4 font-medium text-leminski-blue">{p.state}</td>
                        <td className="p-4 font-medium text-leminski-blue/50 text-xs">{p.ip || p.ip_address || '-'}</td>
                        <td className="p-4 text-right font-black text-leminski-red">{score}</td>
                        <td className="p-4 text-right font-bold text-leminski-blue/70">{timeMs}</td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-leminski-blue/50 font-bold text-lg">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
