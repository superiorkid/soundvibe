import { authClient } from "@/lib/auth-client";
import { TMenu } from "@/types/menu-type";
import { TUser } from "@/types/user.type";
import {
  AudioLinesIcon,
  CopyIcon,
  HeartIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { useMemo } from "react";

export function useProfileDropdownMenu() {
  const { data: session, isPending } = authClient.useSession();

  const menus = useMemo<TMenu[]>(() => {
    if (!session) return [];

    return [
      {
        label: "Profile",
        href: `/${(session.user as TUser).displayUsername}`,
        icon: UserIcon,
      },
      {
        label: "Likes",
        href: "/you/likes",
        icon: HeartIcon,
      },
      {
        label: "Playlists",
        href: "/you/sets",
        icon: CopyIcon,
      },
      {
        label: "Following",
        href: "/you/following",
        icon: UserCheckIcon,
      },
      {
        label: "Tracks",
        href: `/${(session.user as TUser).displayUsername}/tracks`,
        icon: AudioLinesIcon,
      },
    ];
  }, [session]);

  return { menus, isPending };
}
