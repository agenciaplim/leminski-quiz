"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type SoundName = 'click' | 'start' | 'finish' | 'ranking';

type AudioContextType = {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (sound: SoundName) => void;
};

const SOUND_FILES: Record<SoundName, string> = {
  click: '/audio/click.wav',
  start: '/audio/start.wav',
  finish: '/audio/finish.wav',
  ranking: '/audio/ranking.wav',
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  // Começamos mutados por causa das políticas de Autoplay dos navegadores
  const [isMuted, setIsMuted] = useState(true);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar a música de fundo
    bgMusicRef.current = new Audio('/audio/bg-music.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.15; // Volume bem baixo

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (isMuted) {
      bgMusicRef.current.pause();
    } else {
      // Tentar tocar (pode falhar se o usuário não tiver interagido com a página ainda)
      bgMusicRef.current.play().catch(e => console.log('Autoplay prevent prevented bg music', e));
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playSfx = (sound: SoundName) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(SOUND_FILES[sound]);
      audio.volume = 0.8;
      audio.play().catch(e => console.log('Erro ao tocar SFX', e));
    } catch (err) {
      console.log('Arquivo de som não encontrado ou erro:', err);
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSfx }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
