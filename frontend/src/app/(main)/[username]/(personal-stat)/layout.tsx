import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserByUsername } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import PersonalStatHeader from "./_components/personal-stat-header";
import PersonalStatTabs from "./_components/personal-stat-tabs";

interface PersonalStatLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

const PersonalStatLayout = async ({
  children,
  params,
}: PersonalStatLayoutProps) => {
  const { username } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.userByUsername(username),
    queryFn: async () => getUserByUsername(username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PersonalStatHeader username={username} />
      <PersonalStatTabs />
      <div className="mt-2">{children}</div>
    </HydrationBoundary>
  );
};

export default PersonalStatLayout;
