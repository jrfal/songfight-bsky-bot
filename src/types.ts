export interface NextFight {
  title: string;
  dueDate: string;
  optionalChallenge: string;
}

export interface LastFight {
  title: string;
  winningArtistNames: string[];
  key: string;
}

export interface CurrentFight {
  title: string;
  key: string;
  numSongs: number;
}
