import { FollowingFilterContextProvider } from "@/context/following-filter-context";
import { getQueryClient } from "@/lib/query-client";
import { followKeys } from "@/lib/query-keys";
import { getSession } from "@/server/auth";
import { getFollowing } from "@/server/follows";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import FollowingFilterInput from "./_components/following-filter-input";
import FollowingPage from "./_components/following-page";

const YourFollowingPage = async () => {
  const queryClient = getQueryClient();
  const session = await getSession();
  const userId = session?.user.id as string;

  await queryClient.prefetchQuery({
    queryKey: followKeys.getFollowingById({ userId }),
    queryFn: async () => getFollowing({ userId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FollowingFilterContextProvider>
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">
            Hear what the people you follow have posted:
          </h2>
          <div>
            <FollowingFilterInput />
          </div>
        </div>
        <div className="mt-6">
          <FollowingPage userId={userId} />
        </div>
      </FollowingFilterContextProvider>
    </HydrationBoundary>
  );
};

export default YourFollowingPage;
