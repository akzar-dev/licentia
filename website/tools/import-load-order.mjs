/**
 * Turns the MO2 support report into the data behind /load-order.
 *
 * Kodex (by Kyler45, https://www.nexusmods.com/skyrimspecialedition/mods/157869) writes
 * `support_output.html` into the MO2 profile folder. That file is the same one Modlist
 * Grimoire and The Modding Bordello read, and it is the only place the separator structure
 * of the list exists in machine-readable form -- MO2's own modlist.txt has the separators
 * but not the Nexus links, and the Nexus links are most of the value.
 *
 * ## Why this does not just commit the report
 *
 * `support_output.html` is a SUPPORT report: alongside the mod table it carries the
 * machine's GPU, CPU, RAM, disk usage and screen resolution, and the full text of every
 * INI in the profile. None of that belongs in a public repository. This reads the mod
 * table and nothing else, and writes a JSON file you can read end to end before committing
 * it. Never add the .html itself to the repo; .gitignore has it, but that is a net, not a
 * reason to be careless.
 *
 * ## What it drops
 *
 * Everything from the first separator in CUT_FROM down -- the author's own tools, and the
 * space kept for a player's own additions. Wabbajack excludes both from the compiled list
 * but Kodex still reports them, so publishing them would only confuse. The tool warns
 * loudly if none of those separators matched, because a renamed separator would otherwise
 * publish the lot in silence.
 *
 * ## Plugin counts, and the two ways to get them wrong
 *
 * Both of these produce a confident, plausible, WRONG answer, and neither errors:
 *
 *   1. Reading `plugins.txt`. MO2 leaves the always-on base game and Creation Club
 *      plugins out of that file -- 80 of them on this list -- so it reports 1589 active
 *      plugins where MO2's own counter says 1669. `loadorder.txt` is the full picture.
 *
 *   2. Finding a plugin file by scanning `mods/` and taking the first hit. Nine plugin
 *      names on this list exist in TWO mod folders with different header flags (an "ESL
 *      Patch" mod shipping an ESL-flagged copy of a plain .esp, say). MO2 resolves those
 *      through mod priority; alphabetical order picked the loser eight times out of nine,
 *      which moved eight plugins out of the light space and into the 254 standard slots.
 *      So the search order here is built from `modlist.txt`.
 *
 * With both fixed the numbers below match MO2's own plugin counter exactly: 1669 total,
 * 42 ESM, 172 ESP, 1455 ESL. Classification follows MO2's meaning rather than the file
 * extension -- anything carrying the ESL flag (0x200) is light whatever it is called, an
 * ESM is a master (0x1) that is not light, and everything else is an ESP.
 *
 * ## Usage
 *
 *   node tools/import-load-order.mjs
 *   node tools/import-load-order.mjs --instance "D:/Modlists/Licentia" --profile "Licentia NEXT"
 *   node tools/import-load-order.mjs --dry-run
 *
 * Defaults come from $MO2_INSTANCE and $MO2_PROFILE when they are set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const OUT = path.join(SITE_ROOT, 'src', 'data', 'load-order.json');

/** Separators from which the rest of the list is not the reader's business. */
const CUT_FROM = [/^DEV TOOLS\b/i];

/**
 * Separators that are notes to the author, not divisions of the list.
 *
 * `ADDED MODS - Make your additions below this line` marks where a player's own mods go;
 * `FINAL SEPARATOR` marks the end of the list proper. Neither is content.
 *
 * They are SKIPPED, not cut. Cutting at `ADDED MODS` looks right and quietly loses five
 * mods: the BodySlide output sits below that marker because it has to load last, and it
 * ships with the list like anything else.
 */
const SKIP_SEPARATORS = [/^ADDED MODS\b/i, /^FINAL SEPARATOR\b/i];

/**
 * Separators that really are a division of the list but do not look like one.
 *
 * Only the BodySlide output, stranded below the `ADDED MODS` marker by load order, which
 * would otherwise be filed under `OPTIONAL MODS` - which it very much is not.
 */
const PROMOTE = [[/^Licentia NEXT - Bodyslide Output\b/i, 'BODYSLIDE OUTPUT']];

/** The game's hard limit on plugins that are not light. */
const STANDARD_SLOTS = 254;

const DEFAULT_INSTANCE = process.env.MO2_INSTANCE || 'C:/Games/Licentia/Black_dev';
const DEFAULT_PROFILE = process.env.MO2_PROFILE || 'Licentia NEXT';

// ---------------------------------------------------------------------------- arguments

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}
const dryRun = process.argv.includes('--dry-run');
const instance = path.resolve(arg('instance', DEFAULT_INSTANCE));
const profileName = arg('profile', DEFAULT_PROFILE);
const profileDir = path.join(instance, 'profiles', profileName);

function die(message) {
  console.error(`\nimport-load-order: ${message}\n`);
  process.exit(1);
}

