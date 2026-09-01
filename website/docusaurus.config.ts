import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';
import fs from 'fs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// ---------------------------------------------------------------------------
// Maintenance banner
//
// The single source of truth for "can the list be installed right now" is `force_down`
// in the repo-root modlists.json -- the same file that gates installation. Reading it here
// at build time keeps the banner from ever drifting out of sync with the real list state:
// flipping force_down and pushing to main triggers the deploy workflow (it has no path
// filter), which rebuilds the site with the new value.
//
// This THROWS rather than quietly skipping the banner. A missing banner would tell visitors
// the list is installable when it isn't, which is the more harmful failure; a build error is
// caught immediately by CI.
// ---------------------------------------------------------------------------
const LN_MACHINE_URL = 'licentia_next';

function isListForcedDown(): boolean {
  const modlistsPath = path.resolve(__dirname, '..', 'modlists.json');

  let raw: string;
  try {
    raw = fs.readFileSync(modlistsPath, 'utf8');
  } catch (err) {
    throw new Error(
      `[maintenance-banner] Could not read ${modlistsPath}: ${(err as Error).message}`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `[maintenance-banner] ${modlistsPath} is not valid JSON: ${(err as Error).message}`
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `[maintenance-banner] Expected ${modlistsPath} to contain an array of modlists.`
    );
  }

  const entry = parsed.find(
    (m) =>
      !!m && typeof m === 'object' && (m as {links?: {machineURL?: unknown}}).links?.machineURL === LN_MACHINE_URL
  ) as {force_down?: unknown} | undefined;

  if (!entry) {
    throw new Error(
      `[maintenance-banner] No modlist with links.machineURL === "${LN_MACHINE_URL}" in ${modlistsPath}.`
    );
  }

  if (typeof entry.force_down !== 'boolean') {
    throw new Error(
      `[maintenance-banner] Expected a boolean "force_down" on the "${LN_MACHINE_URL}" entry in ` +
        `${modlistsPath}, got ${JSON.stringify(entry.force_down)}.`
    );
  }

  return entry.force_down;
}

const listForcedDown = isListForcedDown();

const config: Config = {
  title: 'Licentia NEXT',
  tagline: 'Ultimate 1-Click NSFW Skyrim AE Modlist 🐉',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Licentia NEXT',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'application-name',
        content: 'Licentia NEXT',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Licentia NEXT',
        alternateName: ['Licentia', 'licentia.quest', 'LN'],
        url: 'https://licentia.quest/',
      }),
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Licentia NEXT',
        alternateName: ['Licentia', 'licentia.quest', 'LN'],
        url: 'https://licentia.quest/',
        logo: 'https://licentia.quest/img/licentia-next-hero-logo.webp',
        sameAs: [
          'https://github.com/akzar-dev/licentia',
          'https://discord.gg/vermishub',
          'https://www.nexusmods.com/skyrimspecialedition/mods/132744',
        ],
      }),
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://licentia.quest',
  baseUrl: '/',

  organizationName: 'akzar-dev',
  projectName: 'licentia',
  deploymentBranch: "gh-pages",

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    path.resolve(__dirname, './plugins/custom-zoom.cjs'),
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          breadcrumbs: false,
          routeBasePath: '/',
          remarkPlugins: [require('./plugins/remark-image-dimensions.cjs')],
          // editUrl:
          //   'https://github.com/akzar-dev/licentia/edit/main/website/',
          // showLastUpdateTime: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/search', '/search/'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/licentia-next-social-card.webp',
    // Shown automatically whenever modlists.json has force_down: true (see isListForcedDown).
    // backgroundColor/textColor are deliberately NOT set: theme-classic applies them as inline
    // styles, which cannot adapt to light/dark. Styled in src/css/custom.css instead.
    ...(listForcedDown
      ? {
          announcementBar: {
            id: 'ln-maintenance',
            content:
              '\u26a0\ufe0f <strong>Licentia NEXT is temporarily not installable</strong> \u2014 we\'re preparing an update. Check <a href="https://discord.gg/vermishub">Discord</a> for announcements.',
            // A safety warning must not be dismissable: dismissal is persisted in localStorage
            // per id, so one stray click would hide it permanently for that visitor.
            isCloseable: false,
          },
        }
      : {}),
    colorMode: {
      // when commented out, follows the user's system color scheme
      // defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      // when commented out, follows the global color mode
      // style: 'dark',
      title: '',
      logo: {
        alt: 'Licentia NEXT Logo',
        src: 'img/licentia-next-logo-navbar.webp',
        width: 256,
        height: 144,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'installationAndSetupSidebar',
          position: 'left',
          label: 'Install',
        },
        {
          to: '/how-to-update',
          position: 'left',
          label: 'Update',
        },
        {
          to: '/changelog',
          position: 'left',
          label: 'Changelog',
        },
        {
          type: 'docSidebar',
          sidebarId: 'faqsSidebar',
          position: 'left',
          label: 'FAQs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          to: '/media',
          position: 'left',
          label: 'Media',
        },
        {
          label: 'Buy me a coffee',
          href: 'https://ko-fi.com/akzar',
          position: 'right',
          className: 'header-kofi-btn',
        },
        {
          href: 'https://discord.gg/vermishub',
          position: 'right',
          className: 'header-discord-link',
          'aria-label': 'Discord server',
        },
      ],
    },
    footer: {
      // when commented out, follows the global color mode
      // style: 'dark',
      logo: {
        alt: 'Licentia NEXT Logo',
        src: 'img/licentia-next-logo-footer.webp',
        width: 303,
        height: 48,
      },
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/akzar-dev/licentia',
        },
        {
          label: 'Nexus Mods',
          href: 'https://www.nexusmods.com/skyrimspecialedition/mods/132744',
        },
        {
          label: 'Load Order Library',
          href: 'https://loadorderlibrary.com/lists/licentia-next',
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/akzar-dev">akzar</a> and <a href="/team">Licentia team</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'GMPG9FTIQO',
      apiKey: '7635c157f687d0d0a7bbd93c593a5d59',
      indexName: 'licentia_next_crawler',
      contextualSearch: true,
      // Optional: Algolia search parameters
      searchParameters: {},
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
