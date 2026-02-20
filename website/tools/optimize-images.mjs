import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const SHOWCASE_DIR = path.join(SITE_ROOT, 'static', 'img', 'pages', 'main', 'screenshots');
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
  if (!(await exists(CACHE_FILE))) {
    return { version: CACHE_VERSION, entries: {} };
  }
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { version: CACHE_VERSION, entries: {} };
    }
    if (!parsed.entries || typeof parsed.entries !== 'object') {
      return { version: CACHE_VERSION, entries: {} };
    }
    if (parsed.version !== CACHE_VERSION) {
      return { version: CACHE_VERSION, entries: {} };
    }
    return parsed;
  } catch {
    return { version: CACHE_VERSION, entries: {} };
  }
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
      await sharp(inPath)
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
    setCacheEntry(cache, inPath, inputHash);
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

  // Explicitly include root logo file.
  const logoPng = path.join(STATIC_IMG_DIR, 'logo.png');
  if (await exists(logoPng) && !pngTargets.includes(logoPng)) {
    pngTargets.push(logoPng);
  }
  const logoNavbarPng = path.join(STATIC_IMG_DIR, 'logo-navbar.png');
  if (await exists(logoNavbarPng) && !pngTargets.includes(logoNavbarPng)) {
    pngTargets.push(logoNavbarPng);
  }

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
    path.join(STATIC_IMG_DIR, 'licentia-social-card.webp'),
    path.join(STATIC_PAGES_DIR, 'main', 'licentia-social-card-bg.webp'),
    path.join(STATIC_PAGES_DIR, 'main', 'licentia-social-card-bg-light.webp'),
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

async function main() {
  if (dryRun) {
    console.log('[optimize-images] Dry run mode enabled. No files will be modified.');
  }

  const cache = await loadCache();
  const showcase = await optimizeShowcaseAndRename();
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
  console.log(`[optimize-images] Team converted to WEBP: ${team.converted}`);
  console.log(`[optimize-images] Team WEBP optimized: ${team.optimizedWebp}`);
  console.log(`[optimize-images] Team WEBP unchanged: ${team.unchangedWebp}`);
  console.log(`[optimize-images] Team source files removed: ${team.deleted}`);
  console.log(`[optimize-images] Team cache hits: ${team.cacheHits}`);
  console.log(`[optimize-images] Team total bytes saved: ${team.savedBytes}`);
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
