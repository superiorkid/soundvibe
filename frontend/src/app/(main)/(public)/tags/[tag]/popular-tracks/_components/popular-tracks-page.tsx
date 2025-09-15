"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { Button } from "@/components/ui/button";
import { usePopularTracksByGenre } from "@/hooks/tanstack/genre";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface PopularTracksByTagProps {
  name: string;
}

const PopularTracksPage = ({ name }: PopularTracksByTagProps) => {
  const { isError, isPending, refetch, tracks } = usePopularTracksByGenre({
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

  if (!tracks?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
        <p className="text-base font-medium">No tracks found</p>
        <p className="text-sm text-muted-foreground">
          There are no popular tracks under{" "}
          <span className="font-semibold">{name}</span> yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tracks.data.map((track, index) => (
        <TrackCard
          key={track.id}
          audio={track}
          type="audio"
          allAudios={tracks.data}
          index={index}
        />
      ))}
    </div>
  );
};

export default PopularTracksPage;
