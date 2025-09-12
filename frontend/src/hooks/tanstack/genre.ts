import { genreKeys } from "@/lib/query-keys";
import {
  findAllGenre,
  findLatestTracksByGenre,
  findPlaylistsByGenre,
  findPopularTracksByGenre,
} from "@/server/genre";
import { useQuery } from "@tanstack/react-query";

export function useGenres() {
  const { data: genres, isPending } = useQuery({
    queryKey: genreKeys.all,
    queryFn: async () => findAllGenre(),
  });

  return { genres, isPending };
}

export function useLatestTracksByGenre(params: {
  name: string;
  limit?: number;
}) {
  const {
    data: tracks,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: genreKeys.latestTracks(params),
    queryFn: async () => findLatestTracksByGenre(params),
    enabled: !!params.name,
  });

  return { tracks, isPending, isError, refetch };
}

export function usePopularTracksByGenre(params: {
  name: string;
  limit?: number;
}) {
  const {
    data: tracks,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: genreKeys.popularTracks(params),
    queryFn: async () => findPopularTracksByGenre(params),
    enabled: !!params.name,
  });

  return { tracks, isPending, isError, refetch };
}

export function usePlaylistsByGenre(params: { name: string; limit?: number }) {
  const {
    data: playlists,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: genreKeys.playlists(params),
    queryFn: async () => findPlaylistsByGenre(params),
    enabled: !!params.name,
  });

  return { playlists, isPending, isError, refetch };
}
