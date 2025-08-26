"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteComment } from "@/hooks/tanstack/comment";
import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";

interface DeleteCommentDropdownProps {
  audioId: string;
  commentId: string;
}

const DeleteCommentDropdown = ({
  audioId,
  commentId,
}: DeleteCommentDropdownProps) => {
  const [openDropdown, dropdownToggle] = useState<boolean>(false);

  const { deleteCommentMutation, isPending } = useDeleteComment({
    audioId,
    commentId,
    onSuccess: () => {
      dropdownToggle(false);
    },
  });

  return (
    <DropdownMenu open={openDropdown} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash2Icon strokeWidth={3} size={16} />
          <span className="sr-only">remove comment</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="py-2 px-4 max-w-xs rounded-sm"
        align="end"
      >
        <DropdownMenuLabel>
          Do you really want to remove this comment??
        </DropdownMenuLabel>
        <div className="mt-2 flex justify-end gap-2 items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dropdownToggle(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="button"
            disabled={isPending}
            onClick={() => deleteCommentMutation()}
          >
            Yes
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeleteCommentDropdown;
