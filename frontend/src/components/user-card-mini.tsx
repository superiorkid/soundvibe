"use client";

import { useFollow } from "@/hooks/tanstack/follows";
import { cn, getInitials, isAbsoluteUrl } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { AudioLinesIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";

interface UserCardMiniProps {
  user: TUser;
  currentUserId: string;
}

const UserCardMini = ({ user, currentUserId }: UserCardMiniProps) => {
  const { followUserToggleMutation, isPending, hasFollowUser } = useFollow({
    user,
    currentUserId,
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage
            src={
              user.image
                ? isAbsoluteUrl(user.image)
                  ? user.image
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user.id}`
                : "https://github.com/shadcn.png"
            }
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <h2 className="font-semibold tracking-wide hover:cursor-pointer hover:opacity-50">
            <Link href={`/${user.displayUsername}`}>{user.name}</Link>
          </h2>
          <div className="flex text-sx tracking-wide text-muted-foreground">
            <Link
              href={`/${user.displayUsername}/followers`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: cn("text-xs px-0"),
                })
              )}
            >
              <UserIcon size={14} strokeWidth={2} />
              {user.followersCounts}
            </Link>
            <Link
              href={`/${user.displayUsername}/tracks`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: cn("text-xs px-0"),
                })
              )}
            >
              <AudioLinesIcon size={14} strokeWidth={2} />
              {user.audiosCounts}
            </Link>
          </div>
        </div>
      </div>
      <div>
        <Button
          size="sm"
          className="rounded-sm"
          disabled={isPending}
          onClick={() => followUserToggleMutation(user.id)}
        >
          {hasFollowUser ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default UserCardMini;
