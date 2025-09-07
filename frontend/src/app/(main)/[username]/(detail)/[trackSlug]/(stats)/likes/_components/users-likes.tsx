"use client";

import UserCardCompact from "@/components/user-card-compact";
import { useUsersWhoLikedAudio } from "@/hooks/tanstack/audio";
import { TUser } from "@/types/user.type";

interface UsersLikesProps {
  trackSlug: string;
}

const UsersLikes = ({ trackSlug }: UsersLikesProps) => {
  const { usersWhoLiked, isPending } = useUsersWhoLikedAudio({
    limit: 25,
    slug: trackSlug,
  });
  const userslikes = usersWhoLiked?.data?.result;

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-6">
      {userslikes?.map((like, index) => (
        <UserCardCompact key={index} user={like.user as TUser} />
      ))}
    </div>
  );
};

export default UsersLikes;
