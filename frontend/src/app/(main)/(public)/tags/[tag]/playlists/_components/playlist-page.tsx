"use client";

import PlaylistsCard from "@/app/(main)/[username]/(general)/sets/_components/playlists-card";
import { Button } from "@/components/ui/button";
import { usePlaylistsByGenre } from "@/hooks/tanstack/genre";
import { Loader2Icon } from "lucide-react";

interface PlaylistPagePorps {
  name: string;
}

const PlaylistPage = ({ name }: PlaylistPagePorps) => {
  const { isError, isPending, refetch, playlists } = usePlaylistsByGenre({
    name,
    limit: 10,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2Icon className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Failed to load tracks for{" "}
          <span className="font-semibold">{name}</span>.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!playlists?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
        <p className="text-base font-medium">No tracks found</p>
        <p className="text-sm text-muted-foreground">
          There are no playlists under{" "}
          <span className="font-semibold">{name}</span> yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {playlists.data.map((playlist) => (
        <PlaylistsCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistPage;
