"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import TrackCard2 from "@/components/track-card-2";
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

  const { isPending, likedTracks } = useRecentLiked(25);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (contentDisplay === ContentDisplayEnum.grid) {
    return (
      <div className="mt-6 grid grid-cols-6 gap-x-4 gap-y-6">
        {likedTracks?.data?.recent.map((track, index) => (
          <TrackCard2 key={index} audio={track.audio as TAudio} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {likedTracks?.data?.recent.map((track, index) => (
        <TrackCard key={index} audio={track.audio as TAudio} />
      ))}
    </div>
  );
};

export default RecentLikedTracks;
