"use client";

import TrackVisualizer from "@/app/(main)/_components/track-visualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/audio-context";
import { useAudioBySlug } from "@/hooks/tanstack/audio";
import { randomGradient } from "@/lib/random-gradient";
import { TAudio } from "@/types/audio.type";
import { formatDistance } from "date-fns";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { H2 } from "shadcn-typography";

interface TrackHeaderProps {
  slug: string;
}

const TrackHeader = ({ slug }: TrackHeaderProps) => {
  const { audio, isPending } = useAudioBySlug(slug);

  const [bgGradient, _setBgGradient] = useState(randomGradient());

  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isThisTrackPlaying =
    currentTrack?.audioFile.url === audio?.data?.audioFile.url && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.audioFile.url === audio?.data?.audioFile.url) {
      togglePlay();
    } else {
      playTrack(audio?.data as TAudio);
    }
  };

  if (isPending && slug) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

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
                {audio?.data?.title}
              </H2>
              <br />
              <h3 className="font-medium text-lg bg-foreground text-background inline-block px-2">
                {audio?.data?.user.name}
              </h3>
            </div>
          </div>
          <div className="space-y-1.5 text-end">
            <h5 className="font-medium text-muted-foreground">
              {formatDistance(
                new Date(audio?.data?.createdAt as Date),
                new Date(),
                {
                  addSuffix: true,
                }
              )}
            </h5>
            <Badge className="px-2 py-1 bg-gray-200 rounded text-sm text-foreground">
              #{audio?.data?.genre.name}
            </Badge>
          </div>
        </div>

        <div className="mb-12">
          <TrackVisualizer
            audio={audio?.data as TAudio}
            height={95}
            barGap={1}
            hoverOverlayColor="rgba(0,0,255,0.3)"
          />
        </div>
      </div>

      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image
          fill
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio?.data?.id}`}
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
