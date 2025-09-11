import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { AudioLinesIcon, UserIcon } from "lucide-react";
import { TUser } from "@/types/user.type";

interface UserCardMiniProps {
  user: TUser;
}

const UserCardMini = ({ user }: UserCardMiniProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage src="https://github.com/shadcn.png" />
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
              22.6K
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
              51
            </Link>
          </div>
        </div>
      </div>
      <div>
        <Button size="sm" className="rounded-sm">
          Follow
        </Button>
      </div>
    </div>
  );
};

export default UserCardMini;
