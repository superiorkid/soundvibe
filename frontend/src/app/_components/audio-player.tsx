"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAudio } from "@/context/audio-context";
import { formatTime } from "@/lib/utils";
import {
  HeartIcon,
  ListPlusIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  UserPlusIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
  VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const AudioPlayer = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seekTo,
    currentTrack,
    audioRef,
  } = useAudio();

  const [seeking, setSeeking] = useState(false);
  const [tempTime, setTempTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0.0 - 1.0

  const handleValueChange = (values: number[]) => {
    setTempTime(values[0]);
  };

  const handleValueCommit = (values: number[]) => {
    setSeeking(false);
    seekTo(values[0]);
  };

  const handlePointerDown = () => {
    setSeeking(true);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 10; // slider is 0–10
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = false;
    }
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Select proper volume icon based on state
  const renderVolumeIcon = () => {
    if (isMuted) return <VolumeOffIcon size={16} />;
    if (volume === 0) return <VolumeXIcon size={16} />;
    if (volume <= 0.5) return <Volume1Icon size={16} />;
    return <Volume2Icon size={16} />;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-13 border-t px-5 2xl:px-0 bg-zinc-100">
      <div className="max-w-7xl mx-auto h-full flex items-center gap-8">
        {/* Playback Controls */}
        <div className="flex items-center gap-5">
          <button>
            <SkipBackIcon size={19} fill="black" />
          </button>
          <button
            className="p-2 rounded-full border border-rose-400 bg-foreground text-background"
            onClick={togglePlay}
          >
            {isPlaying ? <PauseIcon size={19} /> : <PlayIcon size={19} />}
          </button>
          <button>
            <SkipForwardIcon size={19} fill="black" />
          </button>
        </div>

        {/* Progress & Volume */}
        <div className="flex items-center gap-6 flex-1">
          <button>
            <ShuffleIcon size={16} />
          </button>
          <button>
            <RepeatIcon size={16} />
          </button>
          <div className="flex items-center gap-2 w-full">
            <Label>{formatTime(seeking ? tempTime : currentTime)}</Label>
            <Slider
              value={[seeking ? tempTime : currentTime]}
              onValueChange={handleValueChange}
              onValueCommit={handleValueCommit}
              onPointerDown={handlePointerDown}
              max={duration}
              step={0.1}
            />
            <Label>{formatTime(duration)}</Label>
          </div>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button onClick={toggleMute}>{renderVolumeIcon()}</button>
            </HoverCardTrigger>
            <HoverCardContent className="mb-6 w-fit" side="top">
              <Slider
                value={[volume * 10]}
                max={10}
                orientation="vertical"
                aria-label="Volume slider"
                onValueChange={handleVolumeChange}
              />
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Track Info */}
        {currentTrack && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-9 h-10">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1588260692987-01360da8185b?q=80&w=826&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="track image"
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="text-sm max-w-[172px] space-y-0.5">
                <h2 className="font-bold text-muted-foreground line-clamp-1">
                  {currentTrack.trackArtist}
                </h2>
                <p className="font-semibold text-xs tracking-wide line-clamp-1">
                  {currentTrack.trackTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-7">
              <button>
                <HeartIcon size={17} strokeWidth={2} />
              </button>
              <button>
                <UserPlusIcon size={17} strokeWidth={2} />
              </button>
              <button>
                <ListPlusIcon size={17} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
