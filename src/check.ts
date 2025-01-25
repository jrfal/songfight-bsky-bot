import { writeFile, mkdir } from "node:fs/promises";
import { nextFightTemplate, winnerTemplate, currentFightTemplate } from "./templates.js";

const bskyUrl = "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=faltron.bsky.social";

const filename = "./data/posted.json";
const nextFightUrl = "https://sfjukebox.org/fights/?next=true&format=json";
const allFightsUrl = "https://sfjukebox.org/fights?format=json";

// get the feed
const bskyResponse = await fetch(bskyUrl);
if (!bskyResponse.ok) throw new Error("Error in Bluesky call");
const bskyData = await bskyResponse.json();
const { feed } = bskyData;

// const data = await readFile(filename, "utf8");
// const postedData = JSON.parse(data);
// let newPostedData = postedData;

// get the next fight
const nextFightResponse = await fetch(nextFightUrl);
if (!nextFightResponse.ok) throw new Error("Error in next fight call");
const nextFightData = await nextFightResponse.json();

// get the rest of the fights
const allFightsResponse = await fetch(allFightsUrl);

if (!allFightsResponse.ok) throw new Error("Error in all fights call");
const allFightsData = await allFightsResponse.json();
const oldFights = allFightsData.fights;

// put all fights in one list
const allFights = [...nextFightData.nextFights, ...oldFights];

// cycle back through fights to find which one was last posted as the next fight
let nextFightTitle = "";
for (let i = 0; i < allFights.length && i < 10 && nextFightTitle === ""; i++) {
    const testNextPost = nextFightTemplate(allFights[i]);
    for (let j = 0; j < feed.length && j < 10 && nextFightTitle === ""; j++) {
        if (testNextPost == feed[j].post.record.text) {
            nextFightTitle = allFights[i].title;
        }
    }
}

// cycle back through fights to find which one was last posted as the last fight
let lastFightKey = "";
for (let i = 0; i < oldFights.length && i < 10 && lastFightKey === ""; i++) {
    const testWinnerPost = winnerTemplate(oldFights[i]);
    for (let j = 0; j < feed.length && j < 10 && lastFightKey === ""; j++) {
        if (testWinnerPost == feed[j].post.record.text) {
            lastFightKey = oldFights[i].key;
        }
    }
}

// cycle back through fights to find which one was last posted as the current fight
let currentFightKey = "";
for (let i = 0; i < oldFights.length && i < 10 && currentFightKey === ""; i++) {
    const testCurrentPost = currentFightTemplate(oldFights[i]);
    for (let j = 0; j < feed.length && j < 10 && currentFightKey === ""; j++) {
        if (testCurrentPost == feed[j].post.record.text) {
            currentFightKey = oldFights[i].key;
        }
    }
}

console.log("Next fight: ", nextFightTitle);
console.log("Last fight: ", lastFightKey);
console.log("Current fight: ", currentFightKey);

let data = {
    nextFight: nextFightTitle !== "" ? nextFightTitle : undefined,
    lastFight: lastFightKey !== "" ? lastFightKey : undefined,
    currentFight: currentFightKey !== "" ? currentFightKey : undefined,
};

await mkdir('./data');
await writeFile(filename, JSON.stringify(data), 'utf8');