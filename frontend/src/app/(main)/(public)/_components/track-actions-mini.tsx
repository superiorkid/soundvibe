"use client";

import TrackOptions from "@/components/track-options";
import { Button } from "@/components/ui/button";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { EllipsisIcon, HeartIcon } from "lucide-react";

interface TrackActionsMiniProps {
  audio: TAudio;
}

const TrackActionsMini = ({ audio }: TrackActionsMiniProps) => {
  const { data: session } = authClient.useSession();
  const { hasLiked, toggleLikeMutation } = useLike(
    audio,
    session?.user.id as string
  );

  return (
    <div
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center transition-opacity duration-200 group-hover:opacity-100",
        "data-[menu-open=true]:opacity-100",
        "opacity-0"
      )}
      data-menu-open={undefined}
    >
      <Button
        size="sm"
        variant="secondary"
        className="hover:cursor-pointer"
        onClick={() => toggleLikeMutation()}
      >
        <HeartIcon
          size={14}
          className={cn(
            "fill-foreground stroke-foreground",
            hasLiked && "fill-red-500 stroke-red-500"
          )}
        />
      </Button>
      <TrackOptions audio={audio}>
        <Button size="sm" variant="secondary" className="hover:cursor-pointer">
          <EllipsisIcon
            size={14}
            strokeWidth={2}
            className="fill-foreground stroke-foreground"
          />
        </Button>
      </TrackOptions>
    </div>
  );
};

export default TrackActionsMini;
