"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClearListeningHistory } from "@/hooks/tanstack/listening-history";
import { useState } from "react";

const ClearListeningHistoryDropdown = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { clearListeningHistoryMutation, isPending } = useClearListeningHistory(
    {
      onSuccess: () => {
        setShowDropdown(false);
      },
    }
  );

  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="hover:cursor-pointer">
          Clear all history
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-4 max-w-2xs space-y-4">
        <p className="text-sm">
          Are you sure you want to clear your entire listening history? You wont
          be able to undo this action.
        </p>

        <div className="flex justify-end gap-1 items-center">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs hover:cursor-pointer"
            onClick={() => setShowDropdown(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs hover:cursor-pointer"
            onClick={() => clearListeningHistoryMutation()}
            disabled={isPending}
          >
            Clear My History
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClearListeningHistoryDropdown;
