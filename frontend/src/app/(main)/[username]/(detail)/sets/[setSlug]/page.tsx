import { getQueryClient } from "@/lib/query-client";
import DetailPlaylist from "./_components/detail-playlist";
import { playlistKeys } from "@/lib/query-keys";
import { getPlaylistBySlug } from "@/server/playlist";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface DetailUserPlaylistPageProps {
  params: Promise<{ username: string; trackSlug: string; setSlug: string }>;
}

const DetailUserPlaylistPage = async ({
  params,
}: DetailUserPlaylistPageProps) => {
  const { setSlug } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: playlistKeys.detailBySlug(setSlug),
    queryFn: async () => getPlaylistBySlug(setSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailPlaylist playlistSlug={setSlug} />
    </HydrationBoundary>
  );
};

export default DetailUserPlaylistPage;
