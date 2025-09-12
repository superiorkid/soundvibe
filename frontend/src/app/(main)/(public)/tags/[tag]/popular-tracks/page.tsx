import { getQueryClient } from "@/lib/query-client";
import { genreKeys } from "@/lib/query-keys";
import { findPopularTracksByGenre } from "@/server/genre";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PopularTracksPage from "./_components/popular-tracks-page";

interface PopularTracksByTagProps {
  params: Promise<{ tag: string }>;
}

const PopularTracksByTag = async ({ params }: PopularTracksByTagProps) => {
  const { tag } = await params;

  const queryClient = getQueryClient();

  const filter = { name: tag, limit: 10 } as const;
  await queryClient.prefetchQuery({
    queryKey: genreKeys.popularTracks(filter),
    queryFn: async () => findPopularTracksByGenre(filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PopularTracksPage name={tag} />
    </HydrationBoundary>
  );
};

export default PopularTracksByTag;
