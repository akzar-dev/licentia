/**
 * Builds every share card from its artwork.
 *
 * ## Why this exists
 *
 * A share card is the one image of this site most people see first, and it is rendered by
 * somebody else's server on a background you do not control. The cards used to be the bare
 * wordmarks: transparent PNGs, each whatever size it came out of the design at, ranging
 * from 1.56:1 to 4.78:1. Two things went wrong with that.
 *
 *   * TRANSPARENCY. Roughly 70% of each card was nothing at all, and the lettering is
 *     black. Facebook and X flatten onto white, where that reads perfectly -- but Discord
 *     composites onto its own dark grey, and there the black simply disappeared. Only the
 *     gold outline survived. Discord is where most of these links get shared.
 *   * SHAPE. Facebook asks for 1200x630 and says to stay "as close to 1.91:1 as possible
 *     to display the full image without any cropping"; X downgrades to a small card below
 *     300x157 and crops toward the same ratio. Nothing here was near 1.91:1.
 *
 * So the artwork is no longer the card. It is composited onto one, here.
 *
 * ## How it works
 *
 * Every file in social-cards/ becomes static/img/social-cards/<name>.jpg at 1200x630: the
 * site's own hero backdrop, blurred and dimmed, the same dark veil the hero lays over it,
 * a gold hairline just inside the edge, and the artwork centred and scaled to fit within a
 * safe margin. The card therefore looks like the page it points at, reads identically on
 * every background, and needs no redrawing when a wordmark changes -- drop the new artwork
 * in and run this.
 *
 * JPEG, not PNG: the background is a photograph, and PNG is the wrong tool for one -- 208
 * KB against 90 KB for output nobody can tell apart. WebP is smaller still, but JPEG is
 * the format no platform has ever had trouble with, and these are fetched by scrapers
 * rather than browsers.
 *
 * ## Usage
 *
 *   npm run build-social-cards           # rebuild every card
 *   npm run build-social-cards -- --check  # verify each artwork has a card, build nothing
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// sharp is loaded lazily, in the build path only. --check is a filesystem comparison and has no
// business failing because a native binary didn't install -- it runs in CI, where that is
// precisely the kind of breakage that stops a deploy for a reason unrelated to the deploy.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const ARTWORK_DIR = path.join(SITE_ROOT, 'social-cards');
const OUT_DIR = path.join(SITE_ROOT, 'static', 'img', 'social-cards');
const BACKDROP = path.join(SITE_ROOT, 'static', 'img', 'pages', 'main', 'licentia-next-social-card-bg-dark.webp');

/** The size every platform agrees on. Facebook's recommendation, and 1.91:1. */
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Keep the artwork away from the edges. X crops a little toward 2:1, the hairline needs
 * room to read as a frame, and a card whose lettering touches the edge looks like a
 * screenshot of a bigger thing.
 */
const MARGIN_X = 90;
const MARGIN_Y = 110;

/**
 * Per-artwork margin overrides, by filename.
 *
 * The defaults are sized for a WORDMARK, and every wordmark here is wide and short -- 2.6:1 to
 * 4.8:1 -- so the WIDTH runs out first and the vertical margin never actually binds. The site's
 * own card is the one piece of artwork that isn't a wordmark: the winged logo is nearly square
 * (1.06:1), so HEIGHT binds instead, and the default 110px vertical margin shrinks it to 435px
 * wide. That is 36% of the card stranded in empty space, where a wordmark fills 85%.
 *
 * 40px is as close to the edge as it should get. X crops a 1200x630 toward 2:1, taking ~15px off
 * the top and bottom, and the gold hairline sits at 18px -- any tighter and the wing tips crowd
 * the frame with nothing to spare if a platform trims. It renders the logo at 584x550.
 *
 * This is a design judgement per piece of artwork, not a formula, which is why it is a table and
 * not a rule keyed on aspect ratio: the next near-square thing may well want different numbers.
 */
const MARGIN_OVERRIDES = {
  'licentia-next-social-card.webp': { y: 40 },
};

/** Enough that black lettering holds against the backdrop, not so much that it is a slab. */
const BACKDROP_BRIGHTNESS = 0.62;
const BACKDROP_BLUR = 6;

