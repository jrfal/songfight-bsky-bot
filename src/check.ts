import { readFile, writeFile } from "node:fs/promises";
import { NextFight, LastFight, CurrentFight } from "./types.js";
import { nextFightTemplate, winnerTemplate, currentFightTemplate } from "./templates.js";

const bskyUrl = "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=faltron.bsky.social";

const filename = "./data/posted.json";
const nextFightUrl = "https://sfjukebox.org/fights/?next=true&format=json";
const allFightsUrl = "https://sfjukebox.org/fights?format=json";

const bskyResponse = await fetch(bskyUrl);

if (!bskyResponse.ok) throw new Error("Error in Bluesky call");
const bskyData = await bskyResponse.json();

// const data = await readFile(filename, "utf8");
// const postedData = JSON.parse(data);
// let newPostedData = postedData;

// check for a new fight to post about
const nextFightResponse = await fetch(nextFightUrl);

if (!nextFightResponse.ok) throw new Error("Error in sfjukebox call");
const nextFightData = await nextFightResponse.json();
const nextFight = nextFightData.nextFights[0];

const testNextTitle = nextFightTemplate(nextFight);
bskyData.feed.map((post: any) => console.log(post.post.record.text))

// // check for a winner to report
// const oldFightsResponse = await fetch(allFightsUrl);

// if (!oldFightsResponse.ok) throw new Error("Error in sfjukebox call");
// const oldFightsData = await oldFightsResponse.json();
// const lastFight = oldFightsData.fights[1];

// if (lastFight.key === postedData.lastFight) {
//   console.log("No new winner");
// } else {
//   const getWinnerText = async () => winnerTemplate(lastFight);

//   const text = await Bot.run(getWinnerText, { dryRun });
//   console.log(`[${new Date().toISOString()}] Posted: "${text}"`);

//   newPostedData = { ...newPostedData, lastFight: lastFight.key };
// }

// // check for a new current fight
// const currentFight = oldFightsData.fights[0];

// if (currentFight.key === postedData.currentFight) {
//   console.log("No new current fight");
// } else {
//   const getCurrentText = async () => currentFightTemplate(currentFight);

//   const text = await Bot.run(getCurrentText, { dryRun });
//   console.log(`[${new Date().toISOString()}] Posted: "${text}"`);

//   newPostedData = { ...newPostedData, currentFight: currentFight.key };
// }

// if (newPostedData !== postedData) {
//   await writeFile(filename, JSON.stringify(newPostedData), 'utf8');
// }
