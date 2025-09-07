import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { getUsersWhoLikedAudio } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UsersLikes from "./_components/users-likes";

interface TrackLikesPageProps {
  params: Promise<{ username: string; trackSlug: string }>;
}

const TrackLikesPage = async ({ params }: TrackLikesPageProps) => {
  const { trackSlug } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: audioKeys.usersLikesAudio({ limit: 25, slug: trackSlug }),
    queryFn: async () => getUsersWhoLikedAudio({ limit: 25, slug: trackSlug }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersLikes trackSlug={trackSlug} />
    </HydrationBoundary>
  );
};

export default TrackLikesPage;
