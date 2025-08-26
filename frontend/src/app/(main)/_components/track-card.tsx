"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAudio } from "@/context/audio-context";
import { TAudio } from "@/types/audio.type";
import { formatDistance } from "date-fns";
import { PauseIcon, PlayIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PlayerActions } from "./player-actions";
import UserTooltip from "@/components/user-tooltip";

const TrackVisualizer = dynamic(() => import("./track-visualizer"), {
  ssr: false,
});

interface TrackCardProps {
  audio: TAudio;
}

const TrackCard = ({ audio }: TrackCardProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isThisTrackPlaying =
    currentTrack?.audioFile.url === audio.audioFile.url && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioFile.url === audio.audioFile.url) {
      togglePlay();
    } else {
      playTrack(audio);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2 items-center">
        <Avatar className="size-8">
          <AvatarImage
            src={audio.user.image ?? "https://github.com/shadcn.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Label className="font-medium">
          <UserTooltip user={audio.user}>
            <span className="hover:cursor-pointer hover:opacity-50">
              {audio.user.name}
            </span>
          </UserTooltip>
          <span className="text-muted-foreground">
            Posted a track{" "}
            {formatDistance(new Date(audio.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </Label>
      </div>
      <div className="flex space-x-5">
        <div className="relative size-38 rounded-lg overflow-hidden">
          {audio.coverFile ? (
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio.id}`}
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
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <button
                  onClick={handlePlay}
                  className="p-2.5 rounded-full border boder-rose-400 bg-foreground text-background"
                >
                  {isThisTrackPlaying ? (
                    <PauseIcon
                      size={20}
                      className="fill-background stroke-background"
                    />
                  ) : (
                    <PlayIcon
                      size={20}
                      className="fill-background stroke-background"
                    />
                  )}
                </button>
              </div>
              <div>
                <UserTooltip user={audio.user}>
                  <h2 className="font-semibold text-sm text-muted-foreground capitalize hover:opacity-50">
                    <Link href="/username">
                      {audio.artist ?? "Unknown Artist"}
                    </Link>
                  </h2>
                </UserTooltip>

                <p className="font-semibold tracking-tight capitalize hover:opacity-50">
                  <Link href={`/${audio.user.displayUsername}/${audio.slug}`}>
                    {audio.title}
                  </Link>
                </p>
              </div>
            </div>
            <div>
              <Badge variant="secondary" className="tracking-wide text-sm">
                #{audio.genre.name}
              </Badge>
            </div>
          </div>
          <TrackVisualizer audio={audio} />
          <PlayerActions showComment={isThisTrackPlaying} audio={audio} />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
