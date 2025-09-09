import AppFooter from "@/app/_components/app-footer";
import { getQueryClient } from "@/lib/query-client";
import { audioKeys, userKeys } from "@/lib/query-keys";
import { recentLike } from "@/server/audio";
import { getRecentUserComments, getUserByUsername } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import LikedTracksPanel from "../../(public)/_components/liked-tracks-panel";
import LatestCommentPanel from "./_components/latest-comment-panel";
import UserContentTabs from "./_components/user-content-tabs";
import UserSpecificHeader from "./_components/user-specific-header";
import UserStatPanel from "./_components/user-stat-panel";

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
    queryClient.prefetchQuery({
      queryKey: audioKeys.recentLiked({ username, limit: 3 }),
      queryFn: async () => recentLike({ username, limit: 3 }),
    }),
    queryClient.prefetchQuery({
      queryKey: userKeys.recentComments({ limit: 3, username }),
      queryFn: async () => getRecentUserComments({ limit: 3, username }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="space-y-3">
          <UserSpecificHeader username={username} />
          <UserContentTabs username={username} />
        </div>
        <div className="flex gap-12">
          <div className="flex-1">{children}</div>

          <div className="w-[344px] space-y-8">
            <UserStatPanel username={username} />
            <LikedTracksPanel username={username} />

            {/* <div>TODO: followers summary panel</div>
            <div>TODO: followeing panel</div> */}
            <LatestCommentPanel usernameProps={username} />

            <AppFooter className="text-sm text-gray-700">
              <AppFooter.Brand name="SoundVibe" />
              <AppFooter.Language label="English (US)" />
            </AppFooter>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default UserSpecificLayout;
