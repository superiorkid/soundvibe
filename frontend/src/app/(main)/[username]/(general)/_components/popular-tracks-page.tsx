"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useUserTracks } from "@/hooks/tanstack/user";
import { Loader2Icon } from "lucide-react";

interface PopularTracksPageProps {
  username: string;
}

const PopularTracksPage = ({ username }: PopularTracksPageProps) => {
  const { isError, isPending, tracks } = useUserTracks({
    filter: "popular",
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
        <p className="text-lg">No popular tracks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tracks.data.map((track, index) => (
        <TrackCard key={index} audio={track} type="audio" />
      ))}
    </div>
  );
};

export default PopularTracksPage;
