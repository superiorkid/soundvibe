import { userKeys } from "@/lib/query-keys";
import {
  getRecentUserComments,
  getUserByUsername,
  getUserPlaylists,
  getUserReposts,
  getUserTracks,
} from "@/server/user";
import { useQuery } from "@tanstack/react-query";

export const useUserByUsername = (username: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: userKeys.userByUsername(username),
    queryFn: async () => getUserByUsername(username),
    enabled: !!username,
  });

  return { user: data, isPending, isError };
};

export const useRecentComment = (params: {
  limit: number;
  username?: string;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: userKeys.recentComments(params),
    queryFn: async () => getRecentUserComments(params),
  });

  return { comments: data, isPending, isError };
};

export const useUserTracks = (params: {
  username: string;
  filter: "popular" | "latest";
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: userKeys.userTracks(params),
    queryFn: async () => getUserTracks(params),
  });

  return { tracks: data, isPending, isError };
};

export const useUserReposts = (username: string) => {
  const {
    data: tracks,
    isPending,
    isError,
  } = useQuery({
    queryKey: userKeys.userRepostsTracks(username),
    queryFn: async () => getUserReposts(username),
  });

  return { tracks, isPending, isError };
};

export const useUserPlaylist = (username: string) => {
  const {
    data: playlists,
    isPending,
    isError,
  } = useQuery({
    queryKey: userKeys.userPlaylists(username),
    queryFn: async () => getUserPlaylists(username),
  });

  return {
    playlists,
    isError,
    isPending,
  };
};
