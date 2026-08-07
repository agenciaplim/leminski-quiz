"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { ChevronLeft, ChevronRight, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useAudio } from "@/contexts/AudioContext";

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

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

      if (!isValidCPF(formData.cpf)) {
        setError("CPF inválido. Por favor, verifique os números digitados.");
        setLoading(false);
        return;
      }

      if (!formData.termsAccepted) {
        setError("Você precisa aceitar os Termos de Participação para continuar.");
        setLoading(false);
        return;
      }

      // 1. Checagem Local (IndexedDB) - procurando pelo CPF formatado ou só os números
      const numericCpf = formData.cpf.replace(/\D/g, "");
      const existingLocal = await db.participants
        .filter(p => Boolean(p.cpf === formData.cpf || (p.cpf && p.cpf.replace(/\D/g, "") === numericCpf)))
        .first();
      
      if (existingLocal) {
        setError("Você já participou deste quiz. Confira sua posição no ranking e boa sorte!");
        setLoading(false);
        return;
      }

      // 2. Checagem Remota (Supabase) - evita jogar em totens diferentes ou no celular e depois no totem
      if (navigator.onLine) {
        try {
          // Importa supabase dinamicamente se necessário ou usa import global
          const { supabase } = await import("@/lib/supabase");
          const { data: existingRemote } = await supabase
            .from('participants')
            .select('id')
            .or(`cpf.eq.${formData.cpf},cpf.eq.${numericCpf}`)
            .limit(1);
            
          if (existingRemote && existingRemote.length > 0) {
            setError("Você já participou deste quiz. Confira sua posição no ranking e boa sorte!");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erro ao verificar CPF remoto:", e);
        }
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

      let ip = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (e) {
        console.error("Não foi possível obter o IP", e);
      }

      await db.participants.add({
        ...formData,
        cpf: finalCpf,
        displayName,
        score: 0,
        timeMs: 0,
        playedAt: Date.now(),
        synced: false, // Agora sincroniza imediatamente assim que cadastra
        status: 'iniciado',
        ip,
        sessionId: crypto.randomUUID(),
        privacyPolicyVersion: 'v1.0',
        rulesVersion: 'v1.0',
        origin: 'totem'
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
                <Link href={`/ranking?highlight=${formData.cpf}`} className="mt-3 md:mt-4 inline-block bg-leminski-blue text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base">
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
            <label className="block text-base md:text-xl font-bold mb-1 md:mb-2 text-leminski-blue">CPF</label>
            <input 
              type="text" 
              inputMode="numeric"
              required
              className="w-full bg-white border-2 border-leminski-blue/30 rounded-xl md:rounded-2xl p-3 md:p-5 text-lg md:text-2xl text-leminski-blue focus:outline-none focus:border-leminski-red focus:ring-4 focus:ring-leminski-red/20 font-medium"
              value={formData.cpf}
              onChange={e => setFormData({...formData, cpf: formatCPF(e.target.value)})}
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
            <div className="p-6 md:p-10 overflow-y-auto prose prose-lg text-leminski-blue/90 grow text-sm md:text-base">
              <div className="space-y-4">
                <p><strong>Nome da ação:</strong> Ação Promocional por Ranking - Totem Interativo Festival Paulo Leminski<br/>
                <strong>Promotora:</strong> Instituto Paulo Leminski<br/>
                <strong>CNPJ:</strong> 52.265.004/0001-03<br/>
                <strong>Endereço:</strong> R. Pref. Ângelo Ferrario Lopes, nº 433, Box 04, CEP 80.050-330<br/>
                <strong>Contato:</strong> websites@plim.ag | (41) 997914122</p>

                <h3 className="text-xl font-bold mt-6 mb-2">1. Objetivo da ação</h3>
                <p>A presente ação promocional tem como objetivo promover a participação do público em uma experiência interativa realizada por meio de totem digital do Festival Paulo Leminski, com formação de ranking por desempenho/pontuação.</p>
                <p>Os participantes mais bem classificados no ranking, conforme as regras deste Regulamento, poderão receber prêmios ao final da ação.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">2. Quem pode participar</h3>
                <p>Poderão participar pessoas físicas, maiores de 18 anos, residentes no Brasil, que preencham corretamente o cadastro no totem e aceitem este Regulamento e a Política de Privacidade da ação.</p>
                <p>Não poderão participar colaboradores, prestadores de serviço diretamente envolvidos na criação, operação, auditoria ou gestão da ação, bem como seus parentes de primeiro grau, quando houver conflito de interesse.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">3. Período de participação</h3>
                <p>A participação será válida no dia 08/08/2026, das 15h às 21h30, durante a realização da ação na Pedreira Paulo Leminski.</p>
                <p>Participações realizadas fora desse período não serão consideradas válidas.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">4. Local da ação</h3>
                <p>A ação será realizada presencialmente na Pedreira Paulo Leminski, local de realização do evento.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">5. Como participar</h3>
                <p>Para participar, o interessado deverá acessar o totem da ação e preencher corretamente os seguintes dados:</p>
                <ul className="list-disc pl-5">
                  <li>Nome completo;</li>
                  <li>CPF;</li>
                  <li>WhatsApp;</li>
                  <li>E-mail;</li>
                  <li>Cidade;</li>
                  <li>Estado;</li>
                  <li>Nome para ranking, apelido ou identificação pública.</li>
                </ul>
                <p>Após o preenchimento, o participante deverá aceitar este Regulamento e a Política de Privacidade da ação.</p>
                <p>Cada participante poderá realizar apenas uma participação válida por CPF, salvo regra diferente expressamente informada pela promotora.</p>
                <p>Cadastros incompletos, incorretos, duplicados, fraudulentos ou realizados por meios não autorizados poderão ser desclassificados.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">6. Critério de classificação</h3>
                <p>A classificação dos participantes será definida por meio do ranking gerado pelo sistema do totem, considerando a pontuação obtida durante a interação.</p>
                <p>Serão considerados vencedores os 10 participantes mais bem colocados no ranking ao final do período de participação.</p>
                <p>Em caso de empate, poderá ser utilizado como critério de desempate o menor tempo de conclusão da interação ou, na ausência desse dado, o horário mais antigo de registro da participação válida no sistema.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">7. Prêmios</h3>
                <p>A ação terá o total de 10 ganhadores, distribuídos da seguinte forma:</p>
                <ul className="list-disc pl-5">
                  <li>1º ao 3º colocado: receberão 1 kit especial cada.</li>
                  <li>4º ao 10º colocado: receberão 1 kit de participação/premiação cada.</li>
                </ul>
                <p>Os prêmios são pessoais e intransferíveis, não podendo ser convertidos em dinheiro, trocados por outro produto ou substituídos por outro benefício, salvo por decisão da promotora em caso de impossibilidade de entrega do prêmio originalmente previsto.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">8. Apuração do resultado</h3>
                <p>A apuração será realizada no dia 08/08/2026, após as 21h30, na Pedreira Paulo Leminski, logo após o encerramento do período de participação.</p>
                <p>A apuração será feita com base nos registros válidos do sistema do totem, considerando o ranking final dos participantes.</p>
                <p>A promotora poderá manter registros técnicos da apuração, incluindo data, horário, logs, base de participantes elegíveis, pontuação, posição no ranking e critérios aplicados.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">9. Divulgação do resultado</h3>
                <p>O resultado poderá ser divulgado no próprio local do evento, após a apuração, e também pelos canais oficiais do Festival Paulo Leminski, incluindo site, redes sociais, e-mail, WhatsApp ou outros meios de comunicação da ação.</p>
                <p>Para fins de divulgação do resultado, poderão ser utilizados o primeiro nome, sobrenome abreviado, cidade, estado e/ou nickname informado pelo participante.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">10. Entrega dos prêmios</h3>
                <p>Os prêmios serão liberados aos ganhadores no mesmo momento da divulgação do resultado, na Pedreira Paulo Leminski, após a apuração do ranking.</p>
                <p>A promotora poderá solicitar documento oficial com foto e CPF para confirmar a identidade dos ganhadores.</p>
                <p>Caso algum ganhador não esteja presente no momento da entrega, não responda ao chamado da organização, forneça dados incorretos, não comprove sua identidade ou não cumpra as condições deste Regulamento, poderá ser desclassificado, sendo convocado o próximo participante melhor colocado no ranking.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">11. Aceites e consentimentos</h3>
                <p>Para participar da ação, o participante deverá aceitar este Regulamento e a Política de Privacidade.</p>
                <p>O participante poderá, de forma opcional e separada:</p>
                <ol className="list-decimal pl-5">
                  <li>Autorizar o Festival Paulo Leminski a utilizar seus dados para comunicações futuras;</li>
                  <li>Autorizar o compartilhamento de seus dados com patrocinadores e parceiros para comunicações e ações promocionais.</li>
                </ol>
                <p>A autorização para comunicações futuras e para compartilhamento com patrocinadores e parceiros não é obrigatória para participação na ação.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">12. Desclassificação</h3>
                <p>Serão desclassificados os participantes que:</p>
                <ul className="list-disc pl-5">
                  <li>Informarem dados falsos, incompletos ou de terceiros;</li>
                  <li>Tentarem burlar o sistema, o totem, o ranking ou a forma de apuração;</li>
                  <li>Realizarem múltiplos cadastros com dados inconsistentes;</li>
                  <li>Descumprirem qualquer regra deste Regulamento;</li>
                  <li>Utilizarem meios automatizados, fraudulentos ou não autorizados para participar;</li>
                  <li>Praticarem qualquer conduta que comprometa a integridade da ação.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-2">13. Uso de nome, nickname e divulgação</h3>
                <p>Ao participar da ação, o participante contemplado autoriza a divulgação de seu nome, nickname, cidade, estado e posição no ranking para fins de comunicação do resultado da ação, sem que isso gere qualquer direito de remuneração.</p>
                <p>O uso de imagem, fotografia, vídeo ou depoimento do participante para fins publicitários dependerá de autorização específica, quando aplicável.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">14. Tratamento de dados pessoais</h3>
                <p>Os dados pessoais coletados serão tratados conforme a Política de Privacidade da ação e a legislação aplicável.</p>
                <p>Os dados poderão ser utilizados para identificação do participante, validação da participação, formação do ranking, prevenção de fraudes, apuração do resultado, entrega dos prêmios, cumprimento de obrigações legais e envio de comunicações futuras, quando autorizado.</p>
                <p>O compartilhamento dos dados com patrocinadores e parceiros dependerá de consentimento específico do participante.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">15. Responsabilidades</h3>
                <p>A promotora não se responsabiliza por participações não registradas por falhas de conexão, indisponibilidade técnica, erro no preenchimento dos dados, mau uso do totem ou qualquer evento fora de seu controle razoável.</p>
                <p>A promotora poderá suspender, alterar ou cancelar a ação em caso de fraude, falha técnica, força maior ou exigência legal/regulatória, sempre buscando preservar os direitos dos participantes.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">16. Disposições gerais</h3>
                <p>A participação nesta ação implica aceitação integral deste Regulamento.</p>
                <p>As dúvidas, controvérsias ou situações não previstas serão avaliadas pela promotora, observada a legislação aplicável.</p>
                <p>Este Regulamento ficará disponível ao público durante o período da ação por meio do totem, QR Code, link oficial ou outro canal de fácil acesso.</p>
                
                <p className="text-sm italic mt-8 text-leminski-blue/60">Documento preliminar para validação jurídica.</p>
              </div>
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
            <div className="p-6 md:p-10 overflow-y-auto prose prose-lg text-leminski-blue/90 grow text-sm md:text-base">
              <div className="space-y-4">
                <p className="text-sm italic">Última atualização: 07/08/2026</p>
                <p>Esta Política de Privacidade explica como o Instituto Paulo Leminski, inscrito no CNPJ sob nº 52.265.004/0001-03, com endereço na R. Pref. Ângelo Ferrario Lopes, nº 433, Box 04, CEP 80.050-330, trata os dados pessoais coletados por meio do totem interativo da ação promocional por ranking realizada no Festival Paulo Leminski.</p>
                <p>Para dúvidas sobre esta Política ou sobre o tratamento de dados pessoais, entre em contato pelo e-mail websites@plim.ag ou pelo telefone (41) 997914122.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">1. Dados pessoais coletados</h3>
                <p>Durante a participação na ação, poderemos coletar os seguintes dados pessoais fornecidos diretamente pelo participante:</p>
                <ul className="list-disc pl-5">
                  <li>Nome completo;</li>
                  <li>CPF;</li>
                  <li>WhatsApp;</li>
                  <li>E-mail;</li>
                  <li>Cidade;</li>
                  <li>Estado;</li>
                  <li>Nome para ranking, apelido ou identificação pública.</li>
                </ul>
                <p>Também poderemos coletar dados técnicos necessários ao funcionamento, segurança e auditoria da ação, incluindo:</p>
                <ul className="list-disc pl-5">
                  <li>Endereço de IP da máquina/dispositivo utilizado;</li>
                  <li>Identificador de sessão ou cookies técnicos;</li>
                  <li>Data e horário da participação;</li>
                  <li>Registros de aceite do Regulamento e desta Política de Privacidade;</li>
                  <li>Registros dos consentimentos fornecidos pelo participante;</li>
                  <li>Logs técnicos necessários para segurança, auditoria, prevenção de fraudes e comprovação da participação.</li>
                </ul>
                <p>Não solicitamos dados pessoais sensíveis, como informações de saúde, religião, opinião política, biometria, orientação sexual ou outros dados dessa natureza.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">2. Finalidades do tratamento dos dados</h3>
                <p>Os dados pessoais coletados poderão ser utilizados para as seguintes finalidades:</p>
                <ol className="list-decimal pl-5">
                  <li>Identificar o participante e validar sua participação na ação;</li>
                  <li>Registrar a interação realizada no totem;</li>
                  <li>Formar e auditar o ranking da ação;</li>
                  <li>Apurar os 10 participantes mais bem classificados no ranking;</li>
                  <li>Entrar em contato com os participantes ganhadores, se necessário;</li>
                  <li>Confirmar a identidade dos ganhadores para liberação dos prêmios;</li>
                  <li>Prevenir fraudes, cadastros duplicados, uso indevido do sistema e tentativas de manipulação do ranking;</li>
                  <li>Comprovar aceite do Regulamento, desta Política de Privacidade e dos consentimentos opcionais;</li>
                  <li>Cumprir obrigações legais, regulatórias, administrativas ou judiciais, quando aplicável;</li>
                  <li>Enviar comunicações futuras sobre o Festival Paulo Leminski, desde que o participante autorize expressamente;</li>
                  <li>Compartilhar dados de contato com patrocinadores e parceiros para comunicações, campanhas e ações promocionais, desde que o participante autorize expressamente.</li>
                </ol>

                <h3 className="text-xl font-bold mt-6 mb-2">3. Base legal para o tratamento</h3>
                <p>O tratamento dos dados pessoais será realizado conforme as bases legais previstas na Lei Geral de Proteção de Dados Pessoais - LGPD.</p>
                <p>Para viabilizar a participação na ação, validar a identidade do participante, formar o ranking, prevenir fraudes, realizar a apuração e liberar os prêmios, os dados poderão ser tratados com base na execução da relação estabelecida com o participante, no cumprimento de obrigações legais ou regulatórias e no exercício regular de direitos.</p>
                <p>Para envio de comunicações futuras do Festival Paulo Leminski e para compartilhamento dos dados com patrocinadores e parceiros, o tratamento será realizado mediante consentimento específico, livre e informado do participante.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">4. Cookies, IP e registros técnicos</h3>
                <p>O sistema do totem poderá utilizar cookies técnicos, identificadores de sessão, registros de IP, data e horário de acesso para viabilizar a ação, registrar a participação, comprovar consentimentos, evitar cadastros duplicados e garantir a segurança do sistema.</p>
                <p>Esses dados técnicos serão utilizados para finalidades operacionais, de segurança e auditoria da ação.</p>
                <p>Recomenda-se que o IP e os logs principais sejam armazenados no backend ou banco de dados do sistema, e que cookies armazenem apenas identificadores técnicos necessários ao funcionamento da sessão, evitando o armazenamento direto de dados pessoais em cookies sempre que possível.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">5. Compartilhamento dos dados</h3>
                <p>Os dados pessoais poderão ser compartilhados com:</p>
                <ul className="list-disc pl-5">
                  <li>Empresas e fornecedores responsáveis pela operação técnica do sistema, hospedagem, banco de dados, segurança, suporte, manutenção, disparo de mensagens ou gestão operacional da ação;</li>
                  <li>Autoridades públicas, órgãos reguladores ou terceiros quando houver obrigação legal, regulatória, administrativa ou judicial;</li>
                  <li>Patrocinadores e parceiros da ação, somente quando o participante autorizar expressamente essa finalidade por meio de consentimento específico.</li>
                </ul>
                <p>Quando os dados forem compartilhados com patrocinadores e parceiros, esses terceiros poderão atuar como controladores independentes, sendo responsáveis pelo tratamento dos dados conforme suas próprias práticas e políticas de privacidade.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">6. Comunicações futuras</h3>
                <p>O participante poderá autorizar o recebimento de comunicações futuras do Festival Paulo Leminski, incluindo novidades, programação, conteúdos, campanhas, ações promocionais e informações relacionadas ao Festival.</p>
                <p>O participante também poderá autorizar, de forma separada e opcional, o compartilhamento dos seus dados de contato com patrocinadores e parceiros para envio de comunicações, campanhas e ações promocionais.</p>
                <p>A autorização para comunicações futuras e para compartilhamento com patrocinadores e parceiros não é obrigatória para participação na ação.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">7. Armazenamento e prazo de retenção</h3>
                <p>Os dados pessoais serão armazenados pelo período necessário para:</p>
                <ul className="list-disc pl-5">
                  <li>Realizar, auditar e comprovar a participação na ação;</li>
                  <li>Comprovar aceite do Regulamento e da Política de Privacidade;</li>
                  <li>Comprovar os consentimentos fornecidos pelo participante;</li>
                  <li>Prevenir fraudes e resguardar direitos da promotora;</li>
                  <li>Cumprir obrigações legais, regulatórias, administrativas ou judiciais;</li>
                  <li>Realizar comunicações futuras, enquanto houver consentimento válido do participante.</li>
                </ul>
                <p>Quando os dados não forem mais necessários, poderão ser eliminados, anonimizados ou mantidos apenas quando houver obrigação legal ou necessidade legítima de conservação.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">8. Direitos dos titulares de dados</h3>
                <p>Nos termos da LGPD, o participante poderá solicitar:</p>
                <ul className="list-disc pl-5">
                  <li>Confirmação da existência de tratamento de seus dados pessoais;</li>
                  <li>Acesso aos seus dados pessoais;</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                  <li>Revogação do consentimento;</li>
                  <li>Exclusão de dados tratados com base no consentimento, quando aplicável;</li>
                  <li>Informações sobre compartilhamento de dados;</li>
                  <li>Oposição ao tratamento, quando cabível.</li>
                </ul>
                <p>As solicitações devem ser enviadas para websites@plim.ag.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">9. Segurança da informação</h3>
                <p>A promotora adotará medidas técnicas e organizacionais razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, alteração, divulgação indevida ou uso inadequado.</p>
                <p>Ainda assim, nenhum sistema é totalmente imune a riscos. Caso ocorra incidente de segurança relevante envolvendo dados pessoais, serão adotadas as medidas cabíveis conforme a legislação aplicável.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">10. Alterações nesta Política</h3>
                <p>Esta Política de Privacidade poderá ser atualizada para refletir mudanças na ação, no sistema, nas práticas de tratamento de dados ou nas exigências legais.</p>
                <p>A versão vigente deverá estar disponível ao participante por meio do totem, QR Code, link oficial ou outro canal de fácil acesso.</p>

                <h3 className="text-xl font-bold mt-6 mb-2">11. Controladora dos dados</h3>
                <p>Instituto Paulo Leminski<br/>
                CNPJ: 52.265.004/0001-03<br/>
                Endereço: R. Pref. Ângelo Ferrario Lopes, nº 433, Box 04, CEP 80.050-330<br/>
                E-mail: websites@plim.ag<br/>
                Telefone: (41) 99674-0243</p>
                
                <p className="text-sm italic mt-8 text-leminski-blue/60">Documento preliminar para validação jurídica.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
