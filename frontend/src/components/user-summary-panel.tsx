import { isAbsoluteUrl } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserSummaryPanelProps {
  title: string;
  total?: number;
  users?: TUser[];
  href: string;
  isPending?: boolean;
}

export function UserSummaryPanel({
  title,
  total = 0,
  users = [],
  href,
  isPending,
}: UserSummaryPanelProps) {
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-sm">
          {total} {title}
          {total > 1 && "s"}
        </h1>
        <Link
          href={href}
          className="text-xs text-muted-foreground tracking-wide"
        >
          View all
        </Link>
      </div>
      <div className="flex -space-x-[1.4rem]">
        {users.map((user, index) => (
          <Image
            key={index}
            className="ring-background rounded-full ring-2"
            src={
              user.image
                ? isAbsoluteUrl(user.image)
                  ? user.image
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user.id}`
                : "https://github.com/shadcn.png"
            }
            width={60}
            height={60}
            alt={`${user.name ?? "User"} image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}
      </div>
    </div>
  );
}

export default UserSummaryPanel;
