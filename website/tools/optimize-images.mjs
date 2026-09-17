import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const SHOWCASE_DIR = path.join(SITE_ROOT, 'static', 'img', 'pages', 'main', 'screenshots');
/**
 * Tile-sized copies of every screenshot, for the homepage strip.
 *
 * The strip used to load each full 1920x1080 file (~219 KB, ~7.9 MB once decoded) to show it
 * at 320x180. A strip tile is 256x144 CSS px on a phone, which at 3x density is 768x432 real
 * pixels, and 320x180 on desktop, which at 2x is 640x360 — so 768 wide covers both. Measured
 * across all 51: ~29 KB each, ~1.3 MB decoded. The full file still opens in the zoom.
 */
const SHOWCASE_THUMBS_DIR = path.join(SHOWCASE_DIR, 'thumbs');
const SHOWCASE_THUMB_WIDTH = 768;
const CANONICAL_SHOWCASE_NAME = /^licentia-next-screenshot-\d+\.webp$/i;
/** `licentia-next-screenshot-4.webp` -> `licentia-next-screenshot-4-thumb.webp`. The `-thumb` in
 *  the name survives bundling (`...-4-thumb-<hash>.webp`), which is what robots.txt matches on. */
const thumbNameFor = (name) => name.replace(/\.webp$/i, '-thumb.webp');

/**
 * Every showcase screenshot is 16:9, so clicking "next" through the gallery never makes the picture
 * change size and shape (a 16:10 shot came out taller than its neighbours). The strip crops to 16:9
 * anyway, so nothing that was visible there is lost.
 * A shot of any other shape is centre-cropped: the widest 16:9 box that fits.
 */
const SHOWCASE_RATIO = 16 / 9;
function cropBoxTo16x9(width, height) {
  const cropW = Math.min(width, Math.round(height * SHOWCASE_RATIO));
  const cropH = Math.min(height, Math.round(cropW / SHOWCASE_RATIO));
  return { left: Math.floor((width - cropW) / 2), top: Math.floor((height - cropH) / 2), width: cropW, height: cropH };
}
const is16x9 = (width, height) => Math.abs(height - Math.round(width / SHOWCASE_RATIO)) <= 1;
const STATIC_PAGES_DIR = path.join(SITE_ROOT, 'static', 'img', 'pages');
const STATIC_IMG_DIR = path.join(SITE_ROOT, 'static', 'img');
const TEAM_DIR = path.join(STATIC_PAGES_DIR, 'team');
const DOCS_DIR = path.join(SITE_ROOT, 'docs');
const CACHE_FILE = path.join(SITE_ROOT, '.image-opt-cache.json');
const CACHE_VERSION = 'optimize-images-v2';

const args = new Set(process.argv.slice(2));
const showcaseOnly = args.has('--showcase-only');
const dryRun = args.has('--dry-run');
const force = args.has('--force');

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function hashBuffer(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(dir, predicate = () => true) {
  const out = [];
  if (!(await exists(dir))) return out;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && predicate(full)) {
        out.push(full);
      }
    }
  }
  return out;
}

