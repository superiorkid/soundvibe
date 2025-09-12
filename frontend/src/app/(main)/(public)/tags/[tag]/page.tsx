import { getQueryClient } from "@/lib/query-client";
import { genreKeys } from "@/lib/query-keys";
import { findLatestTracksByGenre } from "@/server/genre";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import TagPage from "./_components/tag-page";

interface TagProps {
  params: Promise<{ tag: string }>;
}

const Tag = async ({ params }: TagProps) => {
  const { tag } = await params;

  const queryClient = getQueryClient();

  const filter = { name: tag, limit: 10 } as const;
  await queryClient.prefetchQuery({
    queryKey: genreKeys.latestTracks(filter),
    queryFn: async () => findLatestTracksByGenre(filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagPage name={tag} />
    </HydrationBoundary>
  );
};

export default Tag;
