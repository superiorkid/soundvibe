import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { AppBrand } from "../_components/app-brand";
import UploadFlow from "./_components/upload-flow";

const UploadPage = () => {
  return (
    <>
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
        <UploadFlow />
      </div>
    </>
  );
};

export default UploadPage;
