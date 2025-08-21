import { TAudioFile } from "./audio-file.type";
import { TCoverFile } from "./cover-file.type";
import { TGenre } from "./genre.type";
import { TUser } from "./user.type";

export type TAudio = {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  userId: string;
  genreId: string;
  createdAt: Date;
  updatedAt: Date;
  audioFile: TAudioFile;
  user: TUser;
  genre: TGenre;
  coverFile: TCoverFile;
  streamUrl?: string;
};
