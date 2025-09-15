"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useUserTracks } from "@/hooks/tanstack/user";
import { Loader2Icon } from "lucide-react";

interface TracksPageProps {
  username: string;
}

const TracksPage = ({ username }: TracksPageProps) => {
  const { isError, isPending, tracks } = useUserTracks({
    filter: "latest",
    username,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center mt-6">
        <Loader2Icon size={25} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Something went wrong</p>
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
        <TrackCard
          key={index}
          audio={track}
          type="audio"
          allAudios={tracks.data}
          index={index}
        />
      ))}
    </div>
  );
};

export default TracksPage;
