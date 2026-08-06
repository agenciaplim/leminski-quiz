"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { ChevronLeft, ChevronRight, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useAudio } from "@/contexts/AudioContext";

export default function Cadastro() {
  const router = useRouter();
  const { playSfx } = useAudio();
  const [showRegulamento, setShowRegulamento] = useState(false);
  const [showPolitica, setShowPolitica] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    displayName: "",
    termsAccepted: false,
    festivalAccepted: false,
    sponsorAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.fullName || !formData.cpf || !formData.whatsapp || !formData.email || !formData.city || !formData.state) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
      }

      if (!formData.termsAccepted) {
        setError("Você precisa aceitar os Termos de Participação para continuar.");
        setLoading(false);
        return;
      }

      const existing = await db.participants.where("cpf").equals(formData.cpf).first();
      
      if (existing) {
        setError("Você já participou deste quiz. Confira sua posição no ranking e boa sorte!");
        setLoading(false);
        return;
      }

      let finalCpf = formData.cpf.trim();
      if (!finalCpf) {
        finalCpf = "TESTE-" + Math.floor(Math.random() * 10000000);
      }

      let displayName = formData.displayName.trim();
      if (!displayName) {
        const names = formData.fullName.trim().split(" ");
        displayName = names.length > 1 && names[0] !== ""
          ? `${names[0]} ${names[names.length - 1].charAt(0)}.`
          : names[0] || "Jogador Teste";
      }

      await db.participants.add({
        ...formData,
        cpf: finalCpf,
        displayName,
        score: 0,
        timeMs: 0,
        playedAt: Date.now(),
        synced: false, // Agora sincroniza imediatamente assim que cadastra
        status: 'iniciado'
      });

      sessionStorage.setItem("quiz_cpf", finalCpf);

      router.push("/instrucoes");
    } catch (err) {
      console.error(err);
      setError("Erro ao processar o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-10">
      <header className="flex items-center mb-6 md:mb-10 shrink-0">
        <Link href="/" className="p-3 md:p-4 rounded-full glass-panel flex items-center justify-center mr-4 md:mr-6 active:translate-y-1 transition-transform shrink-0 shadow-[4px_4px_0px_#192B4D]">
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-leminski-blue" />
        </Link>
        <h1 className="text-2xl md:text-4xl font-black text-leminski-light drop-shadow-[2px_2px_0px_#192B4D]">Identificação</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 md:space-y-6 overflow-y-auto no-scrollbar pb-10">
        
        {error && (
          <div className="bg-white border-4 border-red-500 shadow-[4px_4px_0px_#EF4444] p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-start">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500 mr-3 md:mr-4 shrink-0" />
            <div className="flex-1">
              <p className="text-base md:text-xl text-red-600 font-bold">{error}</p>
              {error.includes("já participou") && (
                <Link href="/ranking" className="mt-3 md:mt-4 inline-block bg-leminski-blue text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base">
                  Ver Ranking
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
          <div>
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">CPF (Somente números)</label>
            <input 
              type="number" 
              required
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
              value={formData.cpf}
              onChange={e => setFormData({...formData, cpf: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">WhatsApp</label>
            <input 
              type="tel" 
              required
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
              value={formData.whatsapp}
              onChange={e => setFormData({...formData, whatsapp: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-[2]">
              <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">Cidade</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">Estado</label>
              <input 
                type="text" 
                placeholder="UF"
                required
                maxLength={2}
                className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium uppercase"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          <div>
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">Nome para o Ranking (Apelido)</label>
            <input 
              type="text" 
              placeholder="Opcional. Ex: João M."
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium placeholder-leminski-blue/40"
              value={formData.displayName}
              onChange={e => setFormData({...formData, displayName: e.target.value})}
            />
          </div>
        </div>

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-black text-leminski-red mb-2 md:mb-4">Termos de Participação</h3>
          
          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer group p-3 -m-3 hover:bg-leminski-blue/5 rounded-xl transition-colors">
            <input 
              type="checkbox" 
              required
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-2 border-leminski-blue text-leminski-red focus:ring-leminski-red shrink-0"
              checked={formData.termsAccepted}
              onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-leminski-blue font-medium transition-colors">
              Eu li e aceito o <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowRegulamento(true); }} className="underline font-bold hover:text-leminski-red">Regulamento da ação</button> e a <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPolitica(true); }} className="underline font-bold hover:text-leminski-red">Política de Privacidade</button>.
            </span>
          </label>

          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer group p-3 -m-3 hover:bg-leminski-blue/5 rounded-xl transition-colors">
            <input 
              type="checkbox" 
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-2 border-leminski-blue text-leminski-red focus:ring-leminski-red shrink-0"
              checked={formData.festivalAccepted}
              onChange={e => setFormData({...formData, festivalAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-leminski-blue font-medium group-hover:text-leminski-red transition-colors">Autorizo o Festival Paulo Leminski a utilizar minhas informações para comunicações futuras.</span>
          </label>

          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer group p-3 -m-3 hover:bg-leminski-blue/5 rounded-xl transition-colors">
            <input 
              type="checkbox" 
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-2 border-leminski-blue text-leminski-red focus:ring-leminski-red shrink-0"
              checked={formData.sponsorAccepted}
              onChange={e => setFormData({...formData, sponsorAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-leminski-blue font-medium group-hover:text-leminski-red transition-colors">Autorizo o patrocinador desta ação a utilizar minhas informações para comunicações e ações promocionais.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 md:py-6 md:px-8 rounded-full glass-button text-xl md:text-3xl font-black uppercase tracking-wider flex items-center justify-center mt-4 md:mt-6 shrink-0"
        >
          {loading ? "Aguarde..." : "Começar o Quiz"}
          {!loading && <ChevronRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10 shrink-0" />}
        </button>
      </form>

      {/* Modal Regulamento */}
      {showRegulamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-leminski-red/90 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl md:text-3xl font-black text-leminski-blue uppercase">Regulamento da Ação</h2>
              <button onClick={() => setShowRegulamento(false)} className="p-2 text-leminski-blue hover:text-leminski-red transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto prose prose-lg text-leminski-blue/90 grow">
              <p>O texto do regulamento será inserido aqui em breve.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Política de Privacidade */}
      {showPolitica && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-leminski-red/90 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl md:text-3xl font-black text-leminski-blue uppercase">Política de Privacidade</h2>
              <button onClick={() => setShowPolitica(false)} className="p-2 text-leminski-blue hover:text-leminski-red transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto prose prose-lg text-leminski-blue/90 grow">
              <p>O texto da política de privacidade será inserido aqui em breve.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
