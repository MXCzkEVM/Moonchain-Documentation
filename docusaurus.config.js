// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Moonchain zkEVM SNARKification',
  tagline: 'We are helping Ethereum implement Beam Chain over the next 5 years and utilizing BeamSnarks as the main algorithm to simplify and redesign Ethereum consensus layer. | Shooting for the Moon 🌙',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://doc.moonchain.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Moonchain', // Usually your GitHub org/user name.
  projectName: 'Moonchain Documentation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
            remarkMath,
          ],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
        },
        blog: {
          showReadingTime: true,
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { converters: ['pnpm'] }],
          ],
          // Please change this to your repo.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [require.resolve('docusaurus-lunr-search')],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      navbar: {
        title: 'Moonchain Docs',
        logo: {
          alt: 'Moonchain Logo',
          src: 'img/Moonchain_Logo.svg',
        },
        items: [
          {
            href: 'https://github.com/MXCzkEVM',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://mxc.instatus.com/',
            label: 'Network Health',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/Moonchain_official',
              },
              {
                label: 'Twitter',
                href: 'https://x.com/Moonchain_com',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Website',
                href: 'https://moonchain.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MXCzkEVM',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MoonX, Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash'],
      },
    }
  ),
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
