"use client";

import { TTrack } from "@/types/track.type";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioState {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  currentTrack: TTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: TTrack | null, startTime?: number) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setCurrentTime: (time: number) => void;
  resetTrack: () => void;
}

const AudioContext = createContext<AudioState | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, _setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const setCurrentTime = (time: number) => {
    _setCurrentTime(Math.max(0, Math.min(time, duration || 0)));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => _setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setCurrentTime]);

  const playTrack = (track: TTrack | null, startTime = 0) => {
    if (track === null) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentTrack(null);
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioSrc);
    } else if (audioRef.current.src !== track.audioSrc) {
      audioRef.current.src = track.audioSrc;
    }

    setCurrentTrack(track);
    audioRef.current.currentTime = startTime;
    setCurrentTime(startTime);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const resetTrack = () => {
    playTrack(null);
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        togglePlay,
        seekTo,
        setCurrentTime,
        resetTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};
