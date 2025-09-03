"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";
import { parseAsStringEnum, useQueryState } from "nuqs";

const PlaylistsDisplayFilter = () => {
  const [playlistFilter, setPlaylistFilter] = useQueryState(
    "playlist-filter",
    parseAsStringEnum<PlaylistFilterEnum>(
      Object.values(PlaylistFilterEnum)
    ).withDefault(PlaylistFilterEnum.all)
  );

  return (
    <>
      <div className="*:not-first:mt-2">
        <Select
          value={playlistFilter}
          onValueChange={(value) =>
            setPlaylistFilter(value as PlaylistFilterEnum)
          }
        >
          <SelectTrigger className="w-[121px] data-[size=default]:h-8">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PlaylistFilterEnum).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PlaylistsDisplayFilter;
