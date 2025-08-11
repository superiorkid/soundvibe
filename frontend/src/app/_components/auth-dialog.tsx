"use client";

import { useState } from "react";
import { SocialButton } from "./social-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeviconGithub from "@/components/icons/DeviconGithub";
import DeviconGoogle from "@/components/icons/DeviconGoogle";

interface AuthDialogProps {
  children: React.ReactNode;
}

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);

  return (
    <Dialog open={openDialog} onOpenChange={openDialogToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
        <DialogContent
          className="top-[8%] left-[50%] translate-x-[-50%] translate-y-[-0%] data-[state=open]:slide-in-from-top-90 data-[state=closed]:slide-out-to-top-90 duration-400 space-y-6 rounded-md"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-3xl max-w-sm font-bold">
              Sign in or create an account?
            </DialogTitle>
            <DialogDescription className="text-sm tracking-wide leading-relaxed">
              By clicking on any of the &quot;Continue&quot; buttons below, you
              agree to Soundvibe&quot;s{" "}
              <span className="text-sky-600">Terms of use</span> and acknowledge
              our <span className="text-sky-600">Privacy Policy</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <SocialButton
              size="lg"
              variant="outline"
              onClick={() => console.log("login using github")}
            >
              <SocialButton.Icon icon={DeviconGithub} />
              <SocialButton.Text>Continue with GitHub</SocialButton.Text>
            </SocialButton>

            <SocialButton
              size="lg"
              onClick={() => console.log("login using google")}
            >
              <SocialButton.Icon icon={DeviconGoogle} />
              <SocialButton.Text>Continue with Google</SocialButton.Text>
            </SocialButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AuthDialog;