function lines(file) {
  if (!fs.existsSync(file)) die(`no ${path.basename(file)} in ${path.dirname(file)}`);
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

// ------------------------------------------------------------------------- the mod table

/** Undo the handful of entities Kodex emits, and drop any markup inside a cell. */
function text(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readReport(file) {
  const html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('<tbody>');
  const end = html.indexOf('</tbody>', start);
  if (start === -1 || end === -1) {
    die(`${file} has no mod table -- is it really a Kodex support report?`);
  }
  const rows = [...html.slice(start, end).matchAll(/<tr( class="separator-row")?>([\s\S]*?)<\/tr>/g)];
  if (rows.length < 50) die(`only ${rows.length} rows found in ${file}; the format has changed`);

  return rows.map(([, separator, body]) => {
    const cells = [...body.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    const nexus = cells[0]?.match(/nexusmods\.com\/skyrimspecialedition\/mods\/(\d+)/);
    const priority = Number(text(cells[3] ?? ''));
    return {
      separator: Boolean(separator),
      name: text(cells[0] ?? ''),
      version: text(cells[1] ?? ''),
      enabled: text(cells[2] ?? '') === 'True',
      priority: Number.isFinite(priority) ? priority : null,
      nexus: nexus ? Number(nexus[1]) : null,
    };
  });
}

// ------------------------------------------------------------------------ the hierarchy

const SEPARATOR_SUFFIX = / - Separator$/;

/**
 * Separators that divide the list rather than shelve it, but carry no number to say so.
 *
 * Everything else is decided by the numbering: `5 - GRAPHICS` and `8.1 - LICENTIA
 * NON-PLAYER CHARACTERS` are divisions, `Mountains` is a shelf inside one. Case alone
 * cannot decide it -- `1 - Auri` is a shelf and `UI + HUD` is one too, and both read as
 * shouted. These are the exceptions, and naming them is honest where a cleverer rule
 * would be wrong in a way nobody notices.
 */
const UNNUMBERED_GROUPS = [/^OPTIONAL MODS\b/i];

/** `8.1 - LICENTIA PLAYER CHARACTERS` -> {level: 2}; `Mountains` -> null. */
function groupOf(name) {
  const numbered = name.match(/^(\d+(?:\.\d+)*)\s*-\s*(.+)$/);
  if (numbered) {
    const rest = numbered[2].replace(/[^A-Za-z]/g, '');
    // Shouted means a division; the numbered follower shelves (`2 - Inigo`) are not.
    if (rest.length > 1 && rest === rest.toUpperCase()) {
      return { level: numbered[1].split('.').length };
    }
    return null;
  }
  return UNNUMBERED_GROUPS.some((re) => re.test(name)) ? { level: 1 } : null;
}

function build(rows) {
  const groups = [];
  let group = null;
  let section = null;
  let version = null;
  let cut = false;
  let mods = 0;
  let active = 0;
  /** The DLC rows. They are the game, and MO2's own "active mods" counter skips them. */
  let base = 0;
  /**
   * MO2 reports the managed DLC rows -- which sit above every separator -- as disabled,
   * because it does not manage them; they are the game. Badging those "off by default"
   * would be nonsense, so the whole pre-separator block is taken as on. (Getting this
   * wrong for only the 2nd and 3rd DLC row is how the first version shipped.)
   */
  let beforeAnySeparator = true;

  const openGroup = (name, level) => {
    group = { name, level, sections: [] };
    section = null;
    groups.push(group);
  };
  const openSection = (name) => {
    if (!group) openGroup('The list', 1);
    section = { name, mods: [] };
    group.sections.push(section);
  };

  for (const row of rows) {
    if (row.separator) {
      const name = row.name.replace(SEPARATOR_SUFFIX, '').trim();
      if (CUT_FROM.some((re) => re.test(name))) {
        cut = true;
        break;
      }
      beforeAnySeparator = false;
      // The list stamps its own version as the very first separator.
      const stamp = name.match(/^Licentia NEXT\s+(\d[\w.]*)$/i);
      if (stamp && !version) {
        version = stamp[1];
        continue;
      }
      if (SKIP_SEPARATORS.some((re) => re.test(name))) continue;

      const promoted = PROMOTE.find(([re]) => re.test(name));
      if (promoted) openGroup(promoted[1], 1);
      else {
        const asGroup = groupOf(name);
        if (asGroup) openGroup(name, asGroup.level);
        else openSection(name);
      }
      continue;
    }

    if (beforeAnySeparator) {
      if (!group) {
        openGroup('Base game', 1);
        openSection('Official files');
      }
      row.enabled = true;
    }
    if (!section) openSection(group ? group.name : 'The list');

    section.mods.push({
      name: row.name,
      ...(row.version ? { version: row.version } : {}),
      ...(row.priority !== null ? { priority: row.priority } : {}),
      ...(row.nexus ? { nexus: row.nexus } : {}),
      ...(row.enabled ? {} : { off: true }),
    });
    if (beforeAnySeparator) {
      base += 1;
      continue;
    }
    mods += 1;
    if (row.enabled) active += 1;
  }

  if (!cut) {
    console.warn(
      `  ! no separator matched ${CUT_FROM.map(String).join(' or ')} -- nothing was cut.\n` +
        `    Check the author-only separators are still named that way before publishing.`
    );
  }

  // A separator with nothing under it is a marker, not a shelf -- unless it is a heading
  // whose content lives in its sub-divisions (`8 - ...` holds only `8.1`, `8.2`, `8.3`).
  for (const g of groups) g.sections = g.sections.filter((s) => s.mods.length);
  const kept = groups.filter(
    (g, i) => g.sections.length || (groups[i + 1] && groups[i + 1].level > g.level)
  );
  return { version, mods, active, base, groups: kept };
}

// --------------------------------------------------------------------------- the plugins

/**
 * Where MO2 would find each plugin, resolved the way MO2 resolves it.
 *
 * modlist.txt lists mods highest priority FIRST, `+`/`*` enabled and `-` disabled. The
 * virtual Data folder is those mods stacked lowest-first, with the stock game underneath
 * and `overwrite/` on top -- so that is the order this fills the map in, each
 * higher-priority copy replacing the last. Taking the first file found on a plain
 * directory walk instead silently picks the losing copy; see the header comment.
 */
function indexPlugins() {
  const modlist = lines(path.join(profileDir, 'modlist.txt'));
  const enabled = modlist.filter((line) => line[0] === '+' || line[0] === '*').map((l) => l.slice(1));

  const lowestFirst = [
    path.join(instance, 'Stock Game', 'Data'),
    ...enabled.map((name) => path.join(instance, 'mods', name)).reverse(),
    path.join(instance, 'overwrite'),
  ];

  const found = new Map();
  for (const dir of lowestFirst) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.isFile() && /\.es[pml]$/i.test(entry.name)) {
        found.set(entry.name.toLowerCase(), path.join(dir, entry.name));
      }
    }
  }
  return found;
}

