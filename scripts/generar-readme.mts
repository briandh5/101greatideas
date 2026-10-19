import { readFileSync, writeFileSync } from "node:fs";
import { generarReadme } from "../lib/markdown.ts";

const ideas = JSON.parse(readFileSync("data/ideas.json", "utf8"));
writeFileSync("README.md", generarReadme(ideas, process.env.SITIO));
console.log(`README.md regenerado con ${ideas.length} ideas.`);
