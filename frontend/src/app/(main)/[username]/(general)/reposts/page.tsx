import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserReposts } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import RepostsPage from "./_components/reposts-page";

interface RepostsPageProps {
  params: Promise<{ username: string }>;
}

const UserRepostsPage = async ({ params }: RepostsPageProps) => {
  const { username } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.userRepostsTracks(username),
    queryFn: async () => getUserReposts(username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RepostsPage username={username} />
    </HydrationBoundary>
  );
};

export default UserRepostsPage;
