import UserSummaryPanel from "@/components/user-summary-panel";
import { useUsersWhoLikedPlaylist } from "@/hooks/tanstack/playlist";
interface PlaylistLikeSummaryPanelProps {
  playlistId: string;
  playlistSlug: string;
  username: string;
}

const PlaylistLikeSummaryPanel = ({
  playlistId,
  playlistSlug,
  username,
}: PlaylistLikeSummaryPanelProps) => {
  const { isPending, playlists } = useUsersWhoLikedPlaylist({
    playlistId,
    limit: 3,
  });

  const users = playlists?.data?.result ?? [];
  const total = playlists?.data?.total ?? 0;

  if (!isPending && users.length === 0) {
    return null;
  }

  return (
    <UserSummaryPanel
      href={`/${username}/sets/${playlistSlug}/likes`}
      title="like"
      isPending={isPending}
      total={total}
      users={users.map((playlist) => playlist.user)}
    />
  );
};

export default PlaylistLikeSummaryPanel;
