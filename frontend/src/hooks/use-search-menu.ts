import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TMenu = {
  href: string;
  label: string;
  isActive: boolean;
};

export function useSearchMenu() {
  const pathname = usePathname();

  const menus = useMemo<TMenu[]>(
    () => [
      {
        href: "/search",
        label: "Everything",
        isActive: pathname === "/search",
      },
      {
        href: "/tracks",
        label: "Tracks",
        isActive: pathname === "/tracks",
      },
      {
        href: "/people",
        label: "People",
        isActive: pathname === "/people",
      },
      {
        href: "/playlists",
        label: "Playlist",
        isActive: pathname === "/playlists",
      },
    ],
    [pathname]
  );

  return menus;
}
