import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getRecentUserComments } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import CommentsPage from "./_components/comments-page";

interface CommnetsPageProps {
  params: Promise<{ username: string }>;
}

const CommnetsPage = async ({ params }: CommnetsPageProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  const filter = { limit: 25, username } as const;
  await queryClient.prefetchQuery({
    queryKey: userKeys.recentComments(filter),
    queryFn: async () => getRecentUserComments(filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentsPage username={username} />
    </HydrationBoundary>
  );
};

export default CommnetsPage;
