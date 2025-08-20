import PageTitle from "@/components/page-title";
import { getQueryClient } from "@/lib/query-client";
import { findAllAudio } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AudioList from "./_components/audio-list";

const DiscoverPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["audio"],
    queryFn: async () => findAllAudio(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <PageTitle className="2xl:text-2xl font-semibold text-xl">
          Discover Tracks and Playlist
        </PageTitle>

        <AudioList />
      </div>
    </HydrationBoundary>
  );
};

export default DiscoverPage;
