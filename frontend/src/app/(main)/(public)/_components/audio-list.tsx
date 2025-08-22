"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { buttonVariants } from "@/components/ui/button";
import { useAudio } from "@/hooks/tanstack/audio";
import { cn } from "@/lib/utils";
import { Loader2Icon, MusicIcon } from "lucide-react";
import Link from "next/link";

const AudioList = () => {
  const { audios, isPending } = useAudio();

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="space-y-4 flex justify-center flex-col items-center">
          <Loader2Icon className="size-8 animate-spin" />
          <p className="text-muted-foreground">Loading tracks...</p>
        </div>
      </div>
    );
  }

  if (!audios?.data || audios.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <MusicIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
        <p className="text-muted-foreground max-w-md mb-4">
          It looks like there are no audio tracks available yet. Be the first to
          upload something amazing!
        </p>
        <Link
          href="/upload"
          className={cn(buttonVariants({ size: "lg", className: "text-base" }))}
        >
          Upload Your First Track
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {audios.data.map((audio, index) => (
        <TrackCard key={audio.id || index} audio={audio} />
      ))}
    </div>
  );
};

export default AudioList;
