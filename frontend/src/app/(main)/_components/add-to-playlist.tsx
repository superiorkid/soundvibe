"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserPlaylist } from "@/hooks/tanstack/playlist";
import { AlertCircleIcon, MusicIcon, RefreshCwIcon } from "lucide-react";
import PlaylistCardMini from "./playlist-card-mini";

interface AddToPlaylistProps {
  audioId: string;
}

const AddToPlaylist = ({ audioId }: AddToPlaylistProps) => {
  const { playlists, isError, isPending, checkIfAudioExists } =
    useCurrentUserPlaylist();

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-12 bg-muted rounded-md"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
            </div>
            <div className="h-8 w-28 bg-muted rounded-sm"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircleIcon className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load playlists</h3>
        <p className="text-muted-foreground mb-2">
          sSomething went wrong while loading your playlists.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Please try again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Input
        placeholder="Filter playlist"
        className="rounded-none border-primary h-8 mb-4"
        disabled={(playlists?.data || []).length < 1}
      />

      {playlists && (playlists.data || []).length > 0 ? (
        <div className="space-y-4 mt-4">
          {(playlists.data || []).map((playlist, index) => {
            const audioExist = checkIfAudioExists(playlist.id, audioId);
            return (
              <PlaylistCardMini
                key={index}
                playlist={playlist}
                isAudioExistInPlaylist={audioExist || false}
                audioId={audioId}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MusicIcon className="h-16 w-16 text-muted-foreground/60 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven&apos;t created any playlists. Create your first playlist
            to start organizing your favorite songs.
          </p>
        </div>
      )}
    </div>
  );
};
export default AddToPlaylist;
