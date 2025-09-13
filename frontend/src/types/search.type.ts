export type TSearchEverythngUser = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  type: "user";
};
export type TSearchEverythingPlaylist = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  username: string;
  type: "playlist";
};
export type TSearchEverythingTrack = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  username: string;
  type: "track";
};

export type TSearchEverything =
  | TSearchEverythngUser
  | TSearchEverythingPlaylist
  | TSearchEverythingTrack;
