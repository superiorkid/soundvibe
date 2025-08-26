"use client";

import { PlayerActions } from "@/app/(main)/_components/player-actions";
import { useAudioBySlug } from "@/hooks/tanstack/audio";
import { TAudio } from "@/types/audio.type";
import { TUser } from "@/types/user.type";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentsEmpty from "./comments-empty";
import Comments from "./comments";
import FanRankPanel from "./fan-rank-panel";
import LikeSummaryPanel from "./like-summary-panel";
import TrackDescription from "./track-description";
import TrackHeader from "./track-header";
import UserCard from "./user-card";

interface DetailTrackProps {
  slug: string;
}

const hasComments = true;

const DetailTrack = ({ slug }: DetailTrackProps) => {
  const { audio, isPending } = useAudioBySlug(slug);

  if (isPending && slug) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <TrackHeader audio={audio?.data as TAudio} />
      <div className="flex gap-6 mt-5">
        <div className="flex-1 space-y-6">
          <PlayerActions audio={audio?.data as TAudio} />
          <div className="flex gap-6">
            <UserCard user={audio?.data?.user as TUser} />
            <div className="flex-1 space-y-8">
              <TrackDescription audio={audio?.data as TAudio} />
              <div>
                {!hasComments ? (
                  <CommentsEmpty />
                ) : (
                  <Comments audioId={audio?.data?.id as string} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[363px] space-y-10">
          {/* fans */}
          <FanRankPanel audioId={audio?.data?.id as string} />

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
            audioSlug={audio?.data?.slug as string}
            username={audio?.data?.user.displayUsername as string}
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
