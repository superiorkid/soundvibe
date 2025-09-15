"use client";

import UserSummaryPanel from "@/components/user-summary-panel";
import { useUsersWhoLikedAudio } from "@/hooks/tanstack/audio";
import { TUser } from "@/types/user.type";
import { Loader2Icon } from "lucide-react";

interface LikeSummaryPanelProps {
  audioSlug: string;
  username: string;
}

const LikeSummaryPanel = ({ audioSlug, username }: LikeSummaryPanelProps) => {
  const { isPending, usersWhoLiked } = useUsersWhoLikedAudio({
    slug: audioSlug,
    limit: 9,
  });
  const total = usersWhoLiked?.data?.total;
  const result = usersWhoLiked?.data?.result;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <UserSummaryPanel
      href={`/${username}/${audioSlug}/likes`}
      title="like"
      isPending={isPending}
      total={total}
      users={result?.map((like) => like.user as TUser)}
    />
  );
};

export default LikeSummaryPanel;
