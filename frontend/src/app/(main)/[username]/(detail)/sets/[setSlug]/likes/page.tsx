import { getQueryClient } from "@/lib/query-client";
import { playlistKeys } from "@/lib/query-keys";
import { getPlaylistBySlug } from "@/server/playlist";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DetailUserPlaylistPage from "./_components/detail-playlist-likes-page";

interface PlaylistLikePageProps {
  params: Promise<{ username: string; trackSlug: string; setSlug: string }>;
}

const PlaylistLikePage = async ({ params }: PlaylistLikePageProps) => {
  const { setSlug } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: playlistKeys.detailBySlug(setSlug),
    queryFn: async () => getPlaylistBySlug(setSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailUserPlaylistPage playlistSlug={setSlug} />
    </HydrationBoundary>
  );
};

export default PlaylistLikePage;
