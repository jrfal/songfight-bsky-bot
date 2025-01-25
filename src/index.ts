import Bot from "./lib/bot.js";
import { readFile, writeFile } from "node:fs/promises";
import { nextFightTemplate, winnerTemplate, currentFightTemplate } from "./templates.js";

const dryRun = false;

const filename = "./data/posted.json";
const nextFightUrl = "https://sfjukebox.org/fights/?next=true&format=json";
const allFightsUrl = "https://sfjukebox.org/fights?format=json";

const data = await readFile(filename, "utf8");
const postedData = JSON.parse(data);
let newPostedData = postedData;

// check for a new fight to post about
const nextFightResponse = await fetch(nextFightUrl);

if (!nextFightResponse.ok) throw new Error("Error in sfjukebox call");
const nextFightData = await nextFightResponse.json();
const nextFight = nextFightData.nextFights[0];

if (nextFight.title === postedData.nextFight) {
  console.log("No new fight");
} else {
  const getPostText = async () => nextFightTemplate(nextFight);

  const text = await Bot.run(getPostText, { dryRun });
  console.log(`[${new Date().toISOString()}] Posted: "${text}"`);

  newPostedData = { ...newPostedData, nextFight: nextFight.title };
}

// check for a winner to report
const oldFightsResponse = await fetch(allFightsUrl);

if (!oldFightsResponse.ok) throw new Error("Error in sfjukebox call");
const oldFightsData = await oldFightsResponse.json();
const lastFight = oldFightsData.fights[1];

if (lastFight.key === postedData.lastFight) {
  console.log("No new winner");
} else {
  const getWinnerText = async () => winnerTemplate(lastFight);

  const text = await Bot.run(getWinnerText, { dryRun });
  console.log(`[${new Date().toISOString()}] Posted: "${text}"`);

  newPostedData = { ...newPostedData, lastFight: lastFight.key };
}

// check for a new current fight
const currentFight = oldFightsData.fights[0];

if (currentFight.key === postedData.currentFight) {
  console.log("No new current fight");
} else {
  const getCurrentText = async () => currentFightTemplate(currentFight);

  const text = await Bot.run(getCurrentText, { dryRun });
  console.log(`[${new Date().toISOString()}] Posted: "${text}"`);

  newPostedData = { ...newPostedData, currentFight: currentFight.key };
}

if (newPostedData !== postedData) {
  await writeFile(filename, JSON.stringify(newPostedData), 'utf8');
}
