"use client";

import UserCardCompact from "@/components/user-card-compact";
import { useFollowingByUsername } from "@/hooks/tanstack/follows";
import { TUser } from "@/types/user.type";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface UserFollowingPageProps {
  username: string;
}

const UserFollowingPage = ({ username }: UserFollowingPageProps) => {
  const { following, isError, isPending, refetch } = useFollowingByUsername({
    username,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon size={35} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-sm text-muted-foreground">
          We couldn’t load who you’re following. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!following?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold">You’re not following anyone yet</p>
        <p className="text-sm text-muted-foreground">
          Start discovering people and follow them to see their activity here.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-5 mt-8">
      {following.data.map((follow, index) => (
        <UserCardCompact key={index} user={follow.following as TUser} />
      ))}
    </div>
  );
};

export default UserFollowingPage;
