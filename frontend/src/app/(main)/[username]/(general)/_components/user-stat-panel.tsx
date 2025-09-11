"use client";

import { Label } from "@/components/ui/label";
import { useUserByUsername } from "@/hooks/tanstack/user";

interface UserStatPanelProps {
  username: string;
}

const UserStatPanel = ({ username }: UserStatPanelProps) => {
  const { isPending, user } = useUserByUsername(username);

  return (
    <section className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Followers
          </Label>
          <h2 className="text-3xl font-bold">{user?.data?.followersCounts}</h2>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Following
          </Label>
          <h2 className="text-3xl font-bold">{user?.data?.followingCounts}</h2>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Tracks
          </Label>
          <h2 className="text-3xl font-bold">
            {isPending ? 0 : user?.data?._count?.audios}
          </h2>
        </div>
      </div>
      {user?.data?.bio && (
        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
          {user.data.bio}
        </p>
      )}
    </section>
  );
};

export default UserStatPanel;