const GOLD = '#facb35';
const ARTWORK_EXTS = new Set(['.png', '.webp', '.jpg', '.jpeg']);

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/**
 * The card without its artwork. Built once and reused -- it is the same for every card,
 * and rebuilding it 23 times is 23 times the work for an identical result.
 */
async function buildBackdrop() {
  const photo = await sharp(BACKDROP)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .blur(BACKDROP_BLUR)
    .modulate({ brightness: BACKDROP_BRIGHTNESS })
    .toBuffer();

  // The hero's own radial veil, so a card and the page it opens share a tone.
  const veil = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
       <defs>
         <radialGradient id="v" cx="50%" cy="40%" r="72%">
           <stop offset="0%" stop-color="#000" stop-opacity="0.20"/>
           <stop offset="100%" stop-color="#000" stop-opacity="0.62"/>
         </radialGradient>
       </defs>
       <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#v)"/>
     </svg>`
  );

  const frame = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
       <rect x="18" y="18" width="${WIDTH - 36}" height="${HEIGHT - 36}" rx="18"
             fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="2"/>
     </svg>`
  );

  return sharp(photo).composite([{ input: veil }, { input: frame }]).png().toBuffer();
}

async function artworkFiles() {
  let entries;
  try {
    entries = await fs.readdir(ARTWORK_DIR, { withFileTypes: true });
  } catch {
    console.error(`\nbuild-social-cards: no artwork directory at\n    ${ARTWORK_DIR}\n`);
    process.exit(1);
  }
  return entries
    .filter((e) => e.isFile() && ARTWORK_EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort();
}

const cardName = (artwork) => `${path.basename(artwork, path.extname(artwork))}.jpg`;

async function check(files) {
  const missing = [];
  for (const file of files) {
    const out = path.join(OUT_DIR, cardName(file));
    try {
      await fs.access(out);
    } catch {
      missing.push(cardName(file));
    }
  }
  if (missing.length) {
    console.error(`\nbuild-social-cards: ${missing.length} card(s) have artwork but no image:\n`);
    for (const m of missing) console.error(`  ${m}`);
    console.error(`\nRun 'npm run build-social-cards'.\n`);
    process.exit(1);
  }
  console.log(`build-social-cards: ${files.length} artwork file(s), every card present.`);
}

const files = await artworkFiles();
if (!files.length) {
  console.error(`\nbuild-social-cards: ${ARTWORK_DIR} is empty.\n`);
  process.exit(1);
}

if (checkOnly) {
  await check(files);
  process.exit(0);
}

const { default: sharp } = await import('sharp');

await fs.mkdir(OUT_DIR, { recursive: true });
const base = await buildBackdrop();

// An override naming artwork that no longer exists is silent rot -- it looks like the card is
// still being treated specially when it isn't.
for (const name of Object.keys(MARGIN_OVERRIDES)) {
  if (!files.includes(name)) {
    console.warn(`  ! margin override for '${name}', which is not in social-cards/`);
  }
}

let total = 0;
for (const file of files) {
  const override = MARGIN_OVERRIDES[file] ?? {};
  const marginX = override.x ?? MARGIN_X;
  const marginY = override.y ?? MARGIN_Y;

  const art = await sharp(path.join(ARTWORK_DIR, file))
    .resize(WIDTH - marginX * 2, HEIGHT - marginY * 2, { fit: 'inside' })
    .toBuffer();

  const out = path.join(OUT_DIR, cardName(file));
  await sharp(base)
    .composite([{ input: art, gravity: 'center' }])
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(out);

  const { size } = await fs.stat(out);
  total += size;
  const { width, height } = await sharp(art).metadata();
  const note = MARGIN_OVERRIDES[file] ? `  (${width}x${height}, custom margins)` : '';
  console.log(`  ${cardName(file).padEnd(34)} ${kb(size)}${note}`);
}

console.log(`\n${files.length} card(s) at ${WIDTH}x${HEIGHT}, ${kb(total)} total.`);
console.log(`Artwork lives in social-cards/ and is never published; the cards are.`);
