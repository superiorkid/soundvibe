import { PlayerActions } from "../../_components/player-actions";
import CommentsEmpty from "./_components/comments-empty";
import Comments from "./_components/commets";
import TrackDescription from "./_components/track-description";
import TrackHeader from "./_components/track-header";
import UserCard from "./_components/user-card";

const DetailTrackPage = () => {
  const hasComments = true;

  return (
    <div>
      <TrackHeader />
      <div className="flex gap-6 mt-5">
        <div className="flex-1 space-y-6">
          <PlayerActions />
          <div className="flex gap-6">
            <UserCard />
            <div className="flex-1 space-y-8">
              <TrackDescription />
              <div>{!hasComments ? <CommentsEmpty /> : <Comments />}</div>
            </div>
          </div>
        </div>
        <div className="w-[363px] bg-amber-500">
          {/* fans */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default DetailTrackPage;
