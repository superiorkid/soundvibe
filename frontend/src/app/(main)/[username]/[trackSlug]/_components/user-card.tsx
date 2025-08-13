import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AudioLinesIcon, UserIcon } from "lucide-react";
import Link from "next/link";

const UserCard = () => {
  return (
    <div className="flex flex-col items-center space-y-2.5 w-[145px]">
      <Avatar className="size-25">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h5 className="text-center font-semibold text-sm tracking-wide">
          Dirty South
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/username/followers">
            <UserIcon size={18} className="inline-flex mr-1" />
            221K
          </Link>
          <Link href="/username/followers">
            <AudioLinesIcon size={18} className="inline-flex mr-1" />
            76
          </Link>
        </div>
      </div>
      <div className="space-y-1.5">
        <Button size="sm" className="w-full rounded-md">
          Follow
        </Button>
        <Button size="sm" className="w-full rounded-md" variant="ghost">
          Report
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
