"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";

const CommentFilterDropdown = () => {
  const [commentFilter, setCommentFilter] = useQueryState(
    "comment-filter",
    parseAsStringEnum<CommentFilterEnum>(
      Object.values(CommentFilterEnum)
    ).withDefault(CommentFilterEnum.newest)
  );

  const selectedKey =
    Object.entries(CommentFilterEnum).find(
      ([, value]) => value === commentFilter
    )?.[0] ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="capitalize">
          Sorted by: {selectedKey} <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(CommentFilterEnum).map(([key, value]) => (
          <DropdownMenuItem key={key} onClick={() => setCommentFilter(value)}>
            {value}
            {commentFilter === value && (
              <CheckIcon strokeWidth={2} size={16} className="ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommentFilterDropdown;
