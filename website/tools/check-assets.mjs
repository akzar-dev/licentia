/**
 * Asset hygiene report (informational).
 *
 * Two checks:
 *   1. Orphan images    - files under static/ or docs/ that nothing references by name.
 *   2. Unoptimized shots - files in the showcase dir that still have their original
 *                          drop-in name, i.e. someone forgot `npm run optimize-images:showcase`.
 *
 * Reports to stdout and, on CI, appends a section to $GITHUB_STEP_SUMMARY.
 * Exits 0 by default so it never blocks a deploy; pass --strict to fail instead.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const strict = process.argv.slice(2).includes('--strict');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.svg', '.avif']);

// Loaded in bulk via require.context (see src/data/screenshots.ts), so individual
// filenames never appear in source. Excluded from the orphan check by design.
const BULK_LOADED_DIRS = [path.join('static', 'img', 'pages', 'main', 'screenshots')];

const SHOWCASE_DIR = path.join(SITE_ROOT, 'static', 'img', 'pages', 'main', 'screenshots');
const CANONICAL_SHOT = /^(?:s|licentia-next-screenshot-)\d+\.webp$/i;
// Mirrors isShowcaseCandidate() in optimize-images.mjs, so this check flags exactly the
// files that script would act on (and ignores strays like .DS_Store).
const SHOWCASE_CANDIDATE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const toPosix = (p) => p.split(path.sep).join('/');

async function walk(dir, filter = () => true) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'build' || e.name === '.docusaurus') continue;
      out.push(...(await walk(full, filter)));
    } else if (e.isFile() && filter(full)) {
      out.push(full);
    }
  }
  return out;
}

async function buildCorpus() {
  const textExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.md', '.mdx', '.css', '.json', '.html']);
  const files = [
    ...(await walk(path.join(SITE_ROOT, 'src'), (f) => textExts.has(path.extname(f)))),
    ...(await walk(path.join(SITE_ROOT, 'docs'), (f) => textExts.has(path.extname(f)))),
    path.join(SITE_ROOT, 'docusaurus.config.ts'),
    path.join(SITE_ROOT, 'sidebars.ts'),
  ];
  let corpus = '';
  for (const f of files) {
    try {
      corpus += await fs.readFile(f, 'utf8');
    } catch {
      /* ignore unreadable */
    }
  }
  return corpus;
}

async function findOrphans(corpus) {
  const imgs = [
    ...(await walk(path.join(SITE_ROOT, 'static'), (f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))),
    ...(await walk(path.join(SITE_ROOT, 'docs'), (f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))),
  ];

  const orphans = [];
  for (const f of imgs) {
    const rel = toPosix(path.relative(SITE_ROOT, f));
    if (BULK_LOADED_DIRS.some((d) => rel.startsWith(toPosix(d)))) continue;
    const base = path.basename(f);
    if (corpus.includes(base) || corpus.includes(encodeURIComponent(base))) continue;
    const { size } = await fs.stat(f);
    orphans.push({ rel, kb: Math.round(size / 1024) });
  }
  return { orphans, scanned: imgs.length };
}

async function findUnoptimizedShots() {
  let entries;
  try {
    entries = await fs.readdir(SHOWCASE_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const e of entries) {
    if (!e.isFile() || CANONICAL_SHOT.test(e.name)) continue;
    if (!SHOWCASE_CANDIDATE_EXTS.has(path.extname(e.name).toLowerCase())) continue;
    const { size } = await fs.stat(path.join(SHOWCASE_DIR, e.name));
    out.push({ name: e.name, kb: Math.round(size / 1024) });
  }
  return out;
}

const corpus = await buildCorpus();
const { orphans, scanned } = await findOrphans(corpus);
const unoptimized = await findUnoptimizedShots();

const md = [];
md.push('## 🧹 Asset hygiene');
md.push('');

if (orphans.length === 0) {
  md.push(`✅ **Orphan images:** none (${scanned} images scanned)`);
} else {
  const wasted = orphans.reduce((a, o) => a + o.kb, 0);
  md.push(`⚠️ **Orphan images:** ${orphans.length} unreferenced (~${wasted} KB) of ${scanned} scanned`);
  md.push('');
  md.push('| File | Size |');
  md.push('| --- | ---: |');
  for (const o of orphans) md.push(`| \`${o.rel}\` | ${o.kb} KB |`);
  md.push('');
  md.push('_Nothing references these by filename. Delete them, or reference them if that was an oversight._');
}
md.push('');

if (unoptimized.length === 0) {
  md.push('✅ **Showcase screenshots:** all optimized and canonically named');
} else {
  md.push(`⚠️ **Unoptimized showcase screenshots:** ${unoptimized.length} still have drop-in names`);
  md.push('');
  md.push('| File | Size |');
  md.push('| --- | ---: |');
  for (const u of unoptimized) md.push(`| \`${u.name}\` | ${u.kb} KB |`);
  md.push('');
  md.push('_Run `npm run optimize-images:showcase` to convert, resize and rename these._');
}

const report = md.join('\n');
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `\n${report}\n`, 'utf8');
}

if (strict && (orphans.length > 0 || unoptimized.length > 0)) {
  console.error('\n[check-assets] --strict: asset problems found.');
  process.exit(1);
}
