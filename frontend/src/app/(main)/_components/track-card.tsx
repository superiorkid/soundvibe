"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAudio } from "@/context/audio-context";
import { TTrack } from "@/types/track.type";
import { PauseIcon, PlayIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PlayerActions } from "./player-actions";

const TrackVisualizer = dynamic(() => import("./track-visualizer"), {
  ssr: false,
});

interface TrackCardProps {
  audio: TTrack;
}

const TrackCard = ({ audio }: TrackCardProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isThisTrackPlaying =
    currentTrack?.audioSrc === audio.audioSrc && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioSrc === audio.audioSrc) {
      togglePlay();
    } else {
      playTrack(audio);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2 items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Label className="font-medium">
          {audio.trackArtist}{" "}
          <span className="text-muted-foreground">
            Posted a track 5 minutes ago
          </span>
        </Label>
      </div>
      <div className="flex space-x-5">
        <div className="relative size-38 rounded-lg overflow-hidden">
          <Image
            fill
            src="https://images.unsplash.com/photo-1723961617032-ef69c454cb31?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="track image"
            className="object-cover"
            loading="lazy"
            decoding="async"
          />
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
                    <PauseIcon size={20} />
                  ) : (
                    <PlayIcon size={20} />
                  )}
                </button>
              </div>
              <div className="-space-y-0.5">
                <h2 className="font-semibold text-muted-foreground">
                  <Link href="/username">{audio.trackArtist}</Link>
                </h2>
                <p className="font-semibold tracking-tight">
                  <Link href="/username/track-title">{audio.trackTitle}</Link>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-sm space-y-0.5">
              <span className="font-medium text-muted-foreground">
                8 years ago
              </span>
              <Badge variant="secondary" className="tracking-wide">
                #Electronic
              </Badge>
            </div>
          </div>
          <TrackVisualizer audio={audio} />
          <PlayerActions showComment={isThisTrackPlaying} />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
