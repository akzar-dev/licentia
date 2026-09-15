/**
 * Verifies that every admonition (`:::note`, `:::tip`, ...) will actually render.
 *
 * Docusaurus 3 parses admonitions with remark-directive, which only accepts a title in
 * bracket form -- `:::info[Already installed?]`. The older `:::info Already installed?`
 * form is not a parse error: the directive simply stops being a directive and the whole
 * block, colons and all, is printed to the page as plain text. That is exactly what
 * happened on /welcome, and nothing caught it -- the build was green, the page was live,
 * and it took a reader noticing to find it.
 *
 * So this checks the things that fail silently:
 *
 *   * a title written in the legacy space form (the bug above)
 *   * an unknown type (`:::waring`), which renders as literal text the same way
 *   * `:::caution`, renamed to `:::warning` in Docusaurus 3 and only kept as a
 *     deprecated alias
 *   * an opener with no closing `:::`
 *
 * Fenced code blocks are skipped -- a guide may legitimately show admonition syntax.
 *
 *   node tools/check-admonitions.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const SEARCH_DIRS = ['docs', 'src/pages'];

/** https://docusaurus.io/docs/markdown-features/admonitions */
const TYPES = new Set(['note', 'tip', 'info', 'warning', 'danger']);
const DEPRECATED = new Map([['caution', 'warning']]);

async function markdownFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(path.join(SITE_ROOT, dir), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await markdownFiles(rel)));
    else if (/\.mdx?$/.test(entry.name)) out.push(rel);
  }
  return out;
}

function check(file, source) {
  const problems = [];
  const open = [];
  let fence = null;

  source.split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`;

    const fenceMark = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMark) {
      if (!fence) fence = fenceMark[1][0].repeat(fenceMark[1].length);
      else if (fenceMark[1].startsWith(fence[0]) && fenceMark[1].length >= fence.length) fence = null;
      return;
    }
    if (fence) return;
    if (!line.startsWith(':::')) return;

    const rest = line.slice(3).trim();
    if (rest === '') {
      if (open.length === 0) problems.push(`${at}  a closing ::: with nothing open`);
      else open.pop();
      return;
    }

    const [, type = '', after = ''] = rest.match(/^([A-Za-z][\w-]*)([\s\S]*)$/) ?? [];
    const title = after.trim();

    if (DEPRECATED.has(type)) {
      problems.push(`${at}  :::${type} was renamed in Docusaurus 3 -- use :::${DEPRECATED.get(type)}`);
    } else if (!TYPES.has(type)) {
      problems.push(
        `${at}  :::${type} is not an admonition type; the block will print as literal text\n` +
          `        known types: ${[...TYPES].join(', ')}`
      );
    }

    // `:::info[Title]` and `:::info{#id}` are fine; `:::info Title` is the silent one.
    if (title && !/^[[{]/.test(title)) {
      problems.push(
        `${at}  a title must be bracketed -- write :::${type}[${title}], not :::${type} ${title}\n` +
          `        the space form is not a directive, so the page shows the colons as text`
      );
    }

    open.push(at);
  });

  for (const at of open) problems.push(`${at}  this admonition is never closed with :::`);
  return problems;
}

const files = (await Promise.all(SEARCH_DIRS.map(markdownFiles))).flat();
const problems = [];
for (const file of files) {
  problems.push(...check(file, await fs.readFile(path.join(SITE_ROOT, file), 'utf8')));
}

if (problems.length) {
  console.error(`\nAdmonitions that will not render as intended:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${problems.length} problem(s) in ${files.length} file(s).\n`);
  process.exit(1);
}

console.log(`check-admonitions: ${files.length} file(s), all admonitions well-formed.`);
