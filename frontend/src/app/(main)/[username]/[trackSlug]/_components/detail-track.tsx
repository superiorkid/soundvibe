"use client";

import { PlayerActions } from "@/app/(main)/_components/player-actions";
import { Button } from "@/components/ui/button";
import { useAudioBySlug } from "@/hooks/tanstack/audio";
import { AlertCircleIcon, HeartIcon, MusicIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Comments from "./comments";
import CommentsEmpty from "./comments-empty";
import FanRankPanel from "./fan-rank-panel";
import LikeSummaryPanel from "./like-summary-panel";
import TrackDescription from "./track-description";
import TrackHeader from "./track-header";
import UserCard from "./user-card";
import { authClient } from "@/lib/auth-client";

interface DetailTrackProps {
  slug: string;
}

const hasComments = true;

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
              isCurrentUser={audio.data.userId === session?.user.id}
            />
            <div className="flex-1 space-y-8">
              <TrackDescription audio={audio.data} />
              <div>
                {!hasComments ? (
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
          {/* fans */}
          <FanRankPanel audioId={audio.data.id} />

          <div>
            <p>SOON: related tracks here...</p>
          </div>

          {/* in playlists */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold uppercase text-sm">in playlist</h1>
              <Link
                href="/username/track-title/sets"
                className="text-xs text-muted-foreground tracking-wide"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="relative size-14">
                    <Image
                      fill
                      src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="playlist img"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="text-sm space-y-3.5">
                    <div>
                      <h1 className="font-bold text-muted-foreground">
                        Alex Pirlea
                      </h1>
                      <p className="font-semibold">House</p>
                    </div>
                    <button className="text-xs flex items-center gap-1">
                      <HeartIcon
                        className="fill-foreground"
                        size={12}
                        strokeWidth={2}
                      />
                      <span className="font-medium">12</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* likes */}
          <LikeSummaryPanel
            audioSlug={audio.data.slug}
            username={audio.data.user.displayUsername}
          />

          {/* reposts */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold uppercase text-sm">14.3K reposts</h1>
              <Link
                href="/username/track-title/reposts"
                className="text-xs text-muted-foreground tracking-wide"
              >
                View all
              </Link>
            </div>
            <div className="flex -space-x-[1.4rem]">
              {Array.from({ length: 9 }).map((_, index) => (
                <Image
                  key={index}
                  className="ring-background rounded-full ring-2"
                  src="https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={60}
                  height={60}
                  alt="Avatar 01"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTrack;