async function loadCache() {
  // No cache file yet: legitimate on a first-ever run or an intentional regen.
  // Warn loudly anyway — for lossy assets (WEBP), an empty cache means every image
  // gets re-encoded, which is cumulative quality loss. This must never be silent.
  if (!(await exists(CACHE_FILE))) {
    console.warn(
      `[optimize-images] No cache found at ${getRel(CACHE_FILE)} — treating ALL images as ` +
        `unprocessed. Lossy assets (WEBP) will be re-encoded from scratch. Continue only if this ` +
        `is a deliberate first run / regeneration.`
    );
    return { version: CACHE_VERSION, entries: {} };
  }

  const raw = await fs.readFile(CACHE_FILE, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // A cache that EXISTS but won't parse is almost always a bad merge (this happened
    // once already). Silently falling back to an empty cache here would re-compress every
    // lossy image and degrade quality. Refuse loudly instead.
    throw new Error(
      `[optimize-images] Cache file ${getRel(CACHE_FILE)} exists but is not valid JSON ` +
        `(${err.message}). This is usually a bad merge. Fix the JSON — or delete the file to ` +
        `intentionally regenerate — then re-run.`
    );
  }

  if (!parsed || typeof parsed !== 'object' || !parsed.entries || typeof parsed.entries !== 'object') {
    throw new Error(
      `[optimize-images] Cache file ${getRel(CACHE_FILE)} parsed but has an unexpected shape ` +
        `(missing "entries" object). Fix or delete it, then re-run.`
    );
  }

  // Version mismatch is an intentional invalidation (we bumped CACHE_VERSION), not corruption.
  if (parsed.version !== CACHE_VERSION) {
    console.warn(
      `[optimize-images] Cache version ${JSON.stringify(parsed.version)} != ` +
        `${JSON.stringify(CACHE_VERSION)}; regenerating from scratch.`
    );
    return { version: CACHE_VERSION, entries: {} };
  }

  return parsed;
}

async function saveCache(cache) {
  if (dryRun) return;
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf8');
}

function getRel(filePath) {
  return toPosix(path.relative(SITE_ROOT, filePath));
}

function isCacheHit(cache, filePath, inputHash) {
  if (force) return false;
  const rel = getRel(filePath);
  const hit = cache.entries?.[rel];
  return !!(hit && hit.version === CACHE_VERSION && hit.hash === inputHash);
}

function setCacheEntry(cache, filePath, hash) {
  const rel = getRel(filePath);
  cache.entries[rel] = {
    version: CACHE_VERSION,
    hash,
    updatedAt: new Date().toISOString(),
  };
}

function isShowcaseCandidate(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
}

function isTeamCandidate(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
}

function isPng(filePath) {
  return path.extname(filePath).toLowerCase() === '.png';
}

async function optimizeShowcaseAndRename() {
  if (!(await exists(SHOWCASE_DIR))) {
    console.log('[optimize-images] Showcase dir not found, skipping.');
    return { converted: 0, deleted: 0 };
  }

  const entries = await fs.readdir(SHOWCASE_DIR, { withFileTypes: true });
  let maxN = 0;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const m = entry.name.match(/^(?:s|licentia-next-screenshot-)(\d+)\.webp$/i);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n)) maxN = Math.max(maxN, n);
  }

  const candidates = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => isShowcaseCandidate(name))
    .filter((name) => !/^(?:s|licentia-next-screenshot-)\d+\.webp$/i.test(name))
    .sort((a, b) => a.localeCompare(b));

  let converted = 0;
  let deleted = 0;
  for (const name of candidates) {
    maxN += 1;
    const inPath = path.join(SHOWCASE_DIR, name);
    const outPath = path.join(SHOWCASE_DIR, `licentia-next-screenshot-${maxN}.webp`);
    if (!dryRun) {
      // Read the bytes first rather than handing sharp a path. Given a path on Windows it
      // can keep the file open after toFile() resolves, and the unlink below then fails
      // with EBUSY -- which is exactly what happened the first time a .webp was dropped in
      // here: nine PNGs and JPEGs converted, then the run died on the one webp and left
      // three files behind. A Buffer has no handle to keep.
      const bytes = await fs.readFile(inPath);
      const { width, height } = await sharp(bytes).metadata();
      await sharp(bytes)
        .extract(cropBoxTo16x9(width, height))
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 85, effort: 5 })
        .toFile(outPath);
    }
    converted += 1;
    if (!dryRun) await fs.unlink(inPath);
    deleted += 1;
    console.log(`[showcase] ${name} -> licentia-next-screenshot-${maxN}.webp${dryRun ? ' (dry-run)' : ''}`);
  }

  return { converted, deleted };
}

