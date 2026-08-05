"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, MousePointerClick } from "lucide-react";

export default function IdleTimeout() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(15);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Zera todos os timers
  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
  };

  const resetToHome = () => {
    clearTimers();
    setShowWarning(false);
    sessionStorage.removeItem("quiz_cpf");
    router.push("/");
  };

  const resetActivity = () => {
    clearTimers();
    setShowWarning(false);
    setCountdown(15);

    // Se estiver na Home ou Admin, não faz nada
    if (pathname === "/" || pathname === "/admin") {
      return;
    }

    const isResultOrRanking = pathname === "/resultado" || pathname === "/ranking";

    if (isResultOrRanking) {
      // 30 segundos diretos e volta pro início sem aviso
      timerRef.current = setTimeout(() => {
        resetToHome();
      }, 30000);
    } else {
      // Para cadastro, instruções e quiz: 30s para aviso, +15s para reset
      timerRef.current = setTimeout(() => {
        setShowWarning(true);
        let currentCount = 15;
        
        warningTimerRef.current = setInterval(() => {
          currentCount -= 1;
          setCountdown(currentCount);
          
          if (currentCount <= 0) {
            resetToHome();
          }
        }, 1000);
      }, 30000);
    }
  };

  useEffect(() => {
    // Escuta eventos de atividade
    const events = ["touchstart", "mousemove", "click", "scroll", "keydown"];
    const handleActivity = () => resetActivity();

    events.forEach((e) => window.addEventListener(e, handleActivity));

    // Inicializa
    resetActivity();

    return () => {
      clearTimers();
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [pathname]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-leminski-peach border-4 border-leminski-blue p-8 md:p-12 rounded-[2rem] shadow-[8px_8px_0px_#192B4D] max-w-lg w-full text-center flex flex-col items-center animate-in zoom-in duration-200">
        <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-leminski-red mb-4 animate-bounce" />
        <h2 className="text-2xl md:text-4xl font-black text-leminski-blue uppercase mb-4 leading-tight">
          Você ainda <br/> está aí?
        </h2>
        <p className="text-lg md:text-xl font-bold text-leminski-blue/80 mb-6">
          A tela será reiniciada em <br/>
          <span className="text-4xl md:text-5xl font-black text-leminski-red">{countdown}</span> segundos
        </p>
        
        <button
          onClick={resetActivity}
          className="w-full py-4 bg-leminski-blue text-white rounded-full font-black uppercase text-xl flex items-center justify-center shadow-[4px_4px_0px_rgba(25,43,77,0.3)] active:translate-y-1 active:shadow-none hover:bg-leminski-blue/90 transition-all"
        >
          <MousePointerClick className="w-6 h-6 mr-3" />
          Continuar Jogando
        </button>
      </div>
    </div>
  );
}
