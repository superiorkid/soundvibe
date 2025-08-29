"use client";

import { Repeat2Icon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRepost } from "@/hooks/tanstack/repost";
import { TAudio } from "@/types/audio.type";
import { cn } from "@/lib/utils";

interface RepostButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  audio: TAudio;
  userId: string;
}

const RepostButton = ({ audio, userId, ...restProps }: RepostButtonProps) => {
  const { hasReposted, isPending, toggleRepostMutation } = useRepost({
    audio,
    userId,
  });

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => toggleRepostMutation()}
      className="hover:cursor-pointer hover:opacity-50"
      disabled={isPending}
      {...restProps}
    >
      <Repeat2Icon
        strokeWidth={2}
        size={16}
        className={cn("mr-1", hasReposted && "fill-rose-500 stroke-rose-500")}
      />
      {audio.repostsCount > 0 && (
        <span className={cn(hasReposted && "text-rose-500")}>
          {audio.repostsCount}
        </span>
      )}
    </Button>
  );
};

export default RepostButton;
