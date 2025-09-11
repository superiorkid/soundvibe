import { getQueryClient } from "@/lib/query-client";
import { followKeys } from "@/lib/query-keys";
import { getFollowingByUsername } from "@/server/follows";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import UserFollowingPage from "./_components/user-following-page";

interface FollowingPageProps {
  params: Promise<{ username: string }>;
}

const FollowingPage = async ({ params }: FollowingPageProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: followKeys.getFollowingByUsername({ username }),
    queryFn: async () => getFollowingByUsername({ username }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserFollowingPage username={username} />
    </HydrationBoundary>
  );
};

export default FollowingPage;
