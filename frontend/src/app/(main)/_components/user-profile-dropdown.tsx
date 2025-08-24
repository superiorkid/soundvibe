"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAudio } from "@/context/audio-context";
import { useProfileDropdownMenu } from "@/hooks/use-profile-dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/query-client";
import { getInitials } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { ChevronDownIcon, EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileDropdownProps {
  user: TUser;
}

const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const queryClient = getQueryClient();

  const router = useRouter();
  const { clearTrack } = useAudio();

  const dropdownMenus = useProfileDropdownMenu();

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto p-0 hover:bg-transparent hover:cursor-pointer"
          >
            <Avatar>
              <AvatarImage src={user.image} alt={`${user.name} image`} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <ChevronDownIcon
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
          <DropdownMenuGroup>
            {dropdownMenus.map(({ href, label, icon: Icon }, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link href={href}>
                  {Icon && (
                    <Icon
                      size={16}
                      className="opacity-60 fill-foreground stroke-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Open edit menu"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    queryClient.clear();
                    clearTrack();
                    router.push("/logout");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown;
