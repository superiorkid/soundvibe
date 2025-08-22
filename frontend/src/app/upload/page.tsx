import { buttonVariants } from "@/components/ui/button";
import { getQueryClient } from "@/lib/query-client";
import { genreKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { findAllGenre } from "@/server/genre";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AppBrand } from "../_components/app-brand";
import UploadFlow from "./_components/upload-flow";

const UploadPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: genreKeys.all,
    queryFn: async () => findAllGenre(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="fixed left-0 top-0 flex w-full justify-between px-12 bg-background items-center h-16 z-50">
        <AppBrand>
          <AppBrand.Icon size={25} strokeWidth={2.5} />
          <AppBrand.Link href="/discover" className="text-xl">
            Upload
          </AppBrand.Link>
        </AppBrand>
        <div>
          <Link
            href="/discover"
            className={cn(
              buttonVariants({
                className: "rounded-full",
                variant: "secondary",
                size: "icon",
              })
            )}
          >
            <XIcon />
          </Link>
        </div>
      </header>
      <div className="px-4 mt-24 max-w-5xl mx-auto">
        <Suspense>
          <UploadFlow />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default UploadPage;
