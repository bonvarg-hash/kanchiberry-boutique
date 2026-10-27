// After a static export, prefix the site's own image paths with the base path.
// Next.js adds the base path to links and its own bundles, but not to plain
// asset URLs written in the code ("/photos/...", "/fabric/...", the logo).
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.PAGES_BASE_PATH ?? "";
if (!base) process.exit(0);
const dirs = "photos|fabric|weaves|craft|rail|cutouts|audio|kanchiberry-logo\\.svg";
// the path is preceded by a quote, backtick, bracket or an HTML-escaped quote
const re = new RegExp(`(["'\`(]|&quot;|\\\\")/(${dirs})`, "g");

let files = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js|css|txt|json)$/.test(name)) {
      const src = readFileSync(p, "utf8");
      const out = src.replace(re, `$1${base}/$2`);
      if (out !== src) (writeFileSync(p, out), files++);
    }
  }
};
walk("out");
console.log(`prefix-assets: updated ${files} files with ${base}`);
