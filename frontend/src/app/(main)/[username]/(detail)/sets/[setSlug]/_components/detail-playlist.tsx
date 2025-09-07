"use client";

import AppFooter from "@/app/_components/app-footer";
import TrackCardCompact from "@/components/track-card-compact";
import { usePlaylistBySlug } from "@/hooks/tanstack/playlist";
import { authClient } from "@/lib/auth-client";
import { TPlaylist } from "@/types/playlist-type";
import { TUser } from "@/types/user.type";
import { LockIcon } from "lucide-react";
import OtherUserPlaylistPanel from "./other-user-playlists-panel";
import PlaylistActions from "./playlist-actions";
import PlaylistDetailHeader from "./playlist-detall-header";
import UserCard from "@/app/(main)/[username]/(detail)/[trackSlug]/_components/user-card";

interface DetailPlaylistProps {
  playlistSlug: string;
}

const DetailPlaylist = ({ playlistSlug }: DetailPlaylistProps) => {
  const { data: session } = authClient.useSession();
  const { isError, isPending, playlist } = usePlaylistBySlug(playlistSlug);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div>
      <PlaylistDetailHeader playlist={playlist?.data as TPlaylist} />
      <div className="flex gap-8">
        <div className="flex-1">
          <PlaylistActions playlist={playlist?.data as TPlaylist} />
          <div className="flex gap-8">
            <div className="w-[143px]">
              <UserCard
                user={playlist?.data?.user as TUser}
                isCurrentUser={playlist?.data?.userId === session?.user.id}
              />
            </div>
            <div className="space-y-5 w-full">
              {playlist?.data?.type === "private" && (
                <div className="flex space-x-2 items-center text-sm font-semibold p-2 text-muted-foreground">
                  <LockIcon strokeWidth={2} size={13} />
                  <span>This playlist is private</span>
                </div>
              )}

              {playlist?.data?.description && (
                <p className="leading-relaxed">{playlist.data.description}</p>
              )}

              <div className="space-y-1">
                {playlist?.data?.audios.map((playlistAudio, index) => (
                  <TrackCardCompact
                    key={index}
                    audio={playlistAudio.audio}
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[330px] my-4 space-y-6">
          <OtherUserPlaylistPanel />

          <AppFooter className="text-sm text-gray-700">
            <AppFooter.Brand name="SoundVibe" />
            <AppFooter.Language label="English (US)" />
          </AppFooter>
        </div>
      </div>
    </div>
  );
};

export default DetailPlaylist;
