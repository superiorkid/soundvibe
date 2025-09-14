import { Suspense } from "react";
import PlaylistFilterInput from "./_components/playlist-filter-input";
import PlaylistsDisplayFilter from "./_components/playlist-display-filter";
import { getQueryClient } from "@/lib/query-client";
import { playlistKeys } from "@/lib/query-keys";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";
import { getCurrentUserPlaylist } from "@/server/playlist";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import YourPlaylist from "./_components/your-playlist";

interface YourPlaylistPageProps {
  searchParams: Promise<{ "playlist-filter": string }>;
}

const YourPlaylistPage = async ({ searchParams }: YourPlaylistPageProps) => {
  const { ["playlist-filter"]: playlistFilter = "All" } = await searchParams;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: playlistKeys.allCurrentUser({
      filter: playlistFilter as PlaylistFilterEnum,
    }),
    queryFn: async () =>
      getCurrentUserPlaylist({ filter: playlistFilter as PlaylistFilterEnum }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">
            Hear your own playlists and playlists you&apos;ve liked:
          </h2>
          <div className="flex gap-4 items-center">
            <PlaylistFilterInput />
            <Suspense>
              <PlaylistsDisplayFilter />
            </Suspense>
          </div>
        </div>
        <div className="mt-6">
          <Suspense>
            <YourPlaylist />
          </Suspense>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default YourPlaylistPage;
