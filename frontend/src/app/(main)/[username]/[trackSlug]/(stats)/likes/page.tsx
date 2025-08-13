import UserCardCompact from "@/components/user-card-compact";

const TrackLikesPage = () => {
  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-6">
      {Array.from({ length: 20 }).map((_, index) => (
        <UserCardCompact key={index} />
      ))}
    </div>
  );
};

export default TrackLikesPage;
