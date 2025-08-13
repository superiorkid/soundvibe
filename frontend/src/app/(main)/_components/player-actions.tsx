"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  MessageSquareTextIcon,
  PlayIcon,
  Repeat2Icon,
  SendIcon,
  UploadIcon,
} from "lucide-react";

type PlayerActionsProps = {
  showComment?: boolean;
  containerClassName?: string;
};

export function PlayerActions({
  showComment = true,
  containerClassName,
}: PlayerActionsProps) {
  return (
    <div
      className={cn(
        containerClassName,
        showComment ? "space-y-4" : "space-y-0"
      )}
    >
      {showComment && (
        <div className="flex space-x-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Input
            placeholder="Write a comment"
            className="bg-zinc-100 rounded-sm h-8"
          />
          <button>
            <SendIcon size={20} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-3.5 items-center">
          <Button variant="secondary" size="sm">
            <HeartIcon strokeWidth={2} size={16} className="mr-1" />
            518
          </Button>
          <Button variant="secondary" size="sm">
            <Repeat2Icon strokeWidth={2} size={16} className="mr-1" />
            47
          </Button>
          <Button variant="secondary" size="icon">
            <UploadIcon strokeWidth={2} size={16} />
          </Button>
          <Button variant="secondary" size="sm">
            <CopyIcon strokeWidth={2} size={16} />
          </Button>
          <Button variant="secondary" size="sm">
            <EllipsisIcon strokeWidth={2} size={16} />
          </Button>
        </div>

        <div className="flex space-x-3 items-center text-xs text-muted-foreground">
          <Label>
            <PlayIcon size={16} />
            2,262
          </Label>
          <Label>
            <MessageSquareTextIcon size={16} />
            40
          </Label>
        </div>
      </div>
    </div>
  );
}
