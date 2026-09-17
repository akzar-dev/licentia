/**
 * Every screenshot in the showcase directory, bulk-loaded at build time.
 *
 * New screenshots are picked up automatically once they've been through
 * `npm run optimize-images:showcase` (which converts, resizes and renames them, and writes their
 * thumbnails) -- no code change needed here or in the pages that consume this.
 *
 * Because this goes through the bundler's require.context, the individual filenames
 * never appear literally in source. tools/check-assets.mjs therefore excludes this
 * directory from its orphan-image scan.
 */
export type Screenshot = {
  id: string;
  /** The full 1920px file. What the zoom opens. */
  src: string;
  /**
   * A 768px-wide copy for places that show it small (the homepage strip). Same proportions as
   * `src`, so one can stand in for the other. Falls back to `src` if the thumbnail is missing,
   * which `npm run check-showcase-thumbs` fails CI on.
   */
  thumb: string;
};

// Not recursive: the thumbs/ subfolder must not be picked up as screenshots in their own right.
const shotsReq = (require as any).context(
  '@site/static/img/pages/main/screenshots',
  false,
  /\.(png|jpe?g|webp)$/i
);
const thumbsReq = (require as any).context(
  '@site/static/img/pages/main/screenshots/thumbs',
  false,
  /-thumb\.webp$/i
);
const thumbKeys = new Set<string>(thumbsReq.keys());

export const ALL_SCREENSHOTS: Screenshot[] = shotsReq.keys().map((k: string) => {
  const src = shotsReq(k).default as string;
  const thumbKey = k.replace(/\.[^.]+$/, '-thumb.webp');
  return {
    id: k,
    src,
    thumb: thumbKeys.has(thumbKey) ? (thumbsReq(thumbKey).default as string) : src,
  };
});
