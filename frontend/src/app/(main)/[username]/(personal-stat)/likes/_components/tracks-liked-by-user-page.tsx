"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import { TAudio, TRecentLike } from "@/types/audio.type";
import { Loader2Icon } from "lucide-react";
import React from "react";
import PlaylistsCard from "../../../(general)/sets/_components/playlists-card";
import { TPlaylist } from "@/types/playlist-type";
import { TLike } from "@/types/like.type";

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

  const isAudioLike = (item: TRecentLike): item is TLike & { audio: TAudio } =>
    item.type === "audio" && !!item.audio;

  const allAudios =
    likedTracks?.data?.recent?.filter(isAudioLike).map((item) => item.audio) ??
    [];

  return (
    <div className="space-y-6">
      {likedTracks?.data?.recent.map((item, index) => {
        if (isAudioLike(item)) {
          return (
            <TrackCard
              key={index}
              audio={item.audio}
              type="audio"
              allAudios={allAudios}
              index={allAudios.findIndex((a) => a.id === item.audio.id)}
            />
          );
        }

        if (item.type === "playlist" && item.playlist) {
          return <PlaylistsCard key={index} playlist={item.playlist} />;
        }

        return null;
      })}
    </div>
  );
};
export default TracksLikeByUserPage;
