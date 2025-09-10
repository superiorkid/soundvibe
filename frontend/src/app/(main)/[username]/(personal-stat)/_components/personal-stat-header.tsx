"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUserByUsername } from "@/hooks/tanstack/user";
import { isAbsoluteUrl } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface PersonalStatHeaderProps {
  username: string;
}

const PersonalStatHeader = ({ username }: PersonalStatHeaderProps) => {
  const pathname = usePathname();
  const { isPending, user } = useUserByUsername(username);

  if (isPending) {
    return (
      <div className="h-[145px] flex gap-4 items-center">
        <Skeleton className="size-28 rounded-full" />
        <Skeleton className="w-[187px] h-9" />
      </div>
    );
  }

  return (
    <header className="h-[145px] flex gap-4 items-center">
      <div className="relative size-28 rounded-full overflow-hidden">
        <Image
          fill
          src={
            user?.data?.image
              ? isAbsoluteUrl(user.data.image)
                ? user.data.image
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user.data.id}`
              : "https://github.com/shadcn.png"
          }
          alt={`${user?.data?.name} image`}
          className="object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h1 className="text-2xl font-semibold">
        {pathname.includes("likes")
          ? `Likes by ${user?.data?.name}`
          : pathname.includes("following")
          ? `${user?.data?.name} is following`
          : pathname.includes("followers")
          ? `Followers of ${user?.data?.name}`
          : pathname.includes("comments")
          ? `Comments by ${user?.data?.name}`
          : user?.data?.name}
      </h1>
    </header>
  );
};

export default PersonalStatHeader;
