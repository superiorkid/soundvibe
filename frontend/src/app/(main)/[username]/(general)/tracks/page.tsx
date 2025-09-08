import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserTracks } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TracksPage from "./_components/tracks-page";

interface UserTracksPageProps {
  params: Promise<{ username: string }>;
}

const UserTracksPage = async ({ params }: UserTracksPageProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  const filters = { filter: "latest", username } as const;
  await queryClient.prefetchQuery({
    queryKey: userKeys.userTracks(filters),
    queryFn: async () => getUserTracks(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TracksPage username={username} />
    </HydrationBoundary>
  );
};

export default UserTracksPage;
