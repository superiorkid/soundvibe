"use client";

import TrackVisualizer from "@/app/(main)/_components/track-visualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/audio-context";
import { randomGradient } from "@/lib/random-gradient";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { H2 } from "shadcn-typography";

const TrackHeader = () => {
  const [bgGradient, _setBgGradient] = useState(randomGradient());

  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const track = {
    trackArtist: "K391",
    trackTitle: "Summertime",
    audioSrc: "/music/Nito-Onna, Mangoo - Reason [NCS Release].mp3",
  };
  const isThisTrackPlaying =
    currentTrack?.audioSrc === track.audioSrc && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioSrc === track.audioSrc) {
      togglePlay();
    } else {
      playTrack(track);
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
                {track.trackTitle}
              </H2>
              <br />
              <h3 className="font-medium text-lg bg-foreground text-background inline-block px-2">
                {track.trackArtist}
              </h3>
            </div>
          </div>
          <div className="space-y-1.5 text-end">
            <h5 className="font-medium text-muted-foreground">4 years ago</h5>
            <Badge className="px-2 py-1 bg-gray-200 rounded text-sm text-foreground">
              # Deep House
            </Badge>
          </div>
        </div>

        <div className="mb-12">
          <TrackVisualizer
            audio={track}
            height={95}
            barGap={1}
            hoverOverlayColor="rgba(0,0,255,0.3)"
          />
        </div>
      </div>

      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image
          fill
          src="https://images.unsplash.com/photo-1723924995430-b74c76bbcdfd?q=80&w=880&auto=format&fit=crop"
          alt="music cover"
          className="object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
};

export default TrackHeader;
