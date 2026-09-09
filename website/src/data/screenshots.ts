/**
 * Every screenshot in the showcase directory, bulk-loaded at build time.
 *
 * New screenshots are picked up automatically once they've been through
 * `npm run optimize-images:showcase` (which converts, resizes and renames them) --
 * no code change needed here or in the pages that consume this.
 *
 * Because this goes through the bundler's require.context, the individual filenames
 * never appear literally in source. tools/check-assets.mjs therefore excludes this
 * directory from its orphan-image scan.
 */
export type Screenshot = { id: string; src: string };

const shotsReq = (require as any).context(
  '@site/static/img/pages/main/screenshots',
  false,
  /\.(png|jpe?g|webp)$/i
);

export const ALL_SCREENSHOTS: Screenshot[] = shotsReq
  .keys()
  .map((k: string) => ({ id: k, src: shotsReq(k).default as string }));
