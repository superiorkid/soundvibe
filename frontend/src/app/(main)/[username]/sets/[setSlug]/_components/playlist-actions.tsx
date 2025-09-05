"use client";

import { Button } from "@/components/ui/button";
import { useLikePlaylist } from "@/hooks/tanstack/playlist";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TPlaylist } from "@/types/playlist-type";
import {
  CopyIcon,
  HeartIcon,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";

interface PlaylistActionsProps {
  playlist: TPlaylist;
}

const PlaylistActions = ({ playlist }: PlaylistActionsProps) => {
  const { data: session } = authClient.useSession();
  const { hasLikedPlaylist, isPending, likePlaylistToggle } = useLikePlaylist({
    playlist,
    userId: session?.user.id as string,
  });

  return (
    <div className="space-x-5 items-center pt-4 pb-8">
      <Button
        size="sm"
        variant="secondary"
        className="hover:cursor-pointer"
        disabled={isPending}
        onClick={() => likePlaylistToggle()}
      >
        <HeartIcon
          strokeWidth={2}
          size={16}
          className={cn(
            "fill-foreground stroke-foreground",
            hasLikedPlaylist && "fill-rose-500 stroke-rose-500"
          )}
        />
      </Button>
      <Button size="sm" variant="secondary">
        <UploadIcon strokeWidth={2} size={16} />
      </Button>
      <Button size="sm" variant="secondary">
        <CopyIcon strokeWidth={2} size={16} />
      </Button>
      <Button size="sm" variant="secondary">
        <PencilIcon strokeWidth={2} size={16} />
      </Button>
      <Button size="sm" variant="secondary">
        <Trash2Icon strokeWidth={2} size={16} />
      </Button>
    </div>
  );
};

export default PlaylistActions;
