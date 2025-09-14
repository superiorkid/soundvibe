"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { buttonVariants } from "@/components/ui/button";
import { useInfiniteAudios } from "@/hooks/tanstack/audio";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { Loader2Icon, MusicIcon } from "lucide-react";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AudioList = () => {
  const [showRepost] = useQueryState(
    "showRepost",
    parseAsBoolean.withDefault(true)
  );

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteAudios({
      showRepost,
      limit: 6,
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // flatten pages into single array
  const audios = data?.pages.flatMap((page) => page.data) ?? [];

  if (audios.length === 0) {
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
      {audios.map((audio, index) => {
        const isLast = index === audios.length - 1;
        return (
          <div key={audio?.id || index} ref={isLast ? ref : undefined}>
            <TrackCard
              audio={audio?.audio as TAudio}
              type={audio?.type}
              repostedAt={audio?.createdAt}
            />
          </div>
        );
      })}

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default AudioList;
