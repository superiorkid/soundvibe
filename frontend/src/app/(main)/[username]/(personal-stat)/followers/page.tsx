import { getQueryClient } from "@/lib/query-client";
import { followKeys } from "@/lib/query-keys";
import { getFollowersByUsername } from "@/server/follows";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import UserFollowersPage from "./_components/user-followers-page";

interface FollowersPageProps {
  params: Promise<{ username: string }>;
}

const FollowersPage = async ({ params }: FollowersPageProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: followKeys.getFollowersByUsername(username),
    queryFn: async () => getFollowersByUsername(username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserFollowersPage username={username} />
    </HydrationBoundary>
  );
};

export default FollowersPage;
