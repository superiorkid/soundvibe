"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFollow } from "@/hooks/tanstack/follows";
import { useUserByUsername } from "@/hooks/tanstack/user";
import { authClient } from "@/lib/auth-client";
import { TUser } from "@/types/user.type";
import {
  EllipsisIcon,
  PencilIcon,
  UploadIcon,
  UserCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import EditUserDialog from "./edit-user-dialog";

type TMenu = {
  href: string;
  label: string;
};

interface UserContentTabs {
  username: string;
}

const UserContentTabs = ({ username }: UserContentTabs) => {
  const pathname = usePathname();

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const isCurrentUser = username === (session?.user as TUser)?.displayUsername;

  const {
    isError: isUserError,
    isPending: isUserLoading,
    user,
  } = useUserByUsername(username);

  const {
    followUserToggleMutation,
    hasFollowUser,
    isPending: isFollowLoading,
  } = useFollow({
    currentUserId: session?.user.id as string,
    user: user?.data as TUser,
  });

  const tabMenus = useMemo<TMenu[]>(() => {
    return [
      { href: `/${username}`, label: "Popular tracks" },
      { href: `/${username}/tracks`, label: "Tracks" },
      { href: `/${username}/sets`, label: "Playlists" },
      { href: `/${username}/reposts`, label: "Reposts" },
    ];
  }, [username]);

  if (isSessionLoading || isUserLoading) {
    return (
      <div className="flex gap-2 items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-[122px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <Tabs value={pathname}>
        <TabsList className="h-auto rounded-none bg-transparent p-0">
          {tabMenus.map((menu) => (
            <TabsTrigger
              key={menu.href}
              asChild
              value={menu.href}
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-base"
            >
              <Link href={menu.href}>{menu.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center space-x-3">
        <Button size="sm" className="rounded-sm" variant="secondary">
          <UploadIcon size={16} className="mr-1" />
          Share
        </Button>
        {isCurrentUser ? (
          <EditUserDialog username={username}>
            <Button
              size="sm"
              className="rounded-sm hover:cursor-pointer"
              variant="secondary"
            >
              <PencilIcon size={16} className="mr-1" />
              Edit
            </Button>
          </EditUserDialog>
        ) : (
          <>
            <Button
              size="sm"
              className="rounded-sm hover:cursor-pointer"
              disabled={isFollowLoading}
              onClick={() => followUserToggleMutation(user?.data?.id as string)}
              variant="secondary"
            >
              <UserCheckIcon size={16} className="mr-1" />
              {hasFollowUser ? "Unfollow" : "Follow"}
            </Button>
            <Button size="sm" className="rounded-sm" variant="secondary">
              <EllipsisIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserContentTabs;
