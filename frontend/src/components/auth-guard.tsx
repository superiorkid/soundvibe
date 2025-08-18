"use client";

import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, error, isPending } = authClient.useSession();

  const shouldRedirect = !isPending && !session && !error;

  useLayoutEffect(() => {
    if (shouldRedirect) {
      const callbackUrl = encodeURIComponent(pathname || "/");
      router.replace(`/signin?callback=${callbackUrl}`);
    }
  }, [shouldRedirect, pathname, router]);

  if (isPending || shouldRedirect) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {shouldRedirect
            ? "Redirecting to sign in..."
            : "Verifying your session..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-red-500">
          Unable to verify session. Please try again.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
