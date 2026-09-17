/**
 * Every showcase screenshot has a thumbnail of the right shape, and no thumbnail is left over.
 *
 * The homepage strip shows thumbnails and the zoom opens the full file over them, so both halves
 * of that must hold:
 *
 *   - MISSING: a screenshot with no thumbnail still works (src/data/screenshots.ts falls back to
 *     the full file), which is exactly why it has to fail here — nothing else would notice that
 *     tile quietly downloading 1920px again.
 *   - SHAPE: the zoom shows the thumbnail at the full image's size and swaps the full one in. A
 *     thumbnail with different proportions would make the picture jump at the swap.
 *   - ORPHAN: a thumbnail whose screenshot is gone gets bundled for nothing.
 *   - RATIO: every screenshot is 16:9, so paging through the gallery never changes the picture's
 *     size and shape.
 *
 * Existence and dimensions only — it never re-encodes and compares bytes, which would differ
 * between the libvips on a CI runner and on a desktop. Uses image-size (pure JS), so it cannot
 * fail on a native binary that did not install.
 *
 * Fix anything it reports with `npm run optimize-images:showcase`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOWCASE_DIR = path.join(SITE_ROOT, 'static', 'img', 'pages', 'main', 'screenshots');
const THUMBS_DIR = path.join(SHOWCASE_DIR, 'thumbs');
const THUMB_WIDTH = 768;
const CANONICAL = /^licentia-next-screenshot-\d+\.webp$/i;

const listFiles = async (dir) => {
  try {
    return (await fs.readdir(dir, { withFileTypes: true })).filter((e) => e.isFile()).map((e) => e.name);
  } catch {
    return [];
  }
};
const dims = async (file) => imageSize(await fs.readFile(file));

const screenshots = (await listFiles(SHOWCASE_DIR)).filter((n) => CANONICAL.test(n));
const thumbs = new Set(await listFiles(THUMBS_DIR));
const problems = [];

for (const name of screenshots) {
  const thumbName = name.replace(/\.webp$/i, '-thumb.webp');
  if (!thumbs.has(thumbName)) {
    problems.push(`missing   thumbs/${thumbName}`);
    continue;
  }
  thumbs.delete(thumbName);
  const full = await dims(path.join(SHOWCASE_DIR, name));
  if (Math.abs(full.height - Math.round((full.width * 9) / 16)) > 1) {
    problems.push(`ratio     ${name} is ${full.width}x${full.height}, not 16:9`);
  }
  const thumb = await dims(path.join(THUMBS_DIR, thumbName));
  const wantWidth = Math.min(THUMB_WIDTH, full.width);
  const wantHeight = Math.round((full.height * wantWidth) / full.width);
  if (thumb.width !== wantWidth || Math.abs(thumb.height - wantHeight) > 1) {
    problems.push(
      `shape     thumbs/${thumbName} is ${thumb.width}x${thumb.height}, expected ${wantWidth}x${wantHeight} for a ${full.width}x${full.height} screenshot`
    );
  }
}
for (const leftover of thumbs) problems.push(`orphan    thumbs/${leftover} has no screenshot`);

if (problems.length) {
  console.error(`\ncheck-showcase-thumbs: ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\nRun 'npm run optimize-images:showcase' and commit the result.\n`);
  process.exit(1);
}
console.log(`check-showcase-thumbs: ${screenshots.length} screenshot(s), every thumbnail present and the right shape.`);
