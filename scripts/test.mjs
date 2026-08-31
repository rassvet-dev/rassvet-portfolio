import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const index = await readFile(path.join(root, "dist/index.html"), "utf8");

for (const required of [
  "RASSVET",
  "Illustration Archive",
  "images/works/split.jpg",
  "images/works/split-mobile.jpg",
  "images/works/no-way-out.jpg",
  "images/works/etto.jpg",
  "images/works/mabayu-ame.jpg",
  "images/works/distance.jpg",
  "images/works/akane.jpg",
  "No way out.",
  "越冬",
  "まばゆ雨",
  "Distance",
  "Akane",
  "Published works",
  "6 illustrations",
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

for (const name of ["no-way-out", "etto", "mabayu-ame", "distance", "akane"]) {
  await access(path.join(root, "dist", "images", "works", `${name}.jpg`));
  await access(path.join(root, "dist", "images", "works", `${name}-thumb.jpg`));
}

console.log("Portfolio checks passed");
