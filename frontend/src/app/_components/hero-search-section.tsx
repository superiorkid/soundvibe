import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const HeroSearch = () => {
  return (
    <div className="space-y-6 flex flex-col justify-center w-[823px] mx-auto h-full">
      <div className="space-y-4 flex flex-col items-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Hear what&quot;s trending for free in the SoundVibe community
        </h3>
        <Link
          href="#"
          className={cn(
            buttonVariants({
              className: "font-semibold rounded-none h-11",
              size: "lg",
            })
          )}
        >
          Explore trending playlist
        </Link>
      </div>
    </div>
  );
};

export default HeroSearch;
