import { writeFile, mkdir } from "node:fs/promises";
import getPostedData from './loading.js';

const filename = "./data/posted.json";

const data = await getPostedData();

console.log("Next fight: ", data.nextFight);
console.log("Last fight: ", data.lastFight);
console.log("Current fight: ", data.currentFight);

await mkdir('./data');
await writeFile(filename, JSON.stringify(data), 'utf8');