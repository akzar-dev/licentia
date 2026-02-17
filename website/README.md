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

### 🎨 Styling features:
- Primary golden color is #facb35;
- Text-images are created with these parameters via `Krita`:
    - text - size 144, font *Cloister Black*;
    - stroke - color #facb35, size 4px;
    - pattern overlay - Blend mode (linear light) - opacity (100%) - pattern (26_brush_marks.png) - scale (50%).
- Dark/light theme that respects user system settings for color mode.

### 🖼️ Image optimization workflow

- Showcase screenshots directory: `static/img/screenshots`
  - Add new files with any names/extensions (`.png/.jpg/.jpeg/.webp`).
  - Run:
    ```bash
    npm run optimize-images:showcase
    ```
  - The script will:
    - convert new files to `webp` (`quality=85`, resized to `1920` width max),
    - rename them to sequential names like `s4.webp`, `s5.webp`, etc. based on existing `sN.webp`,
    - remove the original dropped files after conversion.
  - Preview only (no file changes):
    ```bash
    npm run optimize-images:showcase:dry-run
    ```

- Full optimization pass:
    ```bash
    npm run optimize-images
    ```
  - Runs the same showcase step above, then:
    - applies safe lossless PNG optimization to:
    - `static/img/pages/**`
    - `static/img/logo.png`
    - `docs/**`
    - checks key existing WEBP files and re-encodes only if output is smaller:
      - `static/img/licentia-social-card.webp`
      - `static/img/pages/licentia-social-card-bg.webp`
      - `static/img/pages/licentia-social-card-bg-light.webp`
  - Preview only (no file changes):
    ```bash
    npm run optimize-images:dry-run
    ```

- Notes:
  - Existing WEBP files are only rewritten when re-encoding results in a smaller file.
  - The script keeps a cache file at `.image-opt-cache.json` to avoid reprocessing unchanged files on later runs.
  - Use `node ./tools/optimize-images.mjs --force` if you intentionally want to ignore cache and re-check everything.
  - External image URLs are untouched.

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