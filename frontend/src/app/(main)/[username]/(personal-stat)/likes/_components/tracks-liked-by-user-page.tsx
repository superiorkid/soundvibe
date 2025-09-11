"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import { TAudio, TRecentLike } from "@/types/audio.type";
import { Loader2Icon } from "lucide-react";
import React from "react";
import PlaylistsCard from "../../../(general)/sets/_components/playlists-card";
import { TPlaylist } from "@/types/playlist-type";

interface TracksLikeByUserPageProps {
  username: string;
}

const TracksLikeByUserPage = ({ username }: TracksLikeByUserPageProps) => {
  const filter = { limit: 25, username, withPlaylist: true } as const;
  const { isPending, likedTracks } = useRecentLiked<TRecentLike[]>(filter);

  if (isPending) {
    return (
      <div className="h-[162px] flex items-center justify-center">
        <Loader2Icon size={30} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {likedTracks?.data?.recent.map((item, index) => {
        if (item.type === "audio") {
          return (
            <TrackCard key={index} audio={item.audio as TAudio} type="audio" />
          );
        }

        if (item.type === "playlist") {
          return (
            <PlaylistsCard key={index} playlist={item.playlist as TPlaylist} />
          );
        }
      })}
    </div>
  );
};

export default TracksLikeByUserPage;
