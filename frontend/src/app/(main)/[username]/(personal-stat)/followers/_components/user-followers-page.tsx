"use client";

import UserCardCompact from "@/components/user-card-compact";
import { useFollowersByUsername } from "@/hooks/tanstack/follows";
import { TUser } from "@/types/user.type";
import { Loader2Icon } from "lucide-react";

interface UserFollowersPageProps {
  username: string;
}

const UserFollowersPage = ({ username }: UserFollowersPageProps) => {
  const { followers, isError, isPending } = useFollowersByUsername(username);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon
          size={35}
          strokeWidth={2}
          className="animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
        <p className="text-lg font-semibold">Unable to load followers</p>
        <p className="text-sm text-muted-foreground">
          Something went wrong while fetching {username}’s followers. Please
          refresh the page or try again later.
        </p>
      </div>
    );
  }

  if (!followers?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold">No followers yet</p>
        <p className="text-sm text-muted-foreground">
          {username} hasn’t gained any followers. Be the first to follow and
          support them!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-5 mt-8">
      {followers.data.map((follow, index) => (
        <UserCardCompact key={index} user={follow.follower as TUser} />
      ))}
    </div>
  );
};

export default UserFollowersPage;
