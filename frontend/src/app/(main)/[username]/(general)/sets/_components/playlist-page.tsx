"use client";

import { useUserPlaylist } from "@/hooks/tanstack/user";
import { Loader2Icon } from "lucide-react";
import PlaylistsCard from "./playlists-card";

interface PlaylistPageProps {
  username: string;
}

const PlaylistPage = ({ username }: PlaylistPageProps) => {
  const { isError, isPending, playlists } = useUserPlaylist(username);

  if (isPending) {
    return (
      <div className="flex justify-center items-center mt-6">
        <Loader2Icon size={25} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-6 text-red-600">
        <p>Oops, something went wrong while loading your playlists.</p>
      </div>
    );
  }

  if (!playlists?.data || playlists.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-6 text-muted-foreground">
        <p className="text-lg">
          No playlists found. Create a new playlist to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {playlists.data.map((playlist, index) => (
        <PlaylistsCard key={index} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistPage;
