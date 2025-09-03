import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TAudio } from "@/types/audio.type";
import { EllipsisIcon, ListPlusIcon, ListStartIcon } from "lucide-react";
import { useState } from "react";
import PlaylistOption from "./playlist-option";

interface MoreActionDropdownProps {
  audio: TAudio;
}

const MoreActionDropdown = ({ audio }: MoreActionDropdownProps) => {
  const [dialogOpen, setOpenDialog] = useState<boolean>(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setOpenDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="hover:cursor-pointer"
          >
            <EllipsisIcon size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <ListStartIcon size={16} strokeWidth={2} />
            <span>Add to Next Up</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger className="hover:cursor-pointer flex items-center gap-1.5">
              <ListPlusIcon size={16} strokeWidth={2} />
              <span>Add to Playlist</span>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        className="top-[8%] left-[50%] translate-x-[-50%] translate-y-[-0%] data-[state=open]:slide-in-from-top-90 data-[state=closed]:slide-out-to-top-90 duration-400 rounded-md min-w-[556px] p-4"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <PlaylistOption audio={audio} />
      </DialogContent>
    </Dialog>
  );
};

export default MoreActionDropdown;
