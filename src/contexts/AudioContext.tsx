"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type SoundName = 'click' | 'start' | 'finish' | 'ranking' | 'select' | 'wrong';

type AudioContextType = {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  playSfx: (sound: SoundName) => void;
  changeVolume: (delta: number) => void;
};

const SOUND_FILES: Record<SoundName, string> = {
  click: '/audio/click.wav',
  start: '/audio/start.wav',
  finish: '/audio/finish.wav',
  ranking: '/audio/ranking.wav',
  select: '/audio/select.wav',
  wrong: '/audio/wrong.wav',
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  // Começamos mutados por causa das políticas de Autoplay dos navegadores
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5); // Default global volume 0.5
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar a música de fundo
    bgMusicRef.current = new Audio('/audio/bg-music.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = volume * 0.3; // BG music is scaled down so it's not too loud

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
  }, [isMuted, volume]); // Added volume to dependencies

  // Update bg music volume dynamically
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume * 0.3;
    }
  }, [volume]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const changeVolume = (delta: number) => {
    setVolume(prev => {
      const newVol = Math.min(1, Math.max(0, prev + delta));
      if (newVol > 0 && isMuted) {
        setIsMuted(false); // Unmute if increasing volume from mute
      }
      if (newVol === 0 && !isMuted) {
        setIsMuted(true); // Auto mute if volume drops to 0
      }
      return newVol;
    });
  };

  const playSfx = (sound: SoundName) => {
    if (isMuted || volume === 0) return;
    
    try {
      const audio = new Audio(SOUND_FILES[sound]);
      audio.volume = volume * 1.0; // SFX volume scaled by global volume
      audio.play().catch(e => console.log('Erro ao tocar SFX', e));
    } catch (err) {
      console.log('Arquivo de som não encontrado ou erro:', err);
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, volume, toggleMute, playSfx, changeVolume }}>
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
