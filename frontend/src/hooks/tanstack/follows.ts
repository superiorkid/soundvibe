import { getQueryClient } from "@/lib/query-client";
import { audioKeys, commentKeys, followKeys, userKeys } from "@/lib/query-keys";
import {
  follow,
  getFollowers,
  getFollowersByUsername,
  getFollowing,
  getFollowingByUsername,
  getSuggestedUsers,
  unfollow,
} from "@/server/follows";
import { TUser } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useFollow(params: {
  user: TUser;
  currentUserId: string;
  onOperationComplete?: (isNowFollowing: boolean) => void;
}) {
  const { user, currentUserId } = params;
  const hasFollowUser = !!user?.followers?.some(
    (follow) => follow.followerId === currentUserId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      if (hasFollowUser) return unfollow(userId);
      return follow(userId);
    },
    onError: () => {
      toast.error(`Failed to ${hasFollowUser ? "Unfollow" : "Follow"} user.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all });
      queryClient.invalidateQueries({ queryKey: audioKeys.all });
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });

      const isNowFollowing = !hasFollowUser;
      params.onOperationComplete?.(isNowFollowing);
    },
  });

  return {
    followUserToggleMutation: mutate,
    hasFollowUser,
    isPending,
  };
}

export function useFollowers(userId: string) {
  const {
    data: followers,
    isPending,
    isError,
  } = useQuery({
    queryKey: followKeys.getFollowersById(userId),
    queryFn: async () => getFollowers(userId),
    enabled: !!userId,
  });

  return {
    followers,
    isPending,
    isError,
  };
}

export function useFollowing(params: { userId: string; filter?: string }) {
  const {
    data: following,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: followKeys.getFollowingById(params),
    queryFn: async () => getFollowing(params),
    enabled: !!params.userId,
  });

  return {
    following,
    isPending,
    isError,
    refetch,
  };
}

export function useSuggestedUsers(props?: { limit?: number }) {
  const { limit } = props || {};
  const {
    data: suggestedUsers,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: followKeys.getSuggestedUsers(limit),
    queryFn: async () => getSuggestedUsers(limit || 10),
  });

  return {
    suggestedUsers,
    isPending,
    isError,
    refetch,
  };
}

export function useFollowersByUsername(username: string) {
  const {
    data: followers,
    isPending,
    isError,
  } = useQuery({
    queryKey: followKeys.getFollowersByUsername(username),
    queryFn: async () => getFollowersByUsername(username),
    enabled: !!username,
  });

  return {
    followers,
    isPending,
    isError,
  };
}

export function useFollowingByUsername(params: {
  username: string;
  filter?: string;
}) {
  const {
    data: following,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: followKeys.getFollowingByUsername(params),
    queryFn: async () => getFollowingByUsername(params),
    enabled: !!params.username,
  });

  return {
    following,
    isPending,
    isError,
    refetch,
  };
}
