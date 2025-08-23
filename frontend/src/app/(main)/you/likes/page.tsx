import { Input } from "@/components/ui/input";
import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { recentLike } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import TrackViewControl from "./_components/track-view-control";
import RecentLikedTracks from "./_components/recent-liked-tracks";

const YourLikesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: audioKeys.recentLiked(25),
    queryFn: async () => recentLike(25),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">
          Hear the tracks you&quot;ve liked:
        </h2>
        <div className="flex gap-6 items-center">
          <Suspense>
            <TrackViewControl />
          </Suspense>
          <Input
            placeholder="Filter"
            className="h-8 rounded-sm border shadow-none w-[271px]"
          />
        </div>
      </div>
      <Suspense>
        <RecentLikedTracks />
      </Suspense>
    </HydrationBoundary>
  );
};

export default YourLikesPage;
