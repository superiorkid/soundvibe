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

  return (
    <UserSummaryPanel
      href={`/${username}/sets/${playlistSlug}/likes`}
      title="like"
      isPending={isPending}
      total={playlists?.data?.total}
      users={playlists?.data?.result.map((playlist) => playlist.user)}
    />
  );
};

export default PlaylistLikeSummaryPanel;
