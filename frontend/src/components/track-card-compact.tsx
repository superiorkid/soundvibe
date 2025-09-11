"use client";

import { useAudio } from "@/context/audio-context";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TrackCardCompactActions from "./track-card-compact-actions";
import { Button } from "./ui/button";

interface TrackCardCompactProps {
  audio: TAudio;
  index: number;
  onPlay?: (audio: TAudio) => void;
}

const TrackCardCompact = ({ audio, index, onPlay }: TrackCardCompactProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isThisTrackPlaying =
    currentTrack?.audioFile.url === audio.audioFile.url && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioFile.url === audio.audioFile.url) {
      togglePlay();
    } else {
      playTrack(audio);
    }

    onPlay?.(audio);
  };

  return (
    <div className="items-center flex text-sm relative group hover:bg-zinc-300 p-2">
      <div className="size-10 relative mr-2 rounded-md overflow-hidden">
        {audio.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/audio/cover/${audio.id}`}
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
              width="32"
              height="32"
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

        <Button
          size="icon"
          onClick={handlePlay}
          className={cn(
            "rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background group-hover:opacity-85 hidden group-hover:flex hover:cursor-pointer hover:bg-background/80",
            isThisTrackPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
          aria-label={isThisTrackPlaying ? "Pause" : "Play"}
        >
          {isThisTrackPlaying ? (
            <PauseIcon className="fill-foreground stroke-foreground" />
          ) : (
            <PlayIcon className="fill-foreground stroke-foreground" />
          )}
        </Button>
      </div>

      <p className="line-clamp-1 font-semibold pr-3 flex-1">
        <span className="text-muted-foreground">
          {index} &bull;{" "}
          <Link
            href={`/${audio.user.displayUsername}`}
            className="hover:opacity-50"
          >
            {audio.artist}
          </Link>{" "}
          &bull;
        </span>{" "}
        <Link
          href={`/${audio.user.displayUsername}/${audio.slug}`}
          className="hover:opacity-50"
        >
          {audio.title}
        </Link>
      </p>

      <span className="ml-auto text-xs tracking-wide text-muted-foreground flex gap-1 items-center">
        <PlayIcon className="fill-foreground" size={12} />
        <span>{audio.playsCount}</span>
      </span>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex invisible group-hover:visible text-background pr-6 pl-12 py-1 rounded h-full group-hover:bg-zinc-300">
        <TrackCardCompactActions audio={audio} />
      </div>
    </div>
  );
};

export default TrackCardCompact;
