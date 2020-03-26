module.exports = {
  title: 'GraphQL Config',
  tagline: 'One configuration for all your GraphQL tools',

  url: 'https://graphql-config.com',
  baseUrl: '/',
  favicon: 'img/logo.ico',

  organizationName: 'kamilkisiela',
  projectName: 'graphql-config',

  themeConfig: {
    image: 'img/logo.png',
    navbar: {
      title: 'GraphQL Config',
      logo: {
        alt: 'GraphQL Config Logo',
        src: 'img/logo.png',
      },
      links: [
        {
          to: '/introduction',
          activeBasePath: '',
          label: 'Documentation',
          position: 'right',
        },
        {
          href: 'https://github.com/kamilkisiela/graphql-config',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} The Guild`,
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'introduction',
            },
            {
              label: 'Developer Guide',
              to: 'load-config',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/xud7bH9',
            },
            {
              label: 'Other projects',
              href: 'https://github.com/the-guild-org/Stack',
            },
            {
              label: 'Mailing List',
              href: 'https://upscri.be/19qjhi',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              href: 'https://medium.com/the-guild',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kamilkisiela/graphql-config',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/kamilkisiela',
            },
          ],
        },
      ],
    },
    googleAnalytics: {
      trackingID: 'UA-125180910-4',
    },
  },
  scripts: [
    '/js/light-mode-by-default.js',
    '/js/legacy.js'
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          editUrl:
            'https://github.com/kamilkisiela/graphql-config/edit/master/website/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
