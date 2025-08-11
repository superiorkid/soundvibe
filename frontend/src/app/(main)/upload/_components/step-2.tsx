"use client";

import { Button } from "@/components/ui/button";

const Step2 = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Basic Info</h1>
        <p className="text-muted-foreground tracking-wide font-medium">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut id
          pariatur deleniti.
        </p>
      </div>

      <div>
        <div>
          <div>
            <Button>Update image</Button>
          </div>
        </div>
        <div>inputs here</div>
      </div>
    </div>
  );
};

export default Step2;
