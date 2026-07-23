# Relatório Técnico: Quiz Interativo - Festival Paulo Leminski

**Data:** 22/06/2026  
**Desenvolvedor:** Guilherme
**Projeto:** Totem Interativo - Festival Paulo Leminski  

---

## 1. Visão Geral e Objetivo
O sistema foi desenvolvido para operar em formato de quiosque (totem) durante o Festival Paulo Leminski. O objetivo central é proporcionar uma experiência gamificada, ágil e visualmente impactante, captando leads (participantes) e gerando um ranking competitivo.

**Principais Tecnologias Utilizadas:**
- **Next.js 16 (App Router):** Framework principal garantindo alta performance e renderização otimizada.
- **TypeScript:** Tipagem estática para garantir integridade dos dados coletados (CPF, Nomes, Pontuações).
- **Tailwind CSS v4:** Estilização responsiva e efeitos visuais modernos (Glassmorphism, gradientes e animações).
- **Dexie.js / IndexedDB:** Banco de dados local para armazenamento das partidas.

---

## 2. Estrutura do Sistema (Rotas e Telas)
O fluxo do usuário foi desenhado para ser intuitivo e rápido, focado em uma experiência de no máximo 3 a 5 minutos por pessoa:

1. **`/` (Tela Inicial):** Tela de atração em loop com animações, logos de patrocinadores e o botão principal "Tocar para Iniciar".
2. **`/cadastro`:** Formulário para captação de dados (Nome, CPF, WhatsApp/E-mail, Cidade). Possui travas de segurança validando se o CPF já participou, além de checkboxes obrigatórios para consentimento LGPD.
3. **`/instrucoes`:** Tela visual com ícones explicando as regras de pontuação (9 perguntas: 3 fáceis, 3 médias, 3 difíceis), cronômetro de 20s e bônus de rapidez.
4. **`/quiz`:** O motor do jogo. Exibe as perguntas randômicas, o temporizador e valida instantaneamente acertos e erros, calculando a nota com base no tempo de resposta (multiplicador de agilidade).
5. **`/resultado`:** Tela de impacto mostrando a pontuação final, tempo total gasto e a posição instantânea do jogador no ranking.
6. **`/ranking`:** Tela de "Leaderboard", projetada para ser exibida também em telões secundários, listando o Top 10 com pódio destacado.
7. **`/admin`:** Painel de controle oculto para a equipe da Plim exportar os dados dos participantes (Relatório JSON) e gerenciar a fila.

---

## 3. Armazenamento de Dados e Estratégia de Servidor

### O Protótipo Atual (Demonstração via Vercel)
Atualmente, o projeto utiliza uma arquitetura **Offline-First** através do **IndexedDB** do navegador. 
- **Como funciona:** Quando alguém joga, os dados ficam salvos na memória do próprio navegador (Google Chrome/Edge) que está rodando o site.
- **Vantagem:** Para a validação visual (enviar o link da Vercel para o cliente testar no celular ou notebook), funciona perfeitamente. Ninguém precisa de um banco de dados complexo configurado.

### Arquitetura Oficial para o Dia do Evento (Servidor Local)
O briefing exige a **consolidação do ranking de dois totens distintos** e **limitação de 1 participação por CPF em ambas as máquinas**.

Se usarmos o IndexedDB no dia, o Totem A não saberá os dados do Totem B. Como definido que o sistema rodará em um **Servidor Dedicado/Local** no evento:

**Plano de Integração (Next Steps):**
1. **Banco de Dados Centralizado:** Subir um banco PostgreSQL, SQLite ou MySQL no servidor principal do evento (ou usar um banco na nuvem como Firebase/Supabase, caso haja garantia de internet 100% estável).
2. **APIs no Next.js:** Criaremos rotas internas (`/api/participants`, `/api/ranking`) no próprio Next.js.
3. **Conexão dos Totens:** Os dois totens serão conectados na rede (via cabo ou Wi-Fi interno) e acessarão o IP do servidor (ex: `192.168.0.100:3000`).
4. Dessa forma, quando o jogador inserir o CPF no Totem A, o sistema fará a validação no Servidor Central, garantindo que ele não jogou antes no Totem B, e o ranking exibido será o consolidado real de todo o evento.

---

## 4. Próximos Passos
- Aprovação visual do layout e fluxo pelo cliente via link de teste (Vercel).
- Recebimento dos logotipos finais (Patrocínio).
- Definição da infraestrutura do dia do evento (Servidor Local vs. Nuvem) para a troca do banco de dados (IndexedDB -> Postgres/Firebase).
