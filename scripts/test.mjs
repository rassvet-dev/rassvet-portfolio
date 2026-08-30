import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const index = await readFile(path.join(root, "dist/index.html"), "utf8");

for (const required of [
  "RASSVET",
  "Illustration Archive",
  "images/works/split.jpg",
  "images/works/split-mobile.jpg",
  "aria-label=\"作品を選ぶ\"",
  "AXO GUIDANCE",
  "application/ld+json",
  "rassvet.jp"
]) {
  if (!index.includes(required)) throw new Error(`Missing required text: ${required}`);
}

for (const file of [
  "styles.css",
  "gallery.js",
  "robots.txt",
  "_headers",
  "images/works/split.jpg",
  "images/works/split-mobile.jpg",
  "images/works/split-thumb.jpg"
]) {
  await access(path.join(root, "dist", file));
}

console.log("Portfolio checks passed");
