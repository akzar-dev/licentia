import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Licentia NEXT',
  tagline: 'Home 🏠',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Licentia NEXT - Official Website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'application-name',
        content: 'Licentia NEXT - Official Website',
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
        name: 'Licentia NEXT - Official Website',
        alternateName: 'Licentia NEXT',
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
        url: 'https://licentia.quest/',
        logo: 'https://licentia.quest/img/logo.png',
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
    'docusaurus-plugin-image-zoom',
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
    image: 'img/licentia-social-card.webp',
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
        src: 'img/logo-navbar.png',
      },
      items: [
        {
          to: '/welcome',
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
          href: 'https://github.com/akzar-dev/licentia',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      // when commented out, follows the global color mode
      // style: 'dark',
      logo: {
        alt: 'Licentia NEXT Logo',
        src: 'img/logo.png',
        height: 48,
      },
      links: [
        {
          label: 'Discord',
          href: 'https://discord.gg/vermishub',
        },
        {
          label: 'Nexus Mods',
          href: 'https://www.nexusmods.com/skyrimspecialedition/mods/132744',
        },
        {
          label: 'Load Order Library',
          href: 'https://loadorderlibrary.com/lists/licentia-next',
        },
        {
          label: 'Buy me a coffee',
          href: 'https://ko-fi.com/akzar',
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/akzar-dev">akzar</a> and <a href="/team">Licentia team</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    zoom: {
      selector: 'img.zoomable',
      background: {
        light: 'rgba(255, 255, 255, 0.8)',
        dark: 'rgba(50, 50, 50, 0.7)'
      },
      config: {
        margin: 12,
      }
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
