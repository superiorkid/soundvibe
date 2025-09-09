import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserPlaylists } from "@/server/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import PlaylistPage from "./_components/playlist-page";

interface UserPlaylistPageProps {
  params: Promise<{ username: string }>;
}

const UserPlaylistPage = async ({ params }: UserPlaylistPageProps) => {
  const { username } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.userPlaylists(username),
    queryFn: async () => getUserPlaylists(username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaylistPage username={username} />
    </HydrationBoundary>
  );
};

export default UserPlaylistPage;
