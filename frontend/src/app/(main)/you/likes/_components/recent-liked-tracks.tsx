"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import TrackCard2 from "@/components/track-card-2";
import { useLikesFilter } from "@/context/likes-filter-context";
import { ContentDisplayEnum } from "@/enums/content-display-enum";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import { TAudio } from "@/types/audio.type";
import { parseAsStringEnum, useQueryState } from "nuqs";

const RecentLikedTracks = () => {
  const [contentDisplay] = useQueryState(
    "display",
    parseAsStringEnum<ContentDisplayEnum>(
      Object.values(ContentDisplayEnum)
    ).withDefault(ContentDisplayEnum.grid)
  );
  const { debouncedQuery } = useLikesFilter();

  const { isPending, likedTracks } = useRecentLiked({
    limit: 25,
    query: debouncedQuery ?? "",
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const recent = likedTracks?.data?.recent ?? [];

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground">
        <p className="text-lg font-medium">No liked tracks found</p>
        <p className="text-sm">
          {debouncedQuery
            ? "Try adjusting your search query."
            : "Start liking some tracks to see them here!"}
        </p>
      </div>
    );
  }

  if (contentDisplay === ContentDisplayEnum.grid) {
    return (
      <div className="mt-6 grid grid-cols-6 gap-x-4 gap-y-6">
        {recent.map((track, index) => (
          <TrackCard2 key={index} audio={track.audio as TAudio} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {recent.map((track, index) => (
        <TrackCard
          key={index}
          audio={track.audio as TAudio}
          showActionText={false}
        />
      ))}
    </div>
  );
};

export default RecentLikedTracks;