/**
 * Crops any already-named screenshot that is not 16:9 (see SHOWCASE_RATIO). Only files of the wrong
 * shape are touched, so a run over a folder that is already right re-encodes nothing.
 */
async function cropShowcaseTo16x9() {
  let cropped = 0;
  if (!(await exists(SHOWCASE_DIR))) return cropped;
  const names = (await fs.readdir(SHOWCASE_DIR, { withFileTypes: true }))
    .filter((e) => e.isFile() && CANONICAL_SHOWCASE_NAME.test(e.name))
    .map((e) => e.name);
  for (const name of names) {
    const filePath = path.join(SHOWCASE_DIR, name);
    const bytes = await fs.readFile(filePath);
    const { width, height } = await sharp(bytes).metadata();
    if (is16x9(width, height)) continue;
    const box = cropBoxTo16x9(width, height);
    if (!dryRun) {
      const out = await sharp(bytes).extract(box).webp({ quality: 85, effort: 5 }).toBuffer();
      await fs.writeFile(filePath, out);
    }
    cropped += 1;
    console.log(`[showcase] ${name} ${width}x${height} -> ${box.width}x${box.height} (centre crop to 16:9)${dryRun ? ' (dry-run)' : ''}`);
  }
  return cropped;
}

/**
 * Makes sure every canonical screenshot has an up-to-date thumbnail, and that no thumbnail
 * outlives its screenshot.
 *
 * "Up to date" is judged by the SOURCE's content hash, recorded in the cache against the
 * thumbnail: replace a screenshot in place and its thumbnail is rebuilt on the next run, even
 * though both files still exist. The thumbnail keeps the source's own proportions (width 768,
 * height whatever the ratio gives) rather than being cropped to 16:9 — the zoom shows the
 * thumbnail first and swaps the full image in over it, and a thumbnail of a different shape
 * would make the picture jump when it does.
 */
