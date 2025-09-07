"use client";

import CopyToClipboard from "@/app/(main)/_components/copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { useLikePlaylist } from "@/hooks/tanstack/playlist";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TPlaylist } from "@/types/playlist-type";
import { CheckIcon, CopyIcon, HeartIcon, UploadIcon } from "lucide-react";
import DeletePlaylistDialog from "./delete-playlist-dialog";
import EditPlaylistDialog from "./edit-playlist-dialog";

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
      <CopyToClipboard
        text={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${playlist.user.displayUsername}/sets/${playlist.slug}`}
      >
        {({ copied, onClick }) => (
          <Button
            size="sm"
            variant="secondary"
            onClick={onClick}
            className="hover:cursor-pointer"
          >
            {copied ? (
              <CheckIcon strokeWidth={2} size={16} />
            ) : (
              <CopyIcon strokeWidth={2} size={16} />
            )}
          </Button>
        )}
      </CopyToClipboard>

      {session?.user.id === playlist.userId && (
        <>
          <EditPlaylistDialog playlist={playlist} />
          <DeletePlaylistDialog playlistId={playlist.id} />
        </>
      )}
    </div>
  );
};

export default PlaylistActions;
