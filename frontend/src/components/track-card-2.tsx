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
import UserTooltip from "./user-tooltip";

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
        <button
          onClick={handlePlay}
          className="p-5 rounded-full bg-background group-hover:absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer hover:opacity-75"
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

        <div className="group-hover:absolute bottom-3 right-3 z-50">
          <div className="flex space-x-4 items-center">
            <button
              className={cn("hover:cursor-pointer hover:opacity-50")}
              onClick={() => toggleLikeMutation()}
              disabled={isPending}
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
            <button>
              <EllipsisIcon size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {audio.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio.id}`}
            alt="track image"
            className="object-cover group-hover:opacity-50"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center group-hover:opacity-50">
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
      </div>
      <div>
        <p className="flex gap-1 items-center">
          <HeartIcon
            className="fill-muted-foreground stroke-muted-foreground"
            size={16}
          />
          <span className="line-clamp-1 text-sm font-semibold capitalize">
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
