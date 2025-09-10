"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import { TAudio } from "@/types/audio.type";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface TracksLikeByUserPageProps {
  username: string;
}

const TracksLikeByUserPage = ({ username }: TracksLikeByUserPageProps) => {
  const filter = { limit: 25, username, withPlaylist: true } as const;
  const { isPending, likedTracks } = useRecentLiked(filter);

  console.log(likedTracks);

  if (isPending) {
    return (
      <div className="h-[162px] flex items-center justify-center">
        <Loader2Icon size={30} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {likedTracks?.data?.recent.map((audio, index) => (
        <TrackCard key={index} audio={audio.audio as TAudio} type="audio" />
      ))}
    </div>
  );
};

export default TracksLikeByUserPage;
