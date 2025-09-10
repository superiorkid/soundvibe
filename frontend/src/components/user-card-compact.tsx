import { authClient } from "@/lib/auth-client";
import { cn, getInitials, isAbsoluteUrl } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";

interface UserCardCompactProps {
  user: TUser;
}

const UserCardCompact = ({ user }: UserCardCompactProps) => {
  const { data: session } = authClient.useSession();
  const isCurrentUser = session?.user.id === user.id;

  return (
    <div className="flex flex-col justify-center items-center space-y-3.5 group">
      <Avatar className="size-37">
        <AvatarImage
          src={
            user.image
              ? isAbsoluteUrl(user.image)
                ? user.image
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user.id}`
              : "https://github.com/shadcn.png"
          }
        />
        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
      </Avatar>
      <div className="text-center -space-y-1.5">
        <h3 className="font-semibold hover:cursor-pointer hover:opacity-50 tracking-tight">
          <Link href={`/${user?.displayUsername}`}>{user?.name}</Link>
        </h3>
        <Link
          href={`/${user?.displayUsername}/followers`}
          className={cn(
            buttonVariants({
              variant: "link",
              className: cn("text-muted-foreground text-sm hover:opacity-50"),
            })
          )}
        >
          <UserIcon size={16} />
          25 Followers
        </Link>
      </div>
      {!isCurrentUser && (
        <Button size="sm" className="invisible group-hover:visible text-sm">
          Follow
        </Button>
      )}
    </div>
  );
};

export default UserCardCompact;