/** TES4 header flags: 0x1 is a master, 0x200 is the ESL/light flag. */
function headerFlags(file) {
  const buf = Buffer.alloc(12);
  const fd = fs.openSync(file, 'r');
  try {
    const read = fs.readSync(fd, buf, 0, 12, 0);
    if (read < 12 || buf.toString('latin1', 0, 4) !== 'TES4') return null;
    return buf.readUInt32LE(8);
  } finally {
    fs.closeSync(fd);
  }
}

function countPlugins() {
  // loadorder.txt, not plugins.txt: see the header comment.
  const active = lines(path.join(profileDir, 'loadorder.txt'));
  const index = indexPlugins();
  const counts = { total: active.length, esm: 0, esp: 0, esl: 0, standard: 0, free: 0 };
  const unreadable = [];

  for (const name of active) {
    const file = index.get(name.toLowerCase());
    const flags = file ? headerFlags(file) : null;
    if (flags === null) unreadable.push(name);

    if (/\.esl$/i.test(name) || (flags !== null && flags & 0x200)) counts.esl += 1;
    else if (flags !== null && flags & 0x1) counts.esm += 1;
    else counts.esp += 1;
  }

  counts.standard = counts.esm + counts.esp;
  counts.free = STANDARD_SLOTS - counts.standard;

  if (unreadable.length) {
    console.warn(
      `  ! ${unreadable.length} active plugin(s) could not be read, so they are counted as\n` +
        `    plain ESPs -- the answer that cannot flatter: ${unreadable.slice(0, 5).join(', ')}` +
        `${unreadable.length > 5 ? ' ...' : ''}`
    );
  }
  return counts;
}

// -------------------------------------------------------------------------------- output

const report = path.join(profileDir, 'support_output.html');
if (!fs.existsSync(report)) {
  die(
    `no support report at\n    ${report}\n` +
      `  Run Kodex against the "${profileName}" profile first, or pass --instance/--profile.`
  );
}

console.log(`reading  ${report}`);
const list = build(readReport(report));
const plugins = countPlugins();

const data = {
  /**
   * Everything below is generated. See website/tools/import-load-order.mjs; the source is
   * the Kodex support report in the MO2 profile, which is deliberately NOT in this repo.
   */
  version: list.version,
  generated: new Date().toISOString().slice(0, 10),
  mods: list.active,
  modsIncludingOff: list.mods,
  baseGameFiles: list.base,
  standardSlots: STANDARD_SLOTS,
  plugins,
  groups: list.groups,
};

const sections = list.groups.reduce((n, g) => n + g.sections.length, 0);
console.log(
  `  ${data.mods} active mods (${list.mods - list.active} shipped switched off) in ${sections} sections`
);
console.log(`  version ${data.version ?? '(not stamped in the report)'}`);
console.log(
  `  plugins: ${plugins.total} -- ${plugins.esm} esm, ${plugins.esp} esp, ${plugins.esl} esl\n` +
    `           ${plugins.standard} of ${STANDARD_SLOTS} standard slots used, ${plugins.free} free`
);
console.log(
  `\nThose five numbers should match MO2's own plugin counter exactly -- check before\n` +
    `publishing. Then type into Modlist Grimoire: ESM ${plugins.esm}, ESP ${plugins.esp}, ESL ${plugins.esl}`
);

if (dryRun) {
  console.log(`\n--dry-run: ${OUT} not written.`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(data, null, 1)}\n`, 'utf8');
  console.log(`\nwrote    ${path.relative(SITE_ROOT, OUT)}  (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
}
