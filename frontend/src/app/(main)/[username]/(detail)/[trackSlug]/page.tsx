import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { findOneBySlug } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DetailTrack from "./_components/detail-track";

interface DetailTrackPageProps {
  params: Promise<{ username: string; trackSlug: string }>;
}

const DetailTrackPage = async ({ params }: DetailTrackPageProps) => {
  const { trackSlug } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: audioKeys.detailBySlug(trackSlug),
    queryFn: async () => findOneBySlug(trackSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailTrack slug={trackSlug} />
    </HydrationBoundary>
  );
};

export default DetailTrackPage;
