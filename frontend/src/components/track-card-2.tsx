"use client";

import { useAudio } from "@/context/audio-context";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import {
  EllipsisIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  UserCheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TrackOptions from "./track-options";
import UserTooltip from "./user-tooltip";
import { Button } from "./ui/button";

interface TrackCard2Props {
  audio: TAudio;
}

const TrackCard2 = ({ audio }: TrackCard2Props) => {
  const { data: session } = authClient.useSession();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const { toggleLikeMutation, isPending, hasLiked } = useLike(
    audio,
    session?.user.id as string
  );

  const isThisTrackPlaying =
    currentTrack?.audioFile.url === audio.audioFile.url && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioFile.url === audio.audioFile.url) {
      togglePlay();
    } else {
      playTrack(audio);
    }
  };

  const handleFollow = () => {
    console.log("Follow/Unfollow button clicked");
  };

  return (
    <div className="aspect-square space-y-1.5">
      <div className="h-full relative rounded-sm overflow-hidden hover:cursor-pointer group">
        {audio.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/audio/cover/${audio.id}`}
            alt="track image"
            className="absolute inset-0 object-cover z-0 transition-opacity group-hover:opacity-50"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center transition-opacity group-hover:opacity-50">
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

        <button
          onClick={handlePlay}
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "p-5 rounded-full bg-background z-40 transition-opacity hover:opacity-75",
            "focus-visible:outline-none focus-visible:ring-2",
            isThisTrackPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
          aria-label={isThisTrackPlaying ? "Pause" : "Play"}
        >
          {isThisTrackPlaying ? (
            <PauseIcon
              size={35}
              className="fill-foreground stroke-foreground"
            />
          ) : (
            <PlayIcon size={35} className="fill-foreground stroke-foreground" />
          )}
        </button>

        <div
          className={cn(
            "absolute bottom-3 right-3 z-50 transition-opacity",
            isThisTrackPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="flex space-x-4 items-center">
            <button
              className="hover:cursor-pointer hover:opacity-50"
              onClick={() => toggleLikeMutation()}
              disabled={isPending}
              aria-pressed={hasLiked}
            >
              <HeartIcon
                size={16}
                className={cn(
                  "fill-foreground stroke-foreground",
                  hasLiked && "fill-red-500 stroke-red-500"
                )}
              />
            </button>

            <button
              className="hover:cursor-pointer hover:opacity-50"
              onClick={handleFollow}
            >
              <UserCheckIcon
                size={16}
                className="fill-foreground stroke-foreground"
              />
            </button>

            <TrackOptions audio={audio}>
              <Button
                size="sm"
                variant="ghost"
                className="hover:cursor-pointer"
              >
                <EllipsisIcon
                  size={14}
                  strokeWidth={2}
                  className="fill-foreground stroke-foreground"
                />
              </Button>
            </TrackOptions>
          </div>
        </div>
      </div>

      <div>
        <p className="flex gap-1 items-center">
          <HeartIcon
            className="fill-muted-foreground stroke-muted-foreground"
            size={16}
          />
          <span className="line-clamp-1 text-sm font-semibold capitalize hover:cursor-pointer hover:opacity-50">
            <Link href={`/${audio.user.displayUsername}/${audio.slug}`}>
              {audio.title}
            </Link>
          </span>
        </p>
        <p className="line-clamp-1 text-muted-foreground font-semibold text-sm tracking-wide capitalize">
          <UserTooltip user={audio.user}>
            <Link href="/username" className="hover:opacity-50">
              {audio.artist ?? "Unknown Artist"}
            </Link>
          </UserTooltip>
        </p>
      </div>
    </div>
  );
};

export default TrackCard2;
