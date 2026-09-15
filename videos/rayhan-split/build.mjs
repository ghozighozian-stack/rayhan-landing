// Assemble public/index.html by inlining each card fragment into its host.
// Run: node build.mjs   (from videos/rayhan-clip)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(here, "index.template.html"), "utf8");

const assembled = template.replace(/[ \t]*<!--INCLUDE:(card-\d+)-->/g, (_m, id) => {
  const fragment = readFileSync(join(here, "public", "cards", `${id}.html`), "utf8");
  return fragment.trimEnd();
});

const missing = assembled.match(/<!--INCLUDE:[^>]*-->/g);
if (missing) throw new Error(`unresolved includes: ${missing.join(", ")}`);

writeFileSync(join(here, "public", "index.html"), assembled);
console.log(`wrote public/index.html (${assembled.length} bytes)`);
