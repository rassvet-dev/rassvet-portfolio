import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const index = await readFile(path.join(root, "dist/index.html"), "utf8");
const styles = await readFile(path.join(root, "dist/styles.css"), "utf8");
const galleryScript = await readFile(path.join(root, "dist/gallery.js"), "utf8");
const faceFocus = JSON.parse(await readFile(path.join(root, "dist/images/works/face-focus.json"), "utf8"));

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
  "data-full-view",
  "View actual size",
  "data-full-view-canvas",
  "Scroll / drag to explore",
  "data-face-x=\"0.69\"",
  "data-face-y=\"0.31\"",
  "全体表示を閉じる",
  "AXO GUIDANCE",
  "application/ld+json",
  "rassvet.jp"
]) {
  if (!index.includes(required)) throw new Error(`Missing required text: ${required}`);
}

for (const file of [
  "styles.css",
  "gallery.js",
  "images/works/face-focus.json",
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

if (faceFocus.fallback !== "manual-verified" || faceFocus.works.length !== 6) {
  throw new Error("Face focus manifest is incomplete");
}

for (const work of faceFocus.works) {
  if (!index.includes(`id="${work.id}"`)) throw new Error(`Missing face focus work: ${work.id}`);
  if (!index.includes(`data-face-x="${work.face.x.toFixed(2)}"`)) throw new Error(`Missing face x for ${work.id}`);
  if (!index.includes(`data-face-y="${work.face.y.toFixed(2)}"`)) throw new Error(`Missing face y for ${work.id}`);
}

for (const requiredStyle of [
  "height: 140svh",
  "object-fit: contain",
  ".gallery-controls",
  ".full-view__canvas.is-grabbing"
]) {
  if (!styles.includes(requiredStyle)) throw new Error(`Missing face-safe style: ${requiredStyle}`);
}

for (const requiredInteraction of [
  "centerFullViewOnFace",
  "fullViewCanvas.scrollLeft",
  "fullViewCanvas.scrollTop",
  'fullViewCanvas.addEventListener("pointermove"'
]) {
  if (!galleryScript.includes(requiredInteraction)) throw new Error(`Missing actual-size interaction: ${requiredInteraction}`);
}

console.log("Portfolio checks passed");
