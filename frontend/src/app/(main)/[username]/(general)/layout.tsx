import React from "react";
import UserSpecificHeader from "../_components/user-specific-header";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { getUserByUsername } from "@/server/user";

interface UserSpecificLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

const UserSpecificLayout = async ({
  children,
  params,
}: UserSpecificLayoutProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userKeys.userByUsername(username),
      queryFn: async () => getUserByUsername(username),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <UserSpecificHeader username={username} />
        <div>tabs</div>
        <div>{children}</div>
      </div>
    </HydrationBoundary>
  );
};

export default UserSpecificLayout;
