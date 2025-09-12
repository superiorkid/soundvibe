import { getQueryClient } from "@/lib/query-client";
import { genreKeys } from "@/lib/query-keys";
import { findPlaylistsByGenre } from "@/server/genre";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PlaylistPage from "./_components/playlist-page";

interface PlaylistByTagPageProps {
  params: Promise<{ tag: string }>;
}

const PlaylistByTagPage = async ({ params }: PlaylistByTagPageProps) => {
  const { tag } = await params;

  const queryClient = getQueryClient();

  const filter = { name: tag, limit: 10 } as const;
  await queryClient.prefetchQuery({
    queryKey: genreKeys.playlists(filter),
    queryFn: async () => findPlaylistsByGenre(filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaylistPage name={tag} />
    </HydrationBoundary>
  );
};

export default PlaylistByTagPage;
