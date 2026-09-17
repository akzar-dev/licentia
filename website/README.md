<div align="center">

# 🌐 Licentia NEXT Website

</div>

> [!TIP]
> Located at https://licentia.quest

<div align="center">

## 🧪 Pipeline status

[![Deploy to GitHub Pages](https://github.com/akzar-dev/licentia/actions/workflows/deploy.yml/badge.svg)](https://github.com/akzar-dev/licentia/actions/workflows/deploy.yml)

</div>

<div align="center">

## 🧭 Dev flow cheat sheet

</div>

| I changed... | Run this | Why |
| --- | --- | --- |
| Added a **showcase screenshot** (dropped any file into `static/img/pages/main/screenshots/`) | `npm run optimize-images:showcase` | Converts to WEBP, centre-crops to **16:9**, caps width at 1920, renames canonically, and writes its 768px **thumbnail** into `thumbs/`. Picked up automatically afterwards — no code change needed. **CI fails if a thumbnail is missing or a screenshot is not 16:9** (`npm run check-showcase-thumbs`). |
| Added/replaced a **docs image** used via `<img>` / `<DocImage>` | `npm run sync-doc-images` | Writes the real `width`/`height` into the source so the page doesn't shift while loading. **CI fails if you skip this.** |
| Added a **decorative heading** in `.md` (the `<!-- licentia-heading -->` marker) | `npm run sync-doc-images` | Expands the marker into the styled span. |
| Added images anywhere else | `npm run optimize-images` | Lossless PNG pass + key WEBP re-check (cache-guarded, so nothing is re-compressed twice). |
| Added a page that needs a **share card**, or redrew a wordmark | drop the artwork into `social-cards/`, then `npm run build-social-cards` | Composites it onto the 1200×630 template and writes `static/img/social-cards/<name>.jpg`. Point the page's `image:` at that path. |
| Anything at all, before pushing | `npm ci && npm run typecheck && npm run build` | The same things CI will run — **including the `npm ci`**. A `node_modules` that has drifted from `package-lock.json` builds against different versions than CI does, so a local pass proves nothing. This has passed a build locally and failed it on CI. |
| Added or reordered a **guide / FAQ page** | update that section's `index.md` cards **and** `sidebars.ts` | The sidebar and the card grid are maintained separately; they must contain the same pages in the same order. **CI fails otherwise** (`npm run check-doc-links`). |
| Just curious about dead or unprocessed assets | `npm run check-assets` | Lists orphan images and screenshots that still need optimizing. |

Nothing needs running for: pure text edits, CSS-only changes, or `.tsx` images whose `width` / `height`
you set by hand.

### 🚦 What CI enforces

Both workflows — `test-deploy.yml` on pull requests and `deploy.yml` on `main` — run these in order:

1. **Typecheck** (`tsc`).
2. **Image cache integrity** — fails if `.image-opt-cache.json` is not valid JSON. It has been
   corrupted by a bad merge before, and a silently-discarded cache would re-compress every lossy
   asset, so this is deliberately loud.
3. **Doc image dimensions in sync** — runs `sync-doc-images` and fails if it changed anything,
   i.e. someone added an image without recording its dimensions.
4. **Doc index links** — fails if a page in `docs/guides` or `docs/faqs` exists but nothing on that
   section's `index.md` links to it (or a card points at a page that's gone), **and** if the card
   order doesn't match that section's `items` array in `sidebars.ts`. The Pandora guide shipped in
   the sidebar but never appeared on `/guides`, and the cards drifted out of order; this catches
   both. Mark a page `unlisted: true` in its frontmatter to exclude it deliberately. If the
   sidebar key can't be read it warns rather than failing, so restructuring `sidebars.ts` won't
   block an unrelated build.
5. **Admonitions render** — fails on a malformed `:::` block, which Docusaurus would otherwise
   print as literal text.
6. **Social cards built** — every artwork in `social-cards/` has its card (existence only).
7. **Showcase thumbnails** — every screenshot is 16:9, has a thumbnail of the right proportions, and no
   thumbnail is left over. A missing one would not break anything visibly — the strip falls back
   to the full 1920px file — which is exactly why it has to fail here.
8. **Asset hygiene report** — informational only. Orphan images and un-processed screenshots, written
   to the run summary; never fails the build.
9. **Build** (`docusaurus build`).

Every run finishes by writing a status table to the GitHub Actions run summary, and the deploy
workflow adds the live URL.

<div align="center">

## ℹ️ Features

</div>

### 🤖 Main technical features:
- Built with [Docusaurus](https://docusaurus.io/docs) using `Typescript`, `CSS` and `React`
- Images are optimized via cross-platform npm scripts:
    - `npm run optimize-images`
    - `npm run optimize-images:showcase`
- On Github side built and deployed with [actions pipeline](../.github/workflows/deploy.yml)
- [Crawler](https://dashboard.algolia.com/) config for `DocuSearch`:
    <details>

    ```json
    new Crawler({
        appId: "my_appid",
        apiKey: "my_key",
        indexPrefix: "",
        rateLimit: 8,
        maxDepth: 10,
        maxUrls: 100,
        schedule: "on sunday",
        startUrls: ["https://licentia.quest"],
        sitemaps: ["https://licentia.quest/sitemap.xml"],
        discoveryPatterns: ["https://licentia.quest/**"],
        ignoreCanonicalTo: true,
        renderJavaScript: false,
        actions: [
            {
            indexName: "licentia_next_crawler",
            pathsToMatch: ["https://licentia.quest/**"],
            recordExtractor: ({ $, helpers }) => {
                /* 0) Normalize URL (optional but reduces 301 noise) */
                // no-op here; use the config tweaks below for redirects

                /* 1) Remove non-content chrome */
                $(
                ".navbar, footer, .theme-doc-footer, .theme-edit-this-page, .table-of-contents, .hash-link",
                ).remove();

                /* 2) Turn any image-only (or image-first) headings into real text for indexing */
                const scope = ".theme-doc-markdown";
                const headingSel = `${scope} h1, ${scope} h2, ${scope} h3, ${scope} h4, ${scope} h5, ${scope} h6`;

                $(headingSel).each((_, el) => {
                const $el = $(el);

                // Compute visible text *excluding* children
                const textOnly = $el.clone().children().remove().end().text().trim();

                if (!textOnly) {
                    // If empty, try to pull an img alt (even if nested)
                    const alt = $el.find("img[alt]").first().attr("alt");
                    if (alt && alt.trim()) {
                    // Prepend a pure text node so heading has actual text content
                    // (safe: this DOM exists only inside the crawler)
                    $el.prepend(alt.trim() + " ");
                    }
                }
                });

                /* 3) Compute lvl0 (top nav / active section) */
                const lvl0 =
                $(
                    ".menu__link.menu__link--sublist.menu__link--active, .navbar__link--active",
                )
                    .last()
                    .text() || "Documentation";

                /* 4) Extract records (scoped) */
                const records = helpers.docsearch({
                recordProps: {
                    lvl0: { selectors: "", defaultValue: lvl0 },
                    lvl1: [`${scope} h1`, "header h1", ".hero__title"],
                    lvl2: `${scope} h2`,
                    lvl3: `${scope} h3`,
                    lvl4: `${scope} h4`,
                    lvl5: `${scope} h5`,
                    lvl6: `${scope} h6`,
                    content: `${scope} p, ${scope} li, ${scope} td:last-child`,
                },
                aggregateContent: true,
                recordVersion: "v3",
                });

                /* 5) Drop truly empty records to avoid the “blank” results */
                return records.filter(
                (r) =>
                    (r.content && r.content.trim().length > 0) ||
                    (r.hierarchy &&
                    Object.values(r.hierarchy).some((v) => v && v.trim())),
                );
            },
            },
        ],
        safetyChecks: { beforeIndexPublishing: { maxLostRecordsPercentage: 30 } },
        initialIndexSettings: {
            licentia_next_crawler: {
            attributesForFaceting: [
                "type",
                "lang",
                "language",
                "version",
                "docusaurus_tag",
            ],
            attributesToRetrieve: [
                "hierarchy",
                "content",
                "anchor",
                "url",
                "url_without_anchor",
                "type",
            ],
            attributesToHighlight: ["hierarchy", "content"],
            attributesToSnippet: ["content:10"],
            camelCaseAttributes: ["hierarchy", "content"],
            searchableAttributes: [
                "unordered(hierarchy.lvl0)",
                "unordered(hierarchy.lvl1)",
                "unordered(hierarchy.lvl2)",
                "unordered(hierarchy.lvl3)",
                "unordered(hierarchy.lvl4)",
                "unordered(hierarchy.lvl5)",
                "unordered(hierarchy.lvl6)",
                "content",
            ],
            distinct: true,
            attributeForDistinct: "url",
            customRanking: [
                "desc(weight.pageRank)",
                "desc(weight.level)",
                "asc(weight.position)",
            ],
            ranking: [
                "words",
                "filters",
                "typo",
                "attribute",
                "proximity",
                "exact",
                "custom",
            ],
            highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
            highlightPostTag: "</span>",
            minWordSizefor1Typo: 3,
            minWordSizefor2Typos: 7,
            allowTyposOnNumericTokens: false,
            minProximity: 1,
            ignorePlurals: true,
            advancedSyntax: true,
            attributeCriteriaComputedByMinProximity: true,
            removeWordsIfNoResults: "allOptional",
            },
        },
    });
    ```

    </details>

### 🎨 Styling features
- Primary golden color is #facb35;
- Decorative headings use the bundled `Cloister Black` font from `static/fonts/`.
- Decorative headings are now real text styled in CSS:
    - dark fill
    - gold outline
    - subtle underglow
- Dark/light theme that respects user system settings for color mode.

### 🖼️ Image optimization workflow

- Showcase screenshots directory: `static/img/pages/main/screenshots`
  - Add new files with any names/extensions (`.png/.jpg/.jpeg/.webp`).
  - Run:
    ```bash
    npm run optimize-images:showcase
    ```
  - The script will:
    - convert new files to `webp` (`quality=85`, centre-cropped to **16:9**, then resized to a
      **max width of `1920`**; images are never upscaled),
    - rename them to sequential names like `licentia-next-screenshot-4.webp`,
      `licentia-next-screenshot-5.webp`, etc., continuing from the highest existing number
      (the legacy `sN.webp` names are still recognised when counting),
    - remove the original dropped files after conversion,
    - write a **thumbnail** for every screenshot into `screenshots/thumbs/` (see below).
  - Once renamed, a screenshot is **never re-compressed**: the rename is what marks it as done,
    because anything already matching the canonical name is skipped as a candidate. This is what
    keeps repeated runs from degrading quality (WEBP is lossy, so each re-encode would lose a
    little more).
  - Screenshots are picked up automatically by [`src/data/screenshots.ts`](./src/data/screenshots.ts),
    which bulk-loads the whole directory. **No code change is needed after adding one.**
  - Aspect ratio: contributors send all sorts (16:9, 16:10, ...). **Every screenshot is centre-cropped
    to 16:9** (the widest 16:9 box that fits), both when it is dropped in and, for a file that already
    has its canonical name but the wrong shape, on the next run — only those files are re-encoded.
    Why: clicking "next" through the gallery should not make the picture change size and shape
    from one shot to the next. The strip and the media grid showed 16:9 crops anyway.
  - Preview only (no file changes):
    ```bash
    npm run optimize-images:showcase:dry-run
    ```
  - **Thumbnails** (`screenshots/thumbs/<name>-thumb.webp`, 768px wide, same proportions as the
    screenshot, ~29 KB each against ~219 KB for the full file):
    - The homepage strip shows these instead of the full 1920px files. A strip tile is 256×144 on a
      phone (768×432 real pixels at 3×) and 320×180 on desktop (640×360 at 2×), so 768 wide covers
      both. Across all 51 screenshots that is ~1.5 MB to download instead of ~11 MB, and roughly
      1.3 MB of memory per decoded image instead of ~7.9 MB.
    - Clicking a tile opens the **full** image: each tile names it in `data-zoom-src`. The zoom
      opens on the thumbnail at the size the full image will have, fetches and decodes the full
      file behind it, and swaps it in when ready — no size jump, no blank frame. Nothing is shown
      until something can actually be painted (a tile clicked before it loaded no longer flashes an
      empty glowing box), a picture already opened this visit goes straight to the full file, and a
      small gold spinner fades in over the picture only if loading lasts past ~280ms.
    - Generated whenever missing, **and rebuilt if a screenshot is replaced in place** (judged by the
      screenshot's content hash in `.image-opt-cache.json`). A thumbnail whose screenshot is deleted
      is removed on the next run.
    - Thumbnails keep the screenshot's own proportions (16:9, since the screenshot is), because the
      zoom swaps one for the other: a different shape would make the picture jump.
    - Kept out of search engines by `static/robots.txt` (`Disallow: /assets/images/*-thumb-*.webp`),
      so image search indexes the full-size files, which `/media` still shows. The two smallest
      thumbnails (under ~10 KB) are inlined into the JavaScript by the bundler and have no URL at all.

- Team avatars directory: `static/img/pages/team`
  - Drop in a new avatar named exactly after the existing one (e.g. `Vermillion.png` to replace
    `Vermillion.webp`) in `.png/.jpg/.jpeg/.gif/.webp`, then run:
    ```bash
    npm run optimize-images
    ```
  - The script converts it to `webp` (`quality=82`), fits it inside `320x320` without upscaling,
    **overwrites the matching `.webp`, and deletes the file you dropped in**. Animated GIFs are
    handled too.
  - Keeping the output name identical means `src/pages/team.tsx` needs no edit -- it imports the
    `.webp` by name, and the content hash in the built filename changes automatically so browsers
    pick up the new image.
  - Only the resulting `.webp` is recorded in the cache, never the file you dropped in, so
    re-dropping the same source always converts again rather than being silently skipped.

- Full optimization pass:
    ```bash
    npm run optimize-images
    ```
  - Runs the same showcase step above, then:
    - applies safe lossless PNG optimization to:
    - `static/img/pages/**`
    - `docs/**`
    - checks key existing WEBP files and re-encodes only if output is smaller:
      - `static/img/licentia-next-hero-logo.webp`
      - `static/img/licentia-next-logo-footer.webp`
      - `static/img/licentia-next-logo-navbar.webp`
      - `static/img/pages/main/licentia-next-social-card-bg-dark.webp`
      - `static/img/pages/main/licentia-next-social-card-bg-light.webp`
  - Preview only (no file changes):
    ```bash
    npm run optimize-images:dry-run
    ```

- Asset hygiene report:
    ```bash
    npm run check-assets
    ```
  - Lists **orphan images** (files under `static/` or `docs/` that nothing references) and any
    **showcase screenshots still carrying their drop-in names** (i.e. `optimize-images:showcase`
    hasn't been run yet).
  - Runs automatically in both workflows as an *informational* step and writes its findings to the
    GitHub run summary. It never fails a build; add `--strict` if you ever want it to.

- Notes:
  - Existing WEBP files are only rewritten when re-encoding results in a smaller file.
  - The script keeps a cache file at `.image-opt-cache.json` to avoid reprocessing unchanged files on later runs.
  - Use `node ./tools/optimize-images.mjs --force` if you intentionally want to ignore cache and re-check everything.
  - On every real run the script prunes cache entries whose file no longer exists (deleted images).
    If more than half the entries are missing it refuses to prune and warns instead, on the
    assumption that the working tree is incomplete rather than the images being genuinely gone --
    pruning in that situation would make the next run re-encode every lossy asset.
  - External image URLs are untouched.

### 🔗 Social cards

The image a link shows in Discord, on X, or in a Facebook preview. Every page has one, and they
are **generated**, not drawn:

```bash
npm run build-social-cards           # rebuild every card
npm run build-social-cards -- --check  # every artwork has a card? (builds nothing)
```

- **Artwork** — the bare wordmark for a page — lives in [`social-cards/`](./social-cards). That
  folder is source material: it is never served, and `check-assets` deliberately doesn't scan it.
- **Cards** are written to `static/img/social-cards/<same-name>.jpg`, always **1200×630**.
- A page points at its card with an absolute path, `image: /img/social-cards/<name>-social.jpg`
  in the frontmatter, or a `SOCIAL_IMAGE` constant in a `.tsx` page. The site-wide default is
  `themeConfig.image` in `docusaurus.config.ts`.

**Why the wordmarks aren't the cards.** They used to be, and two things were wrong with that.
They are transparent PNGs with black lettering, so Facebook and X — which flatten onto white —
looked right while **Discord composited them onto its own dark grey and the lettering vanished**,
leaving only the gold outline. And their aspect ratios ran from 1.56:1 to 4.78:1, where every
platform wants 1.91:1 (Facebook: stay "as close to 1.91:1 as possible to display the full image
without any cropping"; X drops to a small card below 300×157). The generated card fixes both at
once — the site's own hero backdrop blurred and dimmed, the hero's radial veil, a gold hairline,
and the artwork centred inside a safe margin — so a card reads identically on any background and
looks like the page it opens.

JPEG rather than PNG because the background is a photograph: ~115 KB against ~210 KB for a
palette PNG nobody could tell apart. To change the template, edit the constants at the top of
[`tools/build-social-cards.mjs`](./tools/build-social-cards.mjs) and re-run — all 23 cards are
rebuilt from one backdrop.

**One piece of artwork sizes differently**, via the `MARGIN_OVERRIDES` table in that file. The
default margins assume a wordmark — wide and short, so width runs out first and the vertical
margin never binds. The site's own card is the winged logo, which is nearly square: height binds
instead, and the default margins left it at 36% of the card width with empty space all round. It
gets a 40px vertical margin of its own. Add an entry there if you ever drop in another
non-wordmark; the tool warns about entries whose artwork has gone.

### Image and heading pipeline

There are now two different rendering paths to keep in mind:
- decorative headings
- regular images

#### 1. Decorative headings in `.md` / `.mdx` pages

Preferred authoring for new decorative headings:

```md
# FAQs
<!-- licentia-heading -->

## Accounts
<!-- licentia-heading -->
```

What happens at build time:
- [`tools/sync-doc-image-dimensions.mjs`](./tools/sync-doc-image-dimensions.mjs) converts the marker into an inline `<span className="licentia-heading ...">...</span>`
- [`src/css/custom.css`](./src/css/custom.css) applies the `Cloister Black` font, gold outline, and responsive sizing

Important notes:
- decorative `h1` and `h2` headings stay real headings, so anchors and the right-hand table of contents still work
- because they are text now, they no longer have image sizing / stretching / CLS problems
- if a heading should stay normal and not use the decorative style, just write a normal heading without the marker comment
- run `npm run sync-doc-images` after adding or changing a decorative markdown heading so the source is normalized before build

#### 2. Regular images in `.md` / `.mdx` pages

Use `DocImage` for authored screenshots and other local images:

```mdx
<DocImage
  src={require('./img/lod_generation_guide/1_2_xlodgen_settings.png').default}
  alt="Configure xLODGen executable paths in MO2"
  style={{ maxHeight: 150 }}
/>
```

Rules:
- prefer `DocImage` over raw `<img>` in markdown content
- `maxHeight` is the preferred way to keep screenshots compact
- after adding or changing a local `DocImage`, run:

```bash
npm run sync-doc-images
```

What happens:
- [`tools/sync-doc-image-dimensions.mjs`](./tools/sync-doc-image-dimensions.mjs) reads the real file dimensions and writes `width={...}` / `height={...}` into the source
- [`src/theme/MDXComponents.tsx`](./src/theme/MDXComponents.tsx) uses those values to reserve layout space before the image loads
- if a `DocImage` uses `maxHeight`, the runtime wrapper also computes the matching rendered width so the image keeps its correct proportions

For plain markdown image syntax that is not converted to `DocImage`, [`plugins/remark-image-dimensions.cjs`](./plugins/remark-image-dimensions.cjs) still injects intrinsic `width` / `height` during build.

#### 3. Decorative headings in `.tsx` pages

Use normal text, not heading images.

Example:

```tsx
<h1 className="licentia-heading licentia-heading--h1">Media</h1>
```

Rules:
- use `licentia-heading--h1` for page-level headings
- use `licentia-heading--h2` for normal section headings
- use `licentia-heading--display` for large homepage-style `h2` sections like `About`, `Features`, and `Showcase`

#### Recommended workflow

When adding a new decorative heading to a markdown page:

1. Write a normal heading.
2. Add `<!-- licentia-heading -->` directly under it.
3. Run:
   ```bash
   npm run sync-doc-images
   ```
4. Run:
   ```bash
   npm run build
   ```
5. Verify the heading looks correct.

When adding a new regular screenshot to a markdown page:

1. Add the image file.
2. Author it as `<DocImage ... />`.
3. Optionally add `style={{ maxHeight: ... }}` if you want it smaller on-page.
4. Run:
   ```bash
   npm run sync-doc-images
   ```
5. Run:
   ```bash
   npm run build
   ```

When adding a new decorative heading in a `.tsx` page:

1. Use real text with `licentia-heading` classes.
2. Pick `licentia-heading--h1`, `licentia-heading--h2`, or `licentia-heading--display`.
3. Keep the heading as real semantic text.
4. Run:
   ```bash
   npm run build
   ```

When you do **not** need to run the sync script:
- pure text edits
- CSS-only changes
- decorative heading changes
- `.tsx` images where you edited `width` / `height` manually in code

### 🧑‍💻 How to run locally

1. Make sure you have `git` and `node` installed.
   - For **MacOS/Linux**:

        Open up your terminal and run the following commands:

        ```bash
        # Download and install Homebrew
        curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash

        # Download and install Node.js:
        brew install node

        # Verify the Node.js version:
        node -v # Should print the version

        # Verify npm version:
        npm -v # Should print the version
        ```

        `Git` is usually pre-installed on MacOS/Linux.
    - For **Windows**:

        Open up your Powershell with "Run as Administrator" selected and run the following commands:

        ```powershell
        # Check if your execution policy allows running scripts:
        Get-ExecutionPolicy # Should print "RemoteSigned" or "Unrestricted"

        # If it's restricted, do this:
        Set-ExecutionPolicy RemoteSigned
        # and then install Chocolatey like this:
        Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

        # If it's not restricted - download and install Chocolatey normally:
        powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

        # Restart Powershell to apply PATH changes, then run the following commands:

        # Verify Chocolatey installation:
        choco --version # Should print the version

        # Download and install Git and Node.js:
        choco install git nodejs

        # Verify the Node.js version:
        node -v # Should print the version

        # Verify npm version:
        npm -v # Should print the version

        # Verify git version:
        git --version # Should print the version

        # Move to your user directory (or any other directory you want to clone the repo in):
        cd ~
        ```
2. Clone the repository:
    ```bash
    git clone https://github.com/akzar-dev/licentia.git
    ```
    It would be cloned in the `licentia` folder in your current directory.
3. *(Optional)* If you want to work on any of the development branches, make sure to checkout to the right one:
    ```bash
    git checkout <branch_name>
    ```
4. Go inside `licentia\website` folder:
    ```bash
    cd licentia
    cd website
    ```
5. Run the following commands to install packages and build the project for the first time:
    ```bash
    npm install
    npm run build
    ```
6. To run the project locally:
    ```bash
    npm start
    ```
    The project would be available at `localhost:3000`

    You can make changes on the go now, and they'd be rendered immediately.
