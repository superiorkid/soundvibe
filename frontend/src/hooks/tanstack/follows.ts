import { getQueryClient } from "@/lib/query-client";
import { followKeys } from "@/lib/query-keys";
import {
  follow,
  getFollowers,
  getFollowing,
  getSuggestedUsers,
  unfollow,
} from "@/server/follows";
import { TUser } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useFollow(params: { user: TUser; userId: string }) {
  const { user, userId } = params;
  const hasFollowUser = !!user.followers.some(
    (follow) => follow.followerId === userId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasFollowUser) return unfollow(userId);
      return follow(userId);
    },
    onError: () => {
      toast.error(`Failed to ${hasFollowUser ? "Unfollow" : "Follow"} user.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all });
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
    queryKey: followKeys.getFollowers(userId),
    queryFn: async () => getFollowers(userId),
    enabled: !!userId,
  });

  return {
    followers,
    isPending,
    isError,
  };
}

export function useFollowing(userId: string) {
  const {
    data: following,
    isPending,
    isError,
  } = useQuery({
    queryKey: followKeys.getFollowing(userId),
    queryFn: async () => getFollowing(userId),
    enabled: !!userId,
  });

  return {
    following,
    isPending,
    isError,
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
