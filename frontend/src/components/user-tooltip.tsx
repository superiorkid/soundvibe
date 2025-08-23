import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { TUser } from "@/types/user.type";

interface UserTooltipProps {
  children: React.ReactNode;
  user: TUser;
}

const UserTooltip = ({ children, user }: UserTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[199px] space-y-5 flex flex-col items-center">
        <Avatar className="size-31">
          <AvatarImage src={user?.image ?? "https://github.com/shadcn.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-center space-y-1">
          <Link href="#" className="font-medium text-sm">
            {user?.name}
          </Link>
          <Link href="#" className="flex items-center justify-center">
            <UserIcon strokeWidth={2} size={16} className="mr-1" />
            <span className="text-sm font-medium text-muted-foreground">
              6,383
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">Perth, Australia</p>
        </div>
        <Button className="w-full" size="sm">
          Follow
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserTooltip;
