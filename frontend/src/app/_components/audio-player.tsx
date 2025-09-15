"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAudio } from "@/context/audio-context";
import { useLastTrack } from "@/context/last-track-context";
import { useAudioBySlug, useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn, formatTime } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import {
  HeartIcon,
  ListPlusIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
  VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PlaylistOption from "../(main)/_components/playlist-option";

const AudioPlayer = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seekTo,
    currentTrack,
    audioRef,
    playNext,
    playPrevious,
  } = useAudio();

  const { data: session } = authClient.useSession();

  const { audio } = useAudioBySlug(currentTrack?.slug || "");

  const {
    hasLiked,
    toggleLikeMutation,
    isPending: isLikePending,
  } = useLike(audio?.data as TAudio, session?.user.id as string);

  const { lastTrack } = useLastTrack();

  const [seeking, setSeeking] = useState(false);
  const [tempTime, setTempTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const handleValueChange = (values: number[]) => setTempTime(values[0]);
  const handleValueCommit = (values: number[]) => {
    setSeeking(false);
    seekTo(values[0]);
  };
  const handlePointerDown = () => setSeeking(true);

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 10;
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

  const renderVolumeIcon = () => {
    if (isMuted) return <VolumeOffIcon size={16} />;
    if (volume === 0) return <VolumeXIcon size={16} />;
    if (volume <= 0.5) return <Volume1Icon size={16} />;
    return <Volume2Icon size={16} />;
  };

  // Don’t render if no track
  if (!currentTrack && !lastTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-13 border-t px-5 2xl:px-0 bg-zinc-100 border-zinc-300 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center gap-8">
        {/* Playback Controls */}
        <div className="flex items-center gap-5">
          <button onClick={playPrevious} className="hover:cursor-pointer">
            <SkipBackIcon size={19} fill="black" />
          </button>
          <button
            className="p-2 rounded-full border border-background bg-foreground text-background"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon
                className="fill-background stroke-background"
                size={19}
              />
            ) : (
              <PlayIcon
                className="fill-background stroke-background"
                size={19}
              />
            )}
          </button>
          <button onClick={playNext} className="hover:cursor-pointer">
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
                {currentTrack.coverFile ? (
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/audio/cover/${currentTrack.id}`}
                    alt="track image"
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-sm max-w-[172px] space-y-0.5">
                <h2 className="font-medium text-xs text-muted-foreground line-clamp-1 capitalize hover:cursor-pointer hover:opacity-50">
                  <Link href={`/${currentTrack.user.displayUsername}`}>
                    {currentTrack.artist ?? "Unknown Artist"}
                  </Link>
                </h2>
                <p className="font-semibold text-xs tracking-wide line-clamp-1 capitalize hover:cursor-pointer hover:opacity-50">
                  <Link
                    href={`/${currentTrack.user.displayUsername}/${currentTrack.slug}`}
                  >
                    {currentTrack.title}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-7">
              {/* Like */}
              <button
                disabled={isLikePending}
                onClick={() => toggleLikeMutation()}
                className="hover:cursor-pointer"
              >
                <HeartIcon
                  size={17}
                  strokeWidth={2}
                  className={cn(
                    "hover:opacity-50 fill-foreground",
                    hasLiked && "fill-red-500 stroke-red-500 hover:fill-red-600"
                  )}
                />
                <span className="sr-only">
                  {hasLiked ? "Dislike" : "Like"} Track
                </span>
              </button>

              <Dialog>
                <DialogTrigger
                  className="hover:cursor-pointer flex items-center gap-1.5"
                  asChild
                >
                  <button>
                    <ListPlusIcon size={16} strokeWidth={2} />
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="top-[8%] left-[50%] translate-x-[-50%] translate-y-[-0%] data-[state=open]:slide-in-from-top-90 data-[state=closed]:slide-out-to-top-90 duration-400 rounded-md min-w-[556px] p-4"
                  onInteractOutside={(event) => event.preventDefault()}
                >
                  <PlaylistOption audio={currentTrack} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
