"use client";

import { useIncrementPlay } from "@/hooks/tanstack/audio";
import { useSetListeningHistory } from "@/hooks/tanstack/listening-history";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TAudio } from "@/types/audio.type";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type RepeatMode = "off" | "one" | "all";

interface AudioState {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;

  queue: TAudio[];
  currentIndex: number;
  currentTrack: TAudio | null;

  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // Queue functions
  setQueue: (tracks: TAudio[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;

  // Player functions
  playTrack: (track: TAudio | null, startTime?: number) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  setCurrentTime: (time: number) => void;
  resetTrack: () => void;
  clearTrack: () => void;
  setCurrentTrack: React.Dispatch<React.SetStateAction<TAudio | null>>;

  shuffle: boolean;
  repeat: RepeatMode;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const AudioContext = createContext<AudioState | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastTrack, setLastTrack] = useLocalStorage("lastTrack");
  const { incrementPlayMutation } = useIncrementPlay();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, _setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [queue, setQueueState] = useState<TAudio[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");

  const toggleShuffle = () => setShuffle(!shuffle);
  const toggleRepeat = () =>
    setRepeat(repeat === "off" ? "all" : repeat === "all" ? "one" : "off");

  // local flag for preventing multiple play counts
  const hasCountedRef = useRef(false);

  const { setListeningHistoryMutation } = useSetListeningHistory();

  const setCurrentTime = (time: number) => {
    _setCurrentTime(Math.max(0, Math.min(time, duration || 0)));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      _setCurrentTime(audio.currentTime);

      // trigger play count after 30 seconds
      if (!hasCountedRef.current && audio.currentTime >= 30 && currentTrack) {
        incrementPlayMutation(currentTrack.id);
        hasCountedRef.current = true;
      }
    };

    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (repeat === "one") {
        playTrack(currentTrack, 0);
        return;
      }

      playNext();
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
  }, [setCurrentTime, currentTrack]);

  const playTrack = (track: TAudio | null, startTime = 0) => {
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

    const streamUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${track.streamUrl}`;

    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
    } else if (audioRef.current.src !== streamUrl) {
      audioRef.current.src = streamUrl;
    }

    // reset play count flag when a new track starts
    hasCountedRef.current = false;

    setCurrentTrack(track);
    audioRef.current.currentTime = startTime;
    setCurrentTime(startTime);
    audioRef.current.play();
    setIsPlaying(true);
    setLastTrack(JSON.stringify(track));

    setListeningHistoryMutation(track.id);
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      if (lastTrack) {
        const parsedTrack: TAudio = JSON.parse(lastTrack);
        playTrack(parsedTrack, currentTime || 0);
      }
      return;
    }

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

  const pauseTrack = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const clearTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentTrack(null);
    setLastTrack(null);
  };

  const setQueue = (tracks: TAudio[], startIndex = 0) => {
    setQueueState(tracks);
    setCurrentIndex(startIndex);
    playTrack(tracks[startIndex]);
  };

  const playNext = () => {
    if (shuffle && queue.length > 1) {
      // pick a random index that isn't the current one
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(nextIndex);
      playTrack(queue[nextIndex]);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playTrack(queue[nextIndex]);
    } else {
      if (repeat === "all") {
        setCurrentIndex(0);
        playTrack(queue[0]);
      } else {
        stopTrack();
      }
    }
  };

  const playPrevious = () => {
    if (shuffle && queue.length > 1) {
      let prevIndex = currentIndex;
      while (prevIndex === currentIndex) {
        prevIndex = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(prevIndex);
      playTrack(queue[prevIndex]);
      return;
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playTrack(queue[prevIndex]);
    } else {
      if (repeat === "all") {
        const lastIndex = queue.length - 1;
        setCurrentIndex(lastIndex);
        playTrack(queue[lastIndex]);
      } else {
        stopTrack();
      }
    }
  };

  useEffect(() => {
    try {
      if (lastTrack) {
        setCurrentTrack(JSON.parse(lastTrack) as TAudio);
      }
    } catch (error) {
      console.error("Failed to parse lastTrack from localStorage", error);
    }
  }, [lastTrack]);

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
        pauseTrack,
        stopTrack,
        clearTrack,
        setCurrentTrack,
        playNext,
        currentIndex,
        playPrevious,
        queue,
        setQueue,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
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
