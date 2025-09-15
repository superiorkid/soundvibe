"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useUserReposts } from "@/hooks/tanstack/user";
import { TAudio } from "@/types/audio.type";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface RepostsPageProps {
  username: string;
}

const RepostsPage = ({ username }: RepostsPageProps) => {
  const { isError, isPending, tracks } = useUserReposts(username);

  if (isPending) {
    return (
      <div className="flex justify-center items-center mt-6">
        <Loader2Icon size={25} className="animate-spin" />
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
        <p className="text-lg">
          No reposts found yet. Be the first to share some music!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tracks.data.map((track, index) => (
        <TrackCard
          key={index}
          audio={track.audio as TAudio}
          type="repost"
          whosReposted={track.user}
          allAudios={tracks.data?.map((a) => a.audio as TAudio)}
          index={index}
        />
      ))}
    </div>
  );
};

export default RepostsPage;
