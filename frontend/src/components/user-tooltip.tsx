"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFollow } from "@/hooks/tanstack/follows";
import { authClient } from "@/lib/auth-client";
import { getInitials, isAbsoluteUrl } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface UserTooltipProps {
  children: React.ReactNode;
  user: TUser;
}

const UserTooltip = ({ children, user }: UserTooltipProps) => {
  const { data: session } = authClient.useSession();

  // const { followUserToggleMutation, hasFollowUser, isPending } = useFollow({
  //   user,
  //   currentUserId: session?.user.id as string,
  // });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[199px] space-y-5 flex flex-col items-center">
        <Avatar className="size-28">
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
        <div className="flex flex-col text-center space-y-1">
          <Link
            href={`/${user.displayUsername}`}
            className="font-medium text-sm hover:opacity-50"
          >
            {user?.name}
          </Link>
          <Link
            href={`/${user.displayUsername}/followers`}
            className="flex items-center justify-center"
          >
            <UserIcon strokeWidth={2} size={16} className="mr-1" />
            <span className="text-sm font-medium text-muted-foreground">
              {user.followersCounts}
            </span>
          </Link>

          {(user.city || user.country) && (
            <p className="text-sm text-muted-foreground">
              {[user.city, user.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
        {/* {session?.user.id !== user.id && (
          <Button
            variant={hasFollowUser ? "secondary" : "default"}
            className="w-full"
            size="sm"
            disabled={isPending}
            onClick={() => followUserToggleMutation(user.id)}
          >
            {hasFollowUser ? "Unfollow" : "Follow"}
          </Button>
        )} */}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserTooltip;
