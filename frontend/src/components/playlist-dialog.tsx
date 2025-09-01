import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

interface PlaylistDialogProps {
  children: React.ReactNode;
}

const PlaylistDialog = ({ children }: PlaylistDialogProps) => {
  return (
    <DropdownMenuItem asChild>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
};

export default PlaylistDialog;
