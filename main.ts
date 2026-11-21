import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Copy the front page image into the output directory.
// The entry image is fixed at build time; this program only moves bytes.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const src = join(botDir, "entry.png");
const dst = join(outDir, "entry.png");

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Real output check: the written file must be byte-identical to the source.
const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
const srcHash = sha256(src);
const dstHash = sha256(dst);
if (srcSize !== dstSize || srcHash !== dstHash) {
  throw new Error(
    `output mismatch: src ${srcSize} bytes sha256 ${srcHash}, dst ${dstSize} bytes sha256 ${dstHash}`,
  );
}
console.log(`copied ${src} -> ${dst} (${dstSize} bytes, sha256 ${dstHash})`);
