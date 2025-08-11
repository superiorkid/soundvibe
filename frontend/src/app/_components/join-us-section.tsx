import React from "react";
import AuthDialog from "./auth-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JoinUsSection = () => {
  return (
    <div className="h-full flex flex-col space-y-5 items-center justify-center">
      <h1 className="text-4xl">Thanks for listening. Now join in.</h1>
      <p className="font-semibold tracking-tight">
        Save tracks, follow artists and build playlists. All for free.
      </p>
      <AuthDialog>
        <Button size="lg" className="text-base">
          Create account
        </Button>
      </AuthDialog>
      <p>
        Already have an account?{" "}
        <AuthDialog>
          <Button
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Sign In
          </Button>
        </AuthDialog>
      </p>
    </div>
  );
};

export default JoinUsSection;
