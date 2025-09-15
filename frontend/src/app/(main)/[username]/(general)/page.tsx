import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserByUsername, getUserTracks } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PopularTracksPage from "./_components/popular-tracks-page";

interface PopularTracksProps {
  params: Promise<{ username: string }>;
}

const PopularTracks = async ({ params }: PopularTracksProps) => {
  const { username } = await params;

  // guard
  await getUserByUsername(username);

  const queryClient = getQueryClient();

  const filters = { filter: "popular", username } as const;
  await queryClient.prefetchQuery({
    queryKey: userKeys.userTracks(filters),
    queryFn: async () => getUserTracks(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PopularTracksPage username={username} />
    </HydrationBoundary>
  );
};

export default PopularTracks;