async function generateShowcaseThumbs(cache) {
  const result = { generated: 0, upToDate: 0, removed: 0 };
  if (!(await exists(SHOWCASE_DIR))) return result;
  if (!dryRun) await fs.mkdir(SHOWCASE_THUMBS_DIR, { recursive: true });

  const sources = (await fs.readdir(SHOWCASE_DIR, { withFileTypes: true }))
    .filter((e) => e.isFile() && CANONICAL_SHOWCASE_NAME.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  for (const name of sources) {
    const bytes = await fs.readFile(path.join(SHOWCASE_DIR, name));
    const sourceHash = hashBuffer(bytes);
    const thumbPath = path.join(SHOWCASE_THUMBS_DIR, thumbNameFor(name));
    if ((await exists(thumbPath)) && isCacheHit(cache, thumbPath, sourceHash)) {
      result.upToDate += 1;
      continue;
    }
    if (!dryRun) {
      await sharp(bytes)
        .resize({ width: SHOWCASE_THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(thumbPath);
      setCacheEntry(cache, thumbPath, sourceHash);
    }
    result.generated += 1;
    console.log(`[thumbs] ${name} -> thumbs/${thumbNameFor(name)}${dryRun ? ' (dry-run)' : ''}`);
  }

  // A thumbnail whose screenshot is gone would be bundled for nothing.
  const wanted = new Set(sources.map(thumbNameFor));
  const existing = (await exists(SHOWCASE_THUMBS_DIR))
    ? (await fs.readdir(SHOWCASE_THUMBS_DIR, { withFileTypes: true })).filter((e) => e.isFile()).map((e) => e.name)
    : [];
  for (const name of existing) {
    if (wanted.has(name)) continue;
    const orphan = path.join(SHOWCASE_THUMBS_DIR, name);
    if (!dryRun) {
      await fs.unlink(orphan);
      delete cache.entries[getRel(orphan)];
    }
    result.removed += 1;
    console.log(`[thumbs] removed thumbs/${name} — its screenshot is gone${dryRun ? ' (dry-run)' : ''}`);
  }
  return result;
}

async function optimizeTeamAvatars(cache) {
  if (!(await exists(TEAM_DIR))) {
    console.log('[optimize-images] Team dir not found, skipping.');
    return { converted: 0, optimizedWebp: 0, deleted: 0, unchangedWebp: 0, cacheHits: 0, savedBytes: 0 };
  }

  const entries = await fs.readdir(TEAM_DIR, { withFileTypes: true });
  const candidates = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => isTeamCandidate(name))
    .sort((a, b) => a.localeCompare(b));

  let converted = 0;
  let optimizedWebp = 0;
  let unchangedWebp = 0;
  let deleted = 0;
  let cacheHits = 0;
  let savedBytes = 0;

  for (const name of candidates) {
    const inPath = path.join(TEAM_DIR, name);
    const ext = path.extname(name).toLowerCase();

    if (ext === '.webp') {
      const result = await optimizeWebpIfSmaller(inPath, cache);
      if (result.cacheHit) {
        cacheHits += 1;
      } else if (result.changed) {
        optimizedWebp += 1;
        savedBytes += result.savedBytes;
        console.log(
          `[team:webp] optimized ${toPosix(path.relative(SITE_ROOT, inPath))} (-${result.savedBytes} bytes)${dryRun ? ' (dry-run)' : ''}`
        );
      } else {
        unchangedWebp += 1;
      }
      continue;
    }

    const outName = `${path.basename(name, ext)}.webp`;
    const outPath = path.join(TEAM_DIR, outName);
    const input = await fs.readFile(inPath);
    const inputHash = hashBuffer(input);
    if (isCacheHit(cache, inPath, inputHash)) {
      cacheHits += 1;
      continue;
    }

    const animated = ext === '.gif';
    const pipeline = sharp(input, animated ? { animated: true } : undefined);
    const webpBuffer = await pipeline
      .resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();

    const outExists = await exists(outPath);
    const prevOutSize = outExists ? (await fs.stat(outPath)).size : 0;

    if (!dryRun) {
      await fs.writeFile(outPath, webpBuffer);
      await fs.unlink(inPath);
    }

    converted += 1;
    deleted += 1;
    savedBytes += Math.max(0, input.length - webpBuffer.length) + Math.max(0, prevOutSize - webpBuffer.length);
    // Only the surviving output is cached. The input was just deleted, so caching its path
    // would leave a dead key behind AND make a later re-drop of the same file a cache hit --
    // which would skip the conversion (and the delete), silently stranding the source file
    // in the repo. Drop `user.png` -> get `user.webp`, original removed, every time.
    setCacheEntry(cache, outPath, hashBuffer(webpBuffer));

    console.log(
      `[team] ${toPosix(path.relative(SITE_ROOT, inPath))} -> ${toPosix(path.relative(SITE_ROOT, outPath))}${animated ? ' (animated)' : ''}${dryRun ? ' (dry-run)' : ''}`
    );
  }

  return { converted, optimizedWebp, deleted, unchangedWebp, cacheHits, savedBytes };
}

async function optimizePngLossless(filePath, cache) {
  const input = await fs.readFile(filePath);
  const inputHash = hashBuffer(input);
  if (isCacheHit(cache, filePath, inputHash)) {
    return { changed: false, savedBytes: 0, cacheHit: true };
  }
  const optimized = await sharp(input)
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
    .toBuffer();

  if (optimized.length >= input.length) {
    setCacheEntry(cache, filePath, inputHash);
    return { changed: false, savedBytes: 0, cacheHit: false };
  }
  if (!dryRun) await fs.writeFile(filePath, optimized);
  setCacheEntry(cache, filePath, hashBuffer(optimized));
  return { changed: true, savedBytes: input.length - optimized.length, cacheHit: false };
}

async function optimizeWebpIfSmaller(filePath, cache) {
  if (!(await exists(filePath))) return { changed: false, savedBytes: 0, skipped: true, cacheHit: false };
  const input = await fs.readFile(filePath);
  const inputHash = hashBuffer(input);
  if (isCacheHit(cache, filePath, inputHash)) {
    return { changed: false, savedBytes: 0, skipped: false, cacheHit: true };
  }
  const optimized = await sharp(input)
    .webp({ quality: 85, effort: 6 })
    .toBuffer();

  if (optimized.length >= input.length) {
    setCacheEntry(cache, filePath, inputHash);
    return { changed: false, savedBytes: 0, skipped: false, cacheHit: false };
  }
  if (!dryRun) await fs.writeFile(filePath, optimized);
  setCacheEntry(cache, filePath, hashBuffer(optimized));
  return { changed: true, savedBytes: input.length - optimized.length, skipped: false, cacheHit: false };
}

async function optimizeOtherPngs(cache) {
  const pngTargets = [
    ...(await listFilesRecursive(STATIC_PAGES_DIR, isPng)),
    ...(await listFilesRecursive(DOCS_DIR, isPng)),
  ];

  let optimized = 0;
  let skipped = 0;
  let cacheHits = 0;
  let savedBytes = 0;
  for (const filePath of pngTargets) {
    const result = await optimizePngLossless(filePath, cache);
    if (result.cacheHit) {
      cacheHits += 1;
      continue;
    }
    const changed = result.changed;
    if (changed) {
      optimized += 1;
      savedBytes += result.savedBytes;
      console.log(
        `[png] optimized ${toPosix(path.relative(SITE_ROOT, filePath))} (-${result.savedBytes} bytes)${dryRun ? ' (dry-run)' : ''}`
      );
    } else {
      skipped += 1;
    }
  }

  return { optimized, skipped, cacheHits, savedBytes };
}

async function optimizeKeyWebpAssets(cache) {
  const webpTargets = [
    path.join(STATIC_IMG_DIR, 'licentia-next-hero-logo.webp'),
    path.join(STATIC_IMG_DIR, 'licentia-next-logo-footer.webp'),
    path.join(STATIC_IMG_DIR, 'licentia-next-logo-navbar.webp'),
    path.join(STATIC_PAGES_DIR, 'main', 'licentia-next-social-card-bg-dark.webp'),
    path.join(STATIC_PAGES_DIR, 'main', 'licentia-next-social-card-bg-light.webp'),
  ];

  let optimized = 0;
  let unchanged = 0;
  let missing = 0;
  let cacheHits = 0;
  let savedBytes = 0;
  for (const filePath of webpTargets) {
    const result = await optimizeWebpIfSmaller(filePath, cache);
    if (result.skipped) {
      missing += 1;
      continue;
    }
    if (result.cacheHit) {
      cacheHits += 1;
      continue;
    }
    if (result.changed) {
      optimized += 1;
      savedBytes += result.savedBytes;
      console.log(
        `[webp] optimized ${toPosix(path.relative(SITE_ROOT, filePath))} (-${result.savedBytes} bytes)${dryRun ? ' (dry-run)' : ''}`
      );
    } else {
      unchanged += 1;
    }
  }

  return { optimized, unchanged, missing, cacheHits, savedBytes };
}

/**
 * Drop cache entries whose file no longer exists (deleted images, or sources consumed by an
 * earlier version of this script). Dead keys are harmless but they accumulate -- 42 of them
 * had piled up from the move to CSS-text decorative headings.
 */
async function pruneDeadEntries(cache) {
  const keys = Object.keys(cache.entries);
  const dead = [];
  for (const rel of keys) {
    if (!(await exists(path.join(SITE_ROOT, rel)))) dead.push(rel);
  }
  if (dead.length === 0) return 0;

  // A sweeping mismatch means the working tree is wrong (partial checkout, bad cwd), not that
  // images were deleted. Pruning then would make the NEXT run re-encode every lossy asset, so
  // refuse and let a human look instead.
  const ratio = dead.length / keys.length;
  if (ratio > 0.5) {
    console.warn(
      `[optimize-images] ${dead.length}/${keys.length} cache entries point at missing files ` +
        `(${Math.round(ratio * 100)}%). That looks like an incomplete working tree rather than ` +
        `deleted images, so NOT pruning. Investigate before re-running.`
    );
    return 0;
  }

  for (const rel of dead) delete cache.entries[rel];
  console.log(
    `[optimize-images] pruned ${dead.length} stale cache entr${dead.length === 1 ? 'y' : 'ies'} ` +
      `for files that no longer exist${dryRun ? ' (dry-run)' : ''}.`
  );
  return dead.length;
}

async function main() {
  if (dryRun) {
    console.log('[optimize-images] Dry run mode enabled. No files will be modified.');
  }

  const cache = await loadCache();
  // Prune first: a cache entry for a file that no longer exists must not influence this run.
  const pruned = await pruneDeadEntries(cache);
  const showcase = await optimizeShowcaseAndRename();
  const croppedToRatio = await cropShowcaseTo16x9();
  // After the rename, so a screenshot dropped in this run gets its thumbnail in this run too.
  const thumbs = await generateShowcaseThumbs(cache);
  const team = await optimizeTeamAvatars(cache);
  let others = { optimized: 0, skipped: 0, cacheHits: 0, savedBytes: 0 };
  let webp = { optimized: 0, unchanged: 0, missing: 0, cacheHits: 0, savedBytes: 0 };
  if (!showcaseOnly) {
    others = await optimizeOtherPngs(cache);
    webp = await optimizeKeyWebpAssets(cache);
  }
  await saveCache(cache);

  console.log('');
  console.log('[optimize-images] Done.');
  console.log(`[optimize-images] Showcase converted: ${showcase.converted}`);
  console.log(`[optimize-images] Showcase source files removed: ${showcase.deleted}`);
  console.log(`[optimize-images] Showcase cropped to 16:9: ${croppedToRatio}`);
  console.log(`[optimize-images] Showcase thumbnails generated: ${thumbs.generated}`);
  console.log(`[optimize-images] Showcase thumbnails up to date: ${thumbs.upToDate}`);
  console.log(`[optimize-images] Showcase thumbnails removed (screenshot gone): ${thumbs.removed}`);
  console.log(`[optimize-images] Team converted to WEBP: ${team.converted}`);
  console.log(`[optimize-images] Team WEBP optimized: ${team.optimizedWebp}`);
  console.log(`[optimize-images] Team WEBP unchanged: ${team.unchangedWebp}`);
  console.log(`[optimize-images] Team source files removed: ${team.deleted}`);
  console.log(`[optimize-images] Team cache hits: ${team.cacheHits}`);
  console.log(`[optimize-images] Team total bytes saved: ${team.savedBytes}`);
  console.log(`[optimize-images] Stale cache entries pruned: ${pruned}`);
  if (!showcaseOnly) {
    console.log(`[optimize-images] Other PNG optimized: ${others.optimized}`);
    console.log(`[optimize-images] Other PNG unchanged/skipped: ${others.skipped}`);
    console.log(`[optimize-images] Other PNG cache hits: ${others.cacheHits}`);
    console.log(`[optimize-images] Other PNG total bytes saved: ${others.savedBytes}`);
    console.log(`[optimize-images] Key WEBP optimized: ${webp.optimized}`);
    console.log(`[optimize-images] Key WEBP unchanged: ${webp.unchanged}`);
    console.log(`[optimize-images] Key WEBP missing: ${webp.missing}`);
    console.log(`[optimize-images] Key WEBP cache hits: ${webp.cacheHits}`);
    console.log(`[optimize-images] Key WEBP total bytes saved: ${webp.savedBytes}`);
  }
}

main().catch((err) => {
  console.error('[optimize-images] Failed:', err);
  process.exit(1);
});
