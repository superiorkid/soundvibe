"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeletePlaylist } from "@/hooks/tanstack/playlist";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeletePlaylistDialogProps {
  playlistId: string;
}

const DeletePlaylistDialog = ({ playlistId }: DeletePlaylistDialogProps) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { deletePlaylistMutation, isPending: deletePlaylistPending } =
    useDeletePlaylist({
      onSuccess: () => {
        setOpenDialog(false);
        router.replace("/you/sets");
      },
    });

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary" className="hover:cursor-pointer">
          <Trash2Icon strokeWidth={2} size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePlaylistPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={deletePlaylistPending}
            onClick={() => deletePlaylistMutation(playlistId)}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlaylistDialog;
