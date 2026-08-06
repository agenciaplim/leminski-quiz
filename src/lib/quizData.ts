export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuestionLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  level: QuestionLevel;
  text: string;
  options: Option[];
}

export const quizQuestions: Question[] = [
  // EASY
  {
    id: 1, level: 'easy', text: "Além da poesia, Paulo Leminski também se destacou em qual outra forma de expressão artística?",
    options: [{ id: "a", text: "Pintura", isCorrect: false }, { id: "b", text: "Música", isCorrect: true }, { id: "c", text: "Cinema", isCorrect: false }, { id: "d", text: "Escultura", isCorrect: false }]
  },
  {
    id: 2, level: 'easy', text: "A Prefeitura de Curitiba batizou com o nome do poeta um famoso espaço da cidade. Qual?",
    options: [{ id: "a", text: "Teatro Paulo Leminski", isCorrect: false }, { id: "b", text: "Biblioteca Paulo Leminski", isCorrect: false }, { id: "c", text: "Pedreira Paulo Leminski", isCorrect: true }, { id: "d", text: "Arena Paulo Leminski", isCorrect: false }]
  },
  {
    id: 3, level: 'easy', text: "Em que cidade nasceu e viveu Paulo Leminski?",
    options: [{ id: "a", text: "Curitiba", isCorrect: true }, { id: "b", text: "São Paulo", isCorrect: false }, { id: "c", text: "Porto Alegre", isCorrect: false }, { id: "d", text: "Rio de Janeiro", isCorrect: false }]
  },
  {
    id: 4, level: 'easy', text: 'A expressão "meu coração de polaco" faz referência à ascendência de Leminski, cuja família veio da ________.',
    options: [{ id: "a", text: "Portugal", isCorrect: false }, { id: "b", text: "Polônia", isCorrect: true }, { id: "c", text: "Áustria", isCorrect: false }, { id: "d", text: "Japão", isCorrect: false }]
  },
  {
    id: 5, level: 'easy', text: "A coletânea que reúne a obra poética completa de Leminski e virou best-seller em 2013 chama-se:",
    options: [{ id: "a", text: "Catatau", isCorrect: false }, { id: "b", text: "Vida", isCorrect: false }, { id: "c", text: "Caprichos e Relaxos", isCorrect: false }, { id: "d", text: "Toda Poesia", isCorrect: true }]
  },
  {
    id: 6, level: 'easy', text: "Qual filha de Paulo Leminski se apresenta hoje no Festival com o show Leminskanções?",
    options: [{ id: "a", text: "Áurea", isCorrect: false }, { id: "b", text: "Estrela", isCorrect: true }, { id: "c", text: "Alice", isCorrect: false }, { id: "d", text: "Maria", isCorrect: false }]
  },
  {
    id: 7, level: 'easy', text: "Além de Estrela, qual é o nome de outra filha do poeta Paulo Leminski?",
    options: [{ id: "a", text: "Áurea", isCorrect: true }, { id: "b", text: "Alice", isCorrect: false }, { id: "c", text: "Estrela", isCorrect: false }, { id: "d", text: "Maria", isCorrect: false }]
  },
  {
    id: 8, level: 'easy', text: "Em que dia Paulo Leminski nasceu?",
    options: [{ id: "a", text: "24 de agosto", isCorrect: true }, { id: "b", text: "5 de junho", isCorrect: false }, { id: "c", text: "15 de setembro", isCorrect: false }, { id: "d", text: "7 de dezembro", isCorrect: false }]
  },
  {
    id: 9, level: 'easy', text: 'Complete o verso de Paulo Leminski: "não discuto / com o destino ..."',
    options: [{ id: "a", text: "... o que pintar eu assino.", isCorrect: true }, { id: "b", text: "... ser poeta é o meu destino.", isCorrect: false }, { id: "c", text: "... mão no peito e canta o hino.", isCorrect: false }, { id: "d", text: "... o meu é beber no Lino.", isCorrect: false }]
  },
  {
    id: 10, level: 'easy', text: "De qual importante maestro, arranjador e compositor brasileiro, nascido em Paranaguá, Paulo Leminski era primo?",
    options: [{ id: "a", text: "Tom Jobim", isCorrect: false }, { id: "b", text: "Rogério Duprat", isCorrect: false }, { id: "c", text: "Waltel Branco", isCorrect: true }, { id: "d", text: "Heitor Villa-Lobos", isCorrect: false }]
  },
  // MEDIUM
  {
    id: 11, level: 'medium', text: "A poesia visual e experimental de Leminski dialoga diretamente com qual movimento brasileiro?",
    options: [{ id: "a", text: "Concretismo", isCorrect: true }, { id: "b", text: "Regionalismo", isCorrect: false }, { id: "c", text: "Naturalismo", isCorrect: false }, { id: "d", text: "Trovadorismo", isCorrect: false }]
  },
  {
    id: 12, level: 'medium', text: "Por qual estrutura poética Paulo Leminski se dedicou e foi reconhecido?",
    options: [{ id: "a", text: "Elegia", isCorrect: false }, { id: "b", text: "Balada", isCorrect: false }, { id: "c", text: "Haicai", isCorrect: true }, { id: "d", text: "Soneto", isCorrect: false }]
  },
  {
    id: 13, level: 'medium', text: "Paulo Leminski era _______ mas fez uma poesia em homenagem a um título do _________",
    options: [{ id: "a", text: "Palmeirense, Corinthians", isCorrect: false }, { id: "b", text: "Corinthiano, Palmeiras", isCorrect: false }, { id: "c", text: "Coxa-Branca, Athletico", isCorrect: false }, { id: "d", text: "Atleticano, Coritiba", isCorrect: true }]
  },
  {
    id: 14, level: 'medium', text: "Em qual bairro de Curitiba Leminski viveu grande parte de sua vida e onde mantinha uma efervescência cultural?",
    options: [{ id: "a", text: "Bacacheri", isCorrect: false }, { id: "b", text: "Abranches", isCorrect: false }, { id: "c", text: "Pilarzinho", isCorrect: true }, { id: "d", text: "Água verde", isCorrect: false }]
  },
  {
    id: 15, level: 'medium', text: "O mural gigante de Paulo Leminski, no Centro de Curitiba, fica na esquina entre as ruas:",
    options: [{ id: "a", text: "Travessa da Lapa com Rua XV de Novembro", isCorrect: true }, { id: "b", text: "Largo da Ordem com Rua São Francisco", isCorrect: false }, { id: "c", text: "Avenida Batel com Rua Bispo Dom José", isCorrect: false }, { id: "d", text: "Praça Tiradentes com Rua Barão do Serro Azul", isCorrect: false }]
  },
  {
    id: 16, level: 'medium', text: "Poliglota de mão cheia! Além do português, em quantos idiomas Leminski se virava?",
    options: [{ id: "a", text: "2", isCorrect: false }, { id: "b", text: "4", isCorrect: false }, { id: "c", text: "6", isCorrect: true }, { id: "d", text: "9", isCorrect: false }]
  },
  {
    id: 17, level: 'medium', text: "Leminski foi professor de cursinho pré-vestibular. Que disciplina ele lecionava?",
    options: [{ id: "a", text: "História e Redação", isCorrect: true }, { id: "b", text: "Física", isCorrect: false }, { id: "c", text: "Matemática", isCorrect: false }, { id: "d", text: "Química", isCorrect: false }]
  },
  {
    id: 18, level: 'medium', text: "Leminski conquistou a faixa preta e chegou a dar aulas em qual arte-marcial?",
    options: [{ id: "a", text: "Jiu-Jitsu", isCorrect: false }, { id: "b", text: "Judô", isCorrect: true }, { id: "c", text: "Taekwondo", isCorrect: false }, { id: "d", text: "Muay-thai", isCorrect: false }]
  },
  {
    id: 19, level: 'medium', text: "Paulo Leminski foi um artista múltiplo: além de músico, compositor, tradutor, professor, publicitário também foi ______.",
    options: [{ id: "a", text: "Vereador", isCorrect: false }, { id: "b", text: "Arquiteto", isCorrect: false }, { id: "c", text: "Psicólogo", isCorrect: false }, { id: "d", text: "Jornalista", isCorrect: true }]
  },
  {
    id: 20, level: 'medium', text: "Qual destes é o famoso romance experimental de Paulo Leminski?",
    options: [{ id: "a", text: "Dom Casmurro", isCorrect: false }, { id: "b", text: "Iracema", isCorrect: false }, { id: "c", text: "Catatau", isCorrect: true }, { id: "d", text: "O Cortiço", isCorrect: false }]
  },
  {
    id: 21, level: 'medium', text: "Publicado só depois do seu falecimento, 'Metamorfose' ainda rendeu a Leminski um prêmio em 1995. Qual?",
    options: [{ id: "a", text: "Jabuti", isCorrect: true }, { id: "b", text: "Camões", isCorrect: false }, { id: "c", text: "Nobel", isCorrect: false }, { id: "d", text: "Machado de Assis", isCorrect: false }]
  },
  {
    id: 22, level: 'medium', text: "Para qual banda de rock Paulo Leminski escreveu um release?",
    options: [{ id: "a", text: "IRA", isCorrect: false }, { id: "b", text: "Titãs", isCorrect: true }, { id: "c", text: "Legião Urbana", isCorrect: false }, { id: "d", text: "Barão Vermelho", isCorrect: false }]
  },
  // HARD
  {
    id: 23, level: 'hard', text: "Antes de virar lenda, a estreia de Leminski na literatura foi em que ano e onde?",
    options: [{ id: "a", text: "1972, no romance Catatau", isCorrect: false }, { id: "b", text: "1964, na revista Invenção", isCorrect: true }, { id: "c", text: "1962, no jornal O Estado do Paraná", isCorrect: false }, { id: "d", text: "1976, no livro Quarenta clics em Curitiba", isCorrect: false }]
  },
  {
    id: 24, level: 'hard', text: "A casa de Leminski e Alice Ruiz, no Pilarzinho, virou nos anos 1970 um lendário reduto criativo e de contracultura. Ficou apelidada de:",
    options: [{ id: "a", text: "O Casarão Concreto", isCorrect: false }, { id: "b", text: "O Sarau do Batel", isCorrect: false }, { id: "c", text: "A Toca dos Poetas", isCorrect: false }, { id: "d", text: "O Guruato da Marginália", isCorrect: true }]
  },
  {
    id: 25, level: 'hard', text: "O verso 'Meu coração de polaco voltou' ganhou versão em polonês. Qual é a certa?",
    options: [{ id: "a", text: "Polskie serce znów bije", isCorrect: false }, { id: "b", text: "Moje serce wróciło do Polski", isCorrect: false }, { id: "c", text: "Powróciło moje polskie serce", isCorrect: true }, { id: "d", text: "Wróciło moje słowiańskie serce", isCorrect: false }]
  },
  {
    id: 26, level: 'hard', text: "Com quem Leminski aprendeu seus primeiros acordes de violão?",
    options: [{ id: "a", text: "O irmão, Pedro Leminski Neto", isCorrect: true }, { id: "b", text: "O pai", isCorrect: false }, { id: "c", text: "Itamar Assumpção", isCorrect: false }, { id: "d", text: "Caetano Veloso", isCorrect: false }]
  },
  {
    id: 27, level: 'hard', text: "Leminski traduziu e mergulhou em DOIS autores japoneses. Quais?",
    options: [{ id: "a", text: "Ishiguro e Sōseki", isCorrect: false }, { id: "b", text: "Murakami e Kawabata", isCorrect: false }, { id: "c", text: "Tanizaki e Ōe", isCorrect: false }, { id: "d", text: "Mishima e Bashô", isCorrect: true }]
  },
  {
    id: 28, level: 'hard', text: "Em 1981, Caetano Veloso gravou uma música com letra de Leminski. Qual?",
    options: [{ id: "a", text: "Sampa", isCorrect: false }, { id: "b", text: "Verdura", isCorrect: true }, { id: "c", text: "Sozinho", isCorrect: false }, { id: "d", text: "Trilhos Urbanos", isCorrect: false }]
  },
  {
    id: 29, level: 'hard', text: "Aos 23 anos, o jovem Leminski fundou um grupo de vanguarda — com direito a manifesto e tudo. Qual era o nome?",
    options: [{ id: "a", text: "Vaga-lume", isCorrect: false }, { id: "b", text: "Noigandres", isCorrect: false }, { id: "c", text: "Frenesi", isCorrect: false }, { id: "d", text: "Áporo", isCorrect: true }]
  },
  {
    id: 30, level: 'hard', text: "Antes da poesia, quase virou monge! Aos 14 anos, Leminski foi viver como oblato em qual mosteiro paulista?",
    options: [{ id: "a", text: "Convento de Santo Antônio", isCorrect: false }, { id: "b", text: "Mosteiro da Luz", isCorrect: false }, { id: "c", text: "Mosteiro de São Bento", isCorrect: true }, { id: "d", text: "Mosteiro de São Bernardo", isCorrect: false }]
  },
  {
    id: 31, level: 'hard', text: "Em Catatau, um dos personagens é um célebre filósofo europeu. Quem é ele?",
    options: [{ id: "a", text: "Descartes", isCorrect: true }, { id: "b", text: "Nietzsche", isCorrect: false }, { id: "c", text: "Sartre", isCorrect: false }, { id: "d", text: "Heidegger", isCorrect: false }]
  },
  {
    id: 32, level: 'hard', text: "Para qual banda de rock Paulo Leminski compôs suas primeiras canções?",
    options: [{ id: "a", text: "A Chave", isCorrect: true }, { id: "b", text: "Blindagem", isCorrect: false }, { id: "c", text: "Beijo AA Força", isCorrect: false }, { id: "d", text: "Carne Podre", isCorrect: false }]
  },
  {
    id: 33, level: 'hard', text: "Sobre qual dessas personalidades Paulo Leminski NÃO escreveu uma biografia?",
    options: [{ id: "a", text: "Augusto dos Anjos", isCorrect: true }, { id: "b", text: "Bashô", isCorrect: false }, { id: "c", text: "Jesus Cristo", isCorrect: false }, { id: "d", text: "Trótski", isCorrect: false }]
  }
];
