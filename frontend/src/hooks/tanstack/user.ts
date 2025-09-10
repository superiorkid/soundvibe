import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import {
  getRecentUserComments,
  getUserByUsername,
  getUserPlaylists,
  getUserReposts,
  getUserTracks,
  updateCurrentUserProfile,
} from "@/server/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

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

export const useUpdateCurrentUserProfile = (props?: {
  onSuccess?: () => void;
}) => {
  const { onSuccess } = props || {};

  const { mutate: updateUserProfileMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) =>
      updateCurrentUserProfile(formData),
    onError: () => {
      toast.error("Failed to update user profile");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      onSuccess?.();
    },
  });

  return {
    updateUserProfileMutation,
    isPending,
  };
};
