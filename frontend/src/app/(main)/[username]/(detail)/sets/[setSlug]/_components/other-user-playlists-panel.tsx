"use client";

import { buttonVariants } from "@/components/ui/button";
import { useOtherPlaylistsByUserId } from "@/hooks/tanstack/playlist";
import { cn } from "@/lib/utils";
import { RefreshCcwIcon } from "lucide-react";
import Link from "next/link";
import PlaylistCardSecondary from "./playlist-card-secondary";

interface OtherUserPlaylistPanelProps {
  userId: string;
  excludedId: string;
  username: string;
}

const OtherUserPlaylistPanel = ({
  userId,
  excludedId,
  username,
}: OtherUserPlaylistPanelProps) => {
  const { isError, isPending, playlists, refetch } = useOtherPlaylistsByUserId({
    excludedId,
    userId,
    limit: 3,
  });

  const items = playlists?.data || [];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold uppercase text-xs text-muted-foreground">
          playlists from this user
        </h2>

        {items.length > 0 && (
          <Link
            href={`/${username}/sets`}
            className={cn(
              buttonVariants({
                className:
                  "text-xs text-muted-foreground tracking-wide hover:text-foreground",
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            view all
          </Link>
        )}
      </div>

      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="bg-muted rounded-md size-12" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-3 w-1/3 rounded" />
                <div className="bg-muted h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <p>Failed to load playlists</p>
          <button
            onClick={() => refetch()}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-1"
            )}
          >
            <RefreshCcwIcon size={14} />
            Retry
          </button>
        </div>
      )}

      {!isPending && !isError && items.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">
          No other playlists yet.
        </p>
      )}

      {!isPending && !isError && items.length > 0 && (
        <div className="space-y-4">
          {items.map((playlist) => (
            <PlaylistCardSecondary key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OtherUserPlaylistPanel;
