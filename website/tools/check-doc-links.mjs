/**
 * Verifies that every doc in a sectioned area is linked from that section's index page.
 *
 * Sections like Guides and FAQs use an explicit `items` array in sidebars.ts *and* a
 * hand-written card grid in their index.md. Adding a doc means editing both, and it is easy
 * to do only one -- the Pandora guide shipped in the sidebar but never appeared on /guides.
 * This check makes that mismatch a build failure instead of something a reader discovers.
 *
 * Opt out for a deliberately unlinked doc with `unlisted: true` or `draft: true` frontmatter.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');

const SECTIONS = [
  { label: 'Guides', dir: 'docs/guides', index: 'docs/guides/index.md', sidebarKey: 'guidesSidebar' },
  { label: 'FAQs', dir: 'docs/faqs', index: 'docs/faqs/index.md', sidebarKey: 'faqsSidebar' },
];

const SIDEBARS_FILE = 'sidebars.ts';

/**
 * The doc ids listed under one sidebar key, in order.
 *
 * This reads sidebars.ts as text rather than importing it (it's TypeScript, and this script runs
 * on bare node). If the shape ever changes enough that nothing is found we warn instead of
 * failing, so restructuring sidebars.ts can't hard-block a build on an unrelated change.
 */
async function sidebarOrder(sidebarsSrc, sidebarKey, dir) {
  const start = sidebarsSrc.indexOf(`${sidebarKey}:`);
  if (start === -1) return null;
  const rest = sidebarsSrc.slice(start + sidebarKey.length);
  const nextKey = rest.search(/\n\s{2}\w+Sidebar:/);
  const block = nextKey === -1 ? rest : rest.slice(0, nextKey);
  const prefix = dir.replace(/^docs\//, '');
  const ids = [...block.matchAll(new RegExp(`['\"\`](${prefix}/[A-Za-z0-9_-]+)['\"\`]`, 'g'))]
    .map((m) => m[1])
    .filter((id) => !/\/index$/.test(id));
  return ids.length ? ids : null;
}

function parseFrontmatter(src) {
  if (!src.startsWith('---')) return {};
  const end = src.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = src.slice(3, end);
  const out = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

async function checkSection({ label, dir, index, sidebarKey }, sidebarsSrc) {
  const absDir = path.join(SITE_ROOT, dir);
  const absIndex = path.join(SITE_ROOT, index);

  let indexSrc;
  try {
    indexSrc = await fs.readFile(absIndex, 'utf8');
  } catch {
    return { label, missing: [], dead: [], skipped: [], order: null, error: `index page not found: ${index}` };
  }

  const entries = await fs.readdir(absDir, { withFileTypes: true });
  const docs = [];
  const skipped = [];
  for (const e of entries) {
    if (!e.isFile() || !/\.mdx?$/.test(e.name) || /^index\.mdx?$/.test(e.name)) continue;
    const src = await fs.readFile(path.join(absDir, e.name), 'utf8');
    const fm = parseFrontmatter(src);
    const url = fm.slug || `/${dir.replace(/^docs\//, '')}/${e.name.replace(/\.mdx?$/, '')}`;
    const id = `${dir.replace(/^docs\//, '')}/${e.name.replace(/\.mdx?$/, '')}`;
    const rec = { file: `${dir}/${e.name}`, url, id, title: fm.title || e.name };
    if (fm.unlisted === 'true' || fm.draft === 'true') skipped.push(rec);
    else docs.push(rec);
  }

  // Links on the index page that point inside this section, in document order.
  const sectionPrefix = `/${dir.replace(/^docs\//, '')}/`;
  const linkedOrder = [...indexSrc.matchAll(/href=["']([^"']+)["']/g)]
    .map((m) => m[1].replace(/\/$/, ''))
    .filter((h) => h.startsWith(sectionPrefix));
  const linked = new Set(linkedOrder);

  const missing = docs.filter((d) => !linked.has(d.url.replace(/\/$/, '')));
  const known = new Set([...docs, ...skipped].map((d) => d.url.replace(/\/$/, '')));
  const dead = [...linked].filter((h) => !known.has(h));

  // Order: the card grid should read in the same order as the sidebar. Only meaningful once
  // presence is correct, so skip it while cards are missing or dangling.
  let order = null;
  if (missing.length === 0 && dead.length === 0) {
    const ids = await sidebarOrder(sidebarsSrc, sidebarKey, dir);
    if (!ids) {
      order = { warn: `could not read ${sidebarKey} from ${SIDEBARS_FILE}; order not checked` };
    } else {
      const idToUrl = new Map([...docs, ...skipped].map((d) => [d.id, d.url.replace(/\/$/, '')]));
      const expected = ids.map((id) => idToUrl.get(id)).filter((u) => u && linked.has(u));
      const actual = linkedOrder.filter((u) => expected.includes(u));
      order = expected.join('|') === actual.join('|') ? { ok: true } : { expected, actual };
    }
  }

  return { label, missing, dead, skipped, order, error: null };
}

let sidebarsSrc = '';
try {
  sidebarsSrc = await fs.readFile(path.join(SITE_ROOT, SIDEBARS_FILE), 'utf8');
} catch {
  /* handled per-section as a warning */
}

const results = [];
for (const s of SECTIONS) results.push(await checkSection(s, sidebarsSrc));

const md = ['## 🔗 Doc index links', ''];
let failed = false;

for (const r of results) {
  if (r.error) {
    md.push(`⚠️ **${r.label}:** ${r.error}`);
    continue;
  }
  if (r.missing.length === 0 && r.dead.length === 0) {
    const extra = r.skipped.length ? ` (${r.skipped.length} intentionally unlisted)` : '';
    md.push(`✅ **${r.label}:** every doc is linked from its index page${extra}`);
    if (r.order?.ok) {
      md.push(`✅ **${r.label}:** card order matches ${SIDEBARS_FILE}`);
    } else if (r.order?.warn) {
      md.push(`⚠️ **${r.label}:** ${r.order.warn}`);
    } else if (r.order) {
      failed = true;
      md.push(`❌ **${r.label}:** card order does not match ${SIDEBARS_FILE}`);
      md.push('');
      md.push('| # | Sidebar (expected) | Index page (actual) |');
      md.push('| --- | --- | --- |');
      for (let i = 0; i < Math.max(r.order.expected.length, r.order.actual.length); i += 1) {
        const e = r.order.expected[i] ?? '—';
        const a = r.order.actual[i] ?? '—';
        const mark = e === a ? '' : ' ⬅';
        md.push(`| ${i + 1} | \`${e}\` | \`${a}\`${mark} |`);
      }
      md.push('');
    }
  } else {
    failed = true;
    if (r.missing.length) {
      md.push(`❌ **${r.label}:** ${r.missing.length} doc(s) not linked from the index page`);
      md.push('');
      md.push('| Doc | Expected link |');
      md.push('| --- | --- |');
      for (const m of r.missing) md.push(`| \`${m.file}\` (${m.title}) | \`${m.url}\` |`);
      md.push('');
    }
    if (r.dead.length) {
      md.push(`❌ **${r.label}:** index page links to ${r.dead.length} doc(s) that don't exist`);
      md.push('');
      for (const d of r.dead) md.push(`- \`${d}\``);
      md.push('');
    }
  }
}

const report = md.join('\n');
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `\n${report}\n`, 'utf8');
}

if (failed) {
  console.error(
    '\n[check-doc-links] The index page and the sidebar disagree: a doc is unlinked, a card points ' +
      'at a missing doc, or the card order differs from sidebars.ts. Fix the index page, or mark a ' +
      'deliberately hidden doc `unlisted: true`.'
  );
  process.exit(1);
}
