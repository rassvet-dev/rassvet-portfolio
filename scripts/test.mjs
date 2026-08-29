import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const index = await readFile(path.join(root, "dist/index.html"), "utf8");

for (const required of ["RASSVET", "作品ポートフォリオ", "rassvet.jp"]) {
  if (!index.includes(required)) throw new Error(`Missing required text: ${required}`);
}

for (const file of ["styles.css", "robots.txt", "_headers"]) {
  await access(path.join(root, "dist", file));
}

console.log("Portfolio checks passed");

