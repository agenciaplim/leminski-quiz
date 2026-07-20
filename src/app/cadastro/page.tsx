"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Cadastro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    contact: "",
    location: "",
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
      // Check if CPF already exists
      const existing = await db.participants.where("cpf").equals(formData.cpf).first();
      
      if (existing) {
        setError("Você já participou deste quiz. Confira sua posição no ranking e boa sorte!");
        setLoading(false);
        return;
      }

      // Format display name if empty
      let displayName = formData.displayName.trim();
      if (!displayName) {
        const names = formData.fullName.trim().split(" ");
        displayName = names.length > 1 
          ? `${names[0]} ${names[names.length - 1].charAt(0)}.`
          : names[0];
      }

      // Save to db
      await db.participants.add({
        ...formData,
        displayName,
        score: 0,
        timeMs: 0,
        playedAt: Date.now(),
        synced: false,
      });

      // Save CPF to session to identify user during quiz
      sessionStorage.setItem("quiz_cpf", formData.cpf);

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
        <Link href="/" className="p-3 md:p-4 rounded-full glass-panel mr-4 md:mr-6 active:scale-95 transition-transform shrink-0">
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold">Identificação</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 md:space-y-6 overflow-y-auto no-scrollbar pb-10">
        
        {error && (
          <div className="glass-panel bg-red-900/50 border-red-500 p-4 md:p-6 rounded-2xl flex items-start">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-400 mr-3 md:mr-4 shrink-0" />
            <div className="flex-1">
              <p className="text-base md:text-xl text-white font-medium">{error}</p>
              {error.includes("já participou") && (
                <Link href="/ranking" className="mt-3 md:mt-4 inline-block bg-white text-red-900 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base">
                  Ver Ranking
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
          <div>
            <label className="block text-base md:text-xl font-medium mb-1 md:mb-2 text-gray-200">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-black/50 border border-leminski-blue/50 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-white focus:outline-none focus:border-leminski-pink"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-base md:text-xl font-medium mb-1 md:mb-2 text-gray-200">CPF (Somente números)</label>
            <input 
              required
              type="number" 
              className="w-full bg-black/50 border border-leminski-blue/50 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-white focus:outline-none focus:border-leminski-pink"
              value={formData.cpf}
              onChange={e => setFormData({...formData, cpf: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-base md:text-xl font-medium mb-1 md:mb-2 text-gray-200">WhatsApp / E-mail</label>
            <input 
              required
              type="text" 
              className="w-full bg-black/50 border border-leminski-blue/50 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-white focus:outline-none focus:border-leminski-pink"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-base md:text-xl font-medium mb-1 md:mb-2 text-gray-200">Cidade / Estado</label>
            <input 
              required
              type="text" 
              className="w-full bg-black/50 border border-leminski-blue/50 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-white focus:outline-none focus:border-leminski-pink"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-base md:text-xl font-medium mb-1 md:mb-2 text-gray-200">Nome para o Ranking (Apelido)</label>
            <input 
              type="text" 
              placeholder="Opcional. Ex: João M."
              className="w-full bg-black/50 border border-leminski-blue/50 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-white focus:outline-none focus:border-leminski-pink placeholder-gray-600"
              value={formData.displayName}
              onChange={e => setFormData({...formData, displayName: e.target.value})}
            />
          </div>
        </div>

        <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-bold text-leminski-pink mb-2 md:mb-4">Termos de Participação</h3>
          
          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer">
            <input 
              required
              type="checkbox" 
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-gray-600 text-leminski-red focus:ring-leminski-red bg-black/50 shrink-0"
              checked={formData.termsAccepted}
              onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-gray-300">Aceito participar do quiz e exibir meu nome/apelido e pontuação no ranking do evento.</span>
          </label>

          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer">
            <input 
              required
              type="checkbox" 
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-gray-600 text-leminski-red focus:ring-leminski-red bg-black/50 shrink-0"
              checked={formData.festivalAccepted}
              onChange={e => setFormData({...formData, festivalAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-gray-300">Autorizo o Festival Paulo Leminski a utilizar minhas informações para comunicações futuras.</span>
          </label>

          <label className="flex items-start space-x-3 md:space-x-4 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-6 h-6 md:w-8 md:h-8 mt-1 rounded border-gray-600 text-leminski-red focus:ring-leminski-red bg-black/50 shrink-0"
              checked={formData.sponsorAccepted}
              onChange={e => setFormData({...formData, sponsorAccepted: e.target.checked})}
            />
            <span className="text-sm md:text-xl text-gray-300">Autorizo o patrocinador desta ação a utilizar minhas informações para comunicações e ações promocionais.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 md:py-6 md:px-8 rounded-full glass-button text-xl md:text-3xl font-bold uppercase tracking-wider flex items-center justify-center mt-4 md:mt-6 shrink-0"
        >
          {loading ? "Aguarde..." : "Começar o Quiz"}
          {!loading && <ChevronRight className="ml-2 md:ml-4 w-6 h-6 md:w-10 md:h-10 shrink-0" />}
        </button>
      </form>
    </div>
  );
}
