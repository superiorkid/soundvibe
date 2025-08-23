"use client";

import { buttonVariants } from "@/components/ui/button";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import TrackCardMini from "./track-card-mini";
import { TAudio } from "@/types/audio.type";

const LikedTracksPanel = () => {
  const { likedTracks, isPending } = useRecentLiked(3);
  const total = likedTracks?.data?.total || 0;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!likedTracks?.data?.recent?.length) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">0 likes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          You haven’t liked any tracks yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">
          {total} like{total > 1 && "s"}
        </h1>
        <Link
          href="/you/likes"
          className={cn(
            buttonVariants({
              className: "text-xs text-muted-foreground tracking-wide",
              variant: "ghost",
              size: "sm",
            })
          )}
        >
          view all
        </Link>
      </div>

      <div className="space-y-4">
        {likedTracks.data.recent.map((track, index) => (
          <TrackCardMini key={index} audio={track.audio as TAudio} />
        ))}
      </div>
    </div>
  );
};

export default LikedTracksPanel;
