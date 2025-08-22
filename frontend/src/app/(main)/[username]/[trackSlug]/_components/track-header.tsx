"use client";

import TrackVisualizer from "@/app/(main)/_components/track-visualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/audio-context";
import { randomGradient } from "@/lib/random-gradient";
import { TAudio } from "@/types/audio.type";
import { formatDistance } from "date-fns";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { H2 } from "shadcn-typography";

interface TrackHeaderProps {
  audio: TAudio;
}

const TrackHeader = ({ audio }: TrackHeaderProps) => {
  const [bgGradient] = useState(randomGradient());

  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isThisTrackPlaying =
    currentTrack?.audioFile.url === audio?.audioFile.url && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioFile.url === audio?.audioFile.url) {
      togglePlay();
    } else {
      playTrack(audio);
    }
  };

  return (
    <div
      className="h-[380px] py-7 px-10 flex space-x-10"
      style={{ background: bgGradient }}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <Button
              className="rounded-full size-18 bg-black text-white flex items-center justify-center"
              onClick={handlePlay}
            >
              {isThisTrackPlaying ? (
                <PauseIcon className="size-8 fill-background" />
              ) : (
                <PlayIcon className="size-8 fill-background" />
              )}

              <span className="sr-only">Play button</span>
            </Button>
            <div>
              <H2 className="border-none font-bold max-w-xl text-4xl bg-foreground text-background inline-block px-2">
                {audio?.title}
              </H2>
              <br />
              <h3 className="font-medium text-lg bg-foreground text-background inline-block px-2">
                {audio?.artist ?? "Unknown Artist"}
              </h3>
            </div>
          </div>
          <div className="space-y-1.5 text-end">
            <h5 className="font-medium text-muted-foreground">
              {formatDistance(new Date(audio?.createdAt as Date), new Date(), {
                addSuffix: true,
              })}
            </h5>
            <Badge className="px-2 py-1 bg-gray-200 rounded text-sm text-foreground">
              #{audio?.genre.name}
            </Badge>
          </div>
        </div>

        <div className="mb-12">
          <TrackVisualizer
            audio={audio}
            height={95}
            barGap={1}
            hoverOverlayColor="rgba(0,0,255,0.3)"
          />
        </div>
      </div>

      <div className="relative aspect-square rounded-md overflow-hidden">
        {audio.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio?.id}`}
            alt="music cover"
            className="object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
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
    </div>
  );
};

export default TrackHeader;
