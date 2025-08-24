import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { findOneBySlug } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import TrackHeaderMini from "./_components/track-header-mini";

interface TrackStatsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string; trackSlug: string }>;
}

const TrackStatsLayout = async ({
  children,
  params,
}: TrackStatsLayoutProps) => {
  const { trackSlug } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: audioKeys.detailBySlug(trackSlug),
    queryFn: async () => findOneBySlug(trackSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-6 space-y-9">
        <TrackHeaderMini trackSlug={trackSlug} />
        {children}
      </div>
    </HydrationBoundary>
  );
};

export default TrackStatsLayout;
