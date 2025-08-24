import { TMenu } from "@/types/menu-type";
import {
  AudioLinesIcon,
  CopyIcon,
  HeartIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { useMemo } from "react";

export function useProfileDropdownMenu() {
  const menus = useMemo<TMenu[]>(
    () => [
      {
        label: "Profile",
        href: "#",
        icon: UserIcon,
      },
      {
        label: "Likes",
        href: "/you/likes",
        icon: HeartIcon,
      },
      {
        label: "Playlists",
        href: "#",
        icon: CopyIcon,
      },
      {
        label: "Following",
        href: "#",
        icon: UserCheckIcon,
      },
      {
        label: "Tracks",
        href: "#",
        icon: AudioLinesIcon,
      },
    ],
    []
  );

  return menus;
}
