import PageTitle from "@/components/page-title";
import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { findAllAudio } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import AudioList from "../_components/audio-list";
import RepostToggleSwitcher from "./_components/repost-toggle-switcher";

interface FeedPageProps {
  searchParams: Promise<{ showRepost?: string }>;
}

const FeedPage = async ({ searchParams }: FeedPageProps) => {
  const params = await searchParams;
  const showRepost =
    params.showRepost === undefined ? true : params.showRepost !== "false";

  const queryClient = getQueryClient();

  const filter = { showRepost, limit: 6 } as const;
  await queryClient.prefetchInfiniteQuery({
    queryKey: audioKeys.audioWithRepost(filter),
    queryFn: async ({ pageParam = 1 }) =>
      findAllAudio({ ...filter, page: pageParam }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageTitle className="2xl:text-2xl font-semibold text-xl tracking-tight">
            Hear the latest posts from the people you&apos;re following
          </PageTitle>
          <Suspense>
            <RepostToggleSwitcher />
          </Suspense>
        </div>

        <AudioList />
      </div>
    </HydrationBoundary>
  );
};

export default FeedPage;
