import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { recentLike } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import TracksLikeByUserPage from "./_components/tracks-liked-by-user-page";

interface UserLikePageProps {
  params: Promise<{ username: string }>;
}

const UserLikePage = async ({ params }: UserLikePageProps) => {
  const { username } = await params;
  const queryClient = getQueryClient();

  const filter = { limit: 25, username, withPlaylist: true } as const;
  await queryClient.prefetchQuery({
    queryKey: audioKeys.recentLiked(filter),
    queryFn: async () => recentLike(filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-between items-center">
        <h3 className="text-muted-foreground text-sm">
          Hear the tracks Moh. Ilhamuddin has liked
        </h3>
        <Button variant="secondary" size="sm">
          <UploadIcon size={16} strokeWidth={2} className="mr-1" />
          Share
        </Button>
      </div>
      <div className="mt-6">
        <TracksLikeByUserPage username={username} />
      </div>
    </HydrationBoundary>
  );
};

export default UserLikePage;
