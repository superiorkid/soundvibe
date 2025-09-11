import { TComment } from "@/types/comment.type";
import { formatDistance } from "date-fns";

interface RecentCommentCardProps {
  comment: TComment;
}

const RecentCommentCard = ({ comment }: RecentCommentCardProps) => {
  return (
    <div className="flex gap-6 items-center text-sm font-medium">
      <div className="flex-1 space-y-2">
        <p>
          <span className="text-muted-foreground">on</span>{" "}
          {comment.audio.title}
        </p>
        <p className="tracking-wide">&quot;{comment.content}&quot;</p>
      </div>
      <div>
        <span className="text-muted-foreground">
          {formatDistance(new Date(comment?.createdAt as Date), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default RecentCommentCard;
