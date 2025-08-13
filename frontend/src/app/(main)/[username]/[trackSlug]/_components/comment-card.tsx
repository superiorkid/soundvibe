import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import React from "react";

const CommentCard = () => {
  return (
    <div className="flex items-start gap-4 pr-5">
      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex justify-between items-center flex-1">
        <div className="space-y-1.5">
          <h3 className="text-sm">
            <span className="font-bold">Kia</span> &middot;{" "}
            <span className="font-medium text-muted-foreground">
              6 month ago
            </span>
          </h3>
          <p className="text-sm tracking-wide">Love this track...</p>
          <Button variant="link" size="sm">
            Reply
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col -space-y-0.5"
          >
            <HeartIcon />
            <span>2</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
