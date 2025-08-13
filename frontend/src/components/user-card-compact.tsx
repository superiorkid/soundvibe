import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";

const UserCardCompact = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-3.5 group">
      <Avatar className="size-43">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="font-semibold">Dean Cursor</h3>
        <Link
          href="#"
          className={cn(
            buttonVariants({
              variant: "link",
              className: cn("text-muted-foreground text-sm"),
            })
          )}
        >
          <UserIcon size={16} />
          25 Followers
        </Link>
      </div>
      <Button size="sm" className="invisible group-hover:visible text-sm">
        Follow
      </Button>
    </div>
  );
};

export default UserCardCompact;
