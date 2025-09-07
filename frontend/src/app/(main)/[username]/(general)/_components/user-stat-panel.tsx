import { Label } from "@/components/ui/label";
import React from "react";

const UserStatPanel = () => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Followers
          </Label>
          <h2 className="text-3xl font-bold">206</h2>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Following
          </Label>
          <h2 className="text-3xl font-bold">1,279</h2>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
            Tracks
          </Label>
          <h2 className="text-3xl font-bold">27</h2>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
        dolore iste optio temporibus repellat corrupti animi ullam aliquid.
      </p>
    </section>
  );
};

export default UserStatPanel;
