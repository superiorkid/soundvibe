import React from "react";

const CommentsEmpty = () => {
  return (
    <div className="flex flex-col px-2 my-20 items-center space-y-2">
      <h3 className="text-3xl font-semibold">Seems a little quiet over here</h3>
      <p className="text-muted-foreground">
        Be the first comment on this track
      </p>
    </div>
  );
};

export default CommentsEmpty;
