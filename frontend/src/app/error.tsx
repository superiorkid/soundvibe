"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("error from error.tsx", error);
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We hit a snag while loading this page. You can try again or return to
          the homepage.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <Home className="h-4 w-4" />
            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
