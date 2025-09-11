"use client";

import { Button } from "@/components/ui/button";
import UserCardMini from "@/components/user-card-mini";
import { useSuggestedUsers } from "@/hooks/tanstack/follows";
import { Loader2Icon } from "lucide-react";

const SuggestedUsersPanel = () => {
  const { isError, isPending, suggestedUsers, refetch } = useSuggestedUsers({
    limit: 3,
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">
          users you should follow
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground tracking-wide"
          onClick={() => refetch()}
          disabled={isPending}
        >
          Refresh List
        </Button>
      </div>

      <div className="space-y-4">
        {isPending && (
          <div className="flex items-center justify-center py-6">
            <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
          </div>
        )}

        {isError && !isPending && (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Failed to load suggested users.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {!isPending && !isError && !suggestedUsers?.data?.length && (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No suggestions right now.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        )}

        {!isPending &&
          !isError &&
          (suggestedUsers?.data || [])?.length > 0 &&
          (suggestedUsers?.data || []).map((user, index) => (
            <UserCardMini key={index} user={user} />
          ))}
      </div>
    </div>
  );
};

export default SuggestedUsersPanel;
