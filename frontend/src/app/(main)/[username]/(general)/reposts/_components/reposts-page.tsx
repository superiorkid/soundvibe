"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useUserReposts } from "@/hooks/tanstack/user";
import { TAudio } from "@/types/audio.type";
import React from "react";

interface RepostsPageProps {
  username: string;
}

const RepostsPage = ({ username }: RepostsPageProps) => {
  const { isError, isPending, tracks } = useUserReposts(username);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Something went wront</p>
      </div>
    );
  }

  if (!tracks?.data || tracks.data.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">No tracks uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tracks.data.map((track, index) => (
        <TrackCard key={index} audio={track.audio as TAudio} type="repost" />
      ))}
    </div>
  );
};

export default RepostsPage;
