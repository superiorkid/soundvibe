"use client";

import { PlayerActions } from "@/app/(main)/_components/player-actions";
import { Button } from "@/components/ui/button";
import { useAudioBySlug } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { AlertCircleIcon, MusicIcon } from "lucide-react";
import { Suspense } from "react";
import Comments from "./comments";
import CommentsEmpty from "./comments-empty";
import FanRankPanel from "./fan-rank-panel";
import LikeSummaryPanel from "./like-summary-panel";
import RepostsSummaryPanel from "./reposts-summary-panel";
import TrackDescription from "./track-description";
import TrackHeader from "./track-header";
import TrackInPlaylistsPanel from "./track-in-playlists-panel";
import UserCard from "./user-card";

interface DetailTrackProps {
  slug: string;
}

const DetailTrack = ({ slug }: DetailTrackProps) => {
  const { data: session } = authClient.useSession();
  const { audio, isPending, isError } = useAudioBySlug(slug);

  if (isPending && slug) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center p-6">
        <div className="text-destructive mb-4">
          <AlertCircleIcon size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          Failed to load track information
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!audio?.data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center p-6">
        <div className="text-muted-foreground mb-4">
          <MusicIcon size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Track not found</h2>
        <p className="text-muted-foreground">
          The track you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <TrackHeader audio={audio.data} />
      <div className="flex gap-6 mt-5">
        <div className="flex-1 space-y-6">
          <PlayerActions audio={audio.data} />
          <div className="flex gap-6">
            <UserCard
              user={audio.data.user}
              currentUserId={session?.user.id as string}
            />
            <div className="flex-1 space-y-8">
              <TrackDescription audio={audio.data} />
              <div>
                {audio.data.commentsCount < 1 ? (
                  <CommentsEmpty />
                ) : (
                  <Suspense
                    fallback={
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    }
                  >
                    <Comments audioId={audio.data.id} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[363px] space-y-10">
          <FanRankPanel audioId={audio.data.id} />

          {/* <div>
            <p>TODO: related tracks here...</p>
          </div> */}

          <TrackInPlaylistsPanel audioId={audio.data.id} />
          <LikeSummaryPanel audioSlug={audio.data.slug} />
          <RepostsSummaryPanel audioId={audio.data.id} />
        </div>
      </div>
    </div>
  );
};

export default DetailTrack;
