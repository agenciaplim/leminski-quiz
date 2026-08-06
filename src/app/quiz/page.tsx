"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, Question, Option } from "@/lib/quizData";
import { db } from "@/lib/db";
import { useAudio } from "@/contexts/AudioContext";
import { Timer } from "lucide-react";

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const router = useRouter();
  const { playSfx } = useAudio();
  const [cpf, setCpf] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // 20s per question
  
  const [quizFinished, setQuizFinished] = useState(false);
  const startTime = useRef(Date.now());
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const sessionCpf = sessionStorage.getItem("quiz_cpf");
    if (!sessionCpf) {
      router.push("/");
      return;
    }
    setCpf(sessionCpf);

    // Pick 3 of each level
    const easy = shuffle(quizQuestions.filter(q => q.level === 'easy')).slice(0, 3);
    const medium = shuffle(quizQuestions.filter(q => q.level === 'medium')).slice(0, 3);
    const hard = shuffle(quizQuestions.filter(q => q.level === 'hard')).slice(0, 3);

    const selectedQuestions = [...easy, ...medium, ...hard];
    
    // Mantém a ordem (3 fáceis, 3 médias, 3 difíceis) e embaralha apenas as alternativas
    const phaseOrdered = selectedQuestions.map(q => ({
      ...q,
      options: shuffle(q.options)
    }));
    
    setQuestions(phaseOrdered);
    startTime.current = Date.now();
  }, [router]);

  useEffect(() => {
    if (quizFinished || questions.length === 0 || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizFinished, questions.length, currentIndex, showFeedback]);

  const handleTimeOut = () => {
    if (showFeedback) return;
    setShowFeedback(true);
    
    setTimeout(() => {
      advanceQuestion(knowledgeScore);
    }, 2000);
  };

  const handleFinish = async (finalKnowledgeScore: number) => {
    setQuizFinished(true);
    const timeMs = Date.now() - startTime.current; // Total time spent in ms
    
    // Calculate final score
    const maxTimeS = questions.length * 20; // 9 * 20 = 180s
    let totalTimeS = timeMs / 1000;
    if (totalTimeS > maxTimeS) totalTimeS = maxTimeS;
    
    const timeFactor = (maxTimeS - totalTimeS) / maxTimeS;
    const finalScore = Math.round(finalKnowledgeScore * (1 + Math.max(0, timeFactor)));
    
    if (cpf) {
      const participant = await db.participants.where("cpf").equals(cpf).first();
      if (participant && participant.id) {
        await db.participants.update(participant.id, {
          score: finalScore,
          timeMs,
          synced: false, // Agora sim a partida está pronta para ir pra nuvem
          status: 'concluido'
        });
      }
    }
    
    playSfx('finish');
    router.push("/resultado");
  };

  const advanceQuestion = (currentKnowledgeScore: number) => {
    playSfx('click');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(20); // Reset timer for next question
    } else {
      handleFinish(currentKnowledgeScore);
    }
  };

  const handleOptionClick = (option: Option) => {
    if (showFeedback) return;
    
    if (option.isCorrect) {
      playSfx('select');
    } else {
      playSfx('wrong');
    }
    
    setSelectedOption(option.id);
    setShowFeedback(true);

    let newKnowledgeScore = knowledgeScore;
    if (option.isCorrect) {
      const qLevel = questions[currentIndex].level;
      const points = qLevel === 'easy' ? 100 : qLevel === 'medium' ? 200 : 300;
      newKnowledgeScore += points;
      setKnowledgeScore(newKnowledgeScore);
    }

    setTimeout(() => {
      advanceQuestion(newKnowledgeScore);
    }, 1500);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  
  const getLevelLabel = (level: string) => {
    if (level === 'easy') return { label: 'Fácil', color: 'text-green-400' };
    if (level === 'medium') return { label: 'Média', color: 'text-yellow-400' };
    return { label: 'Difícil', color: 'text-red-400' };
  };

  const levelInfo = getLevelLabel(currentQuestion.level);

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-10 overflow-y-auto relative">
      {/* Imagem de fundo pouco visível */}
      <div 
        className="fixed inset-0 z-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'url(/fundo-quiz.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} 
      />

      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-6 md:mb-12 space-y-4 md:space-y-0">
        <div className="flex space-x-2 md:space-x-4">
          <div className="glass-panel px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-2xl font-bold text-leminski-blue whitespace-nowrap">
            Pergunta {currentIndex + 1} / {questions.length}
          </div>
          <div className={`glass-panel px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-xl font-bold uppercase tracking-widest ${
            levelInfo.label === 'Fácil' ? 'text-green-600' : levelInfo.label === 'Média' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {levelInfo.label}
          </div>
        </div>
        
        <div className={`glass-panel px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center text-xl md:text-3xl font-black ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-leminski-blue'}`}>
          <Timer className="w-5 h-5 mr-2 md:w-8 md:h-8 md:mr-3" />
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full space-y-6 md:space-y-12 pb-10 md:pb-20 my-auto">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight text-center text-leminski-light drop-shadow-[4px_4px_0px_#192B4D]">
          {currentQuestion.text}
        </h2>

        {showFeedback && selectedOption && (
          <div className={`text-center py-3 md:py-4 rounded-2xl font-black text-xl md:text-3xl animate-in zoom-in duration-200 shadow-[4px_4px_0px_#192B4D] ${
            currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
              ? 'bg-green-500 text-white border-4 border-leminski-blue' 
              : 'bg-red-500 text-white border-4 border-leminski-blue'
          }`}>
            {currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
              ? '✅ RESPOSTA CORRETA!' 
              : '❌ RESPOSTA INCORRETA!'}
          </div>
        )}

        {showFeedback && !selectedOption && (
          <div className="text-center py-3 md:py-4 rounded-2xl font-black text-xl md:text-3xl animate-in zoom-in duration-200 shadow-[4px_4px_0px_#192B4D] bg-yellow-500 text-white border-4 border-leminski-blue">
            ⏱️ TEMPO ESGOTADO!
          </div>
        )}

        <div className="flex flex-col space-y-3 md:space-y-6 w-full">
          {currentQuestion.options.map((opt) => {
            let btnClass = "glass-panel text-left p-4 md:p-8 rounded-2xl md:rounded-3xl text-lg md:text-2xl lg:text-3xl font-bold transition-all active:translate-y-1 hover:bg-leminski-peach text-leminski-blue";
            
            if (showFeedback) {
              if (opt.isCorrect) {
                btnClass = "bg-green-500 border-4 border-leminski-blue text-white p-4 md:p-8 rounded-2xl md:rounded-3xl text-lg md:text-2xl lg:text-3xl font-bold shadow-[4px_4px_0px_#192B4D]";
              } else if (selectedOption === opt.id) {
                btnClass = "bg-red-500 border-4 border-leminski-blue text-white p-4 md:p-8 rounded-2xl md:rounded-3xl text-lg md:text-2xl lg:text-3xl font-bold shadow-[4px_4px_0px_#192B4D]";
              } else {
                btnClass = "glass-panel opacity-50 text-left p-4 md:p-8 rounded-2xl md:rounded-3xl text-lg md:text-2xl lg:text-3xl font-bold text-leminski-blue";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt)}
                disabled={showFeedback}
                className={btnClass}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
