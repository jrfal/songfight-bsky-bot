import { bskyAccount } from "./lib/config.js";
import { nextFightTemplate, winnerTemplate, currentFightTemplate } from "./templates.js";

const bskyUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${bskyAccount.identifier}`;

const nextFightUrl = "https://sfjukebox.org/fights/?next=true&format=json";
const allFightsUrl = "https://sfjukebox.org/fights?format=json";

// get the feed
const getFeed = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error in Bluesky call");
    const data = await response.json();
    return data.feed;
}

// get the next fight
const getNextFight = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error in next fight call");
    const data = await response.json();
    return data.nextFights;
}

// get the rest of the fights
const getOldFights = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error in all fights call");
    const data = await response.json();
    return data.fights;
}

// cycle back through fights to find which one was last posted as the next fight
const findPostedNextFight = (feed: any[]) => (fights: any[]) => {
    let title = "";
    for (let i = 0; i < fights.length && i < 10 && title === ""; i++) {
        const testPost = nextFightTemplate(fights[i]);
        for (let j = 0; j < feed.length && j < 10 && title === ""; j++) {
            if (testPost == feed[j].post.record.text) {
                title = fights[i].title;
            }
        }
    }
    return title;
}

// cycle back through fights to find which one was last posted as the last fight
const findPostedLastFight = (feed: any[]) => (fights: any[]) => {
    let key = "";
    for (let i = 0; i < fights.length && i < 10 && key === ""; i++) {
        const testPost = winnerTemplate(fights[i]);
        for (let j = 0; j < feed.length && j < 10 && key === ""; j++) {
            if (testPost == feed[j].post.record.text) {
                key = fights[i].key;
            }
        }
    }
    return key;
}

// cycle back through fights to find which one was last posted as the current fight
const findPostedCurrentFight = (feed: any[]) => (fights: any[]) => {
    let key = "";
    for (let i = 0; i < fights.length && i < 10 && key === ""; i++) {
        const testPost = currentFightTemplate(fights[i]);
        for (let j = 0; j < feed.length && j < 10 && key === ""; j++) {
            if (testPost == feed[j].post.record.text) {
                key = fights[i].key;
            }
        }
    }
    return key;
}

const getPostedData = async () => {
    const feed = await getFeed(bskyUrl);
    const nextFights = await getNextFight(nextFightUrl);
    const oldFights = await getOldFights(allFightsUrl);
    const allFights = [...nextFights, ...oldFights];
    const nextFightTitle = findPostedNextFight(feed)(allFights);
    const lastFightKey = findPostedLastFight(feed)(oldFights);
    const currentFightKey = findPostedCurrentFight(feed)(oldFights);
    
    return {
        nextFight: nextFightTitle !== "" ? nextFightTitle : undefined,
        lastFight: lastFightKey !== "" ? lastFightKey : undefined,
        currentFight: currentFightKey !== "" ? currentFightKey : undefined,
    };
}

export default getPostedData;