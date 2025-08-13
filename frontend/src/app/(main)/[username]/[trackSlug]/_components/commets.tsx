import { AppBrand } from "@/app/_components/app-brand";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import CommentCard from "./comment-card";

const Comments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-lg">4 comments</h5>
        <Button variant="secondary">
          Sorted by: Newest <ChevronDownIcon />
        </Button>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 25 }).map((_, index) => (
          <CommentCard key={index} />
        ))}
      </div>
      <div className="flex justify-center">
        <AppBrand>
          <AppBrand.Icon size={22} strokeWidth={3} />
        </AppBrand>
      </div>
    </div>
  );
};

export default Comments;
