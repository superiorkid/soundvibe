import PageTitle from "@/components/page-title";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getQueryClient } from "@/lib/query-client";
import { findAllAudio } from "@/server/audio";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AudioList from "../_components/audio-list";
import { audioKeys } from "@/lib/query-keys";

const FeedPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: audioKeys.all,
    queryFn: async () => findAllAudio(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageTitle className="2xl:text-2xl font-semibold text-xl tracking-tight">
            Hear the latest posts from the people you&apos;re following
          </PageTitle>
          <div className="flex gap-1 items-center">
            <Label className="text-base font-medium text-muted-foreground">
              Reposts
            </Label>
            <Switch />
          </div>
        </div>

        <AudioList />
      </div>
    </HydrationBoundary>
  );
};

export default FeedPage;
