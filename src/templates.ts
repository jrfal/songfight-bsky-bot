import { NextFight, LastFight, CurrentFight } from "./types.js";

export const songFileName = (title: string) => {
  const words = title.replace(/$The /, "").split(" ");
  if (words.length == 1) {
    return words[0].toLowerCase();
  }
  let filename = "";
  while (filename.length < words.length) {
    filename += words[filename.length][0];
  }
  return filename.toLowerCase();
};

export const nextFightTemplate = ({ title, dueDate, optionalChallenge }: NextFight) =>
  `Next fight: "${title}" Due: ${dueDate}${
    optionalChallenge && ` (Optional challenge: ${optionalChallenge})`
  } yourbandname_${songFileName(title)}.mp3 sent to fightmaster@songfight.org`;

const winnerNamesTemplate = (winners: string[]) => {
  if (winners.length === 1) {
    return winners[0];
  } else if (winners.length === 2) {
    return winners.join(" and ");
  } else {
    return (
      winners.slice(0, -1).join(", ") + ", and" + winners[winners.length - 1]
    );
  }
};

export const winnerTemplate = ({ title, winningArtistNames, key }: LastFight) =>
  `Last fight: "${title}" Winner: ${winnerNamesTemplate(
    winningArtistNames
  )} Link: https://www.songfight.org/songpage.php?key=${key}`;

export const currentFightTemplate = ({ title, numSongs }: CurrentFight) =>
  `Current fight: "${title}" ${numSongs} songs Vote! https://songfight.org`;
