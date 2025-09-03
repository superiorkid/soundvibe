"use client";

import { useCurrentUserPlaylist } from "@/hooks/tanstack/playlist";
import PlaylistCard2 from "./playlist-card-2";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";

const YourPlaylist = () => {
  const [playlistFilter] = useQueryState(
    "playlist-filter",
    parseAsStringEnum<PlaylistFilterEnum>(
      Object.values(PlaylistFilterEnum)
    ).withDefault(PlaylistFilterEnum.all)
  );

  const { playlists, isPending, isError } = useCurrentUserPlaylist({
    filter: playlistFilter,
  });

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
      {(playlists?.data || [])?.length > 0 ? (
        <div className="grid grid-cols-6 gap-5">
          {playlists?.data?.map((playlist, index) => (
            <PlaylistCard2 key={index} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div>
          <p>You dont have playlist</p>
        </div>
      )}
    </div>
  );
};

export default YourPlaylist;
