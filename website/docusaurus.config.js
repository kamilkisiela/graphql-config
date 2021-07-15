module.exports = {
  title: 'GraphQL Config',
  tagline: 'One configuration for all your GraphQL tools',

  url: 'https://graphql-config.com',
  baseUrl: '/',
  favicon: 'img/logo.ico',

  organizationName: 'kamilkisiela',
  projectName: 'graphql-config',

  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    sidebarCollapsible: false,
    image: 'img/logo.png',
    navbar: {
      title: 'GraphQL Config',
      logo: {
        alt: 'GraphQL Config Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/introduction',
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
    googleAnalytics: {
      trackingID: 'UA-125180910-4',
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
  },
  scripts: [
    '/js/light-mode-by-default.js',
    '/js/legacy.js',
    'https://the-guild.dev/static/crisp.js',
  ],
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/kamilkisiela/graphql-config/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  onBrokenLinks: 'error',
  onBrokenMarkdownLinks: 'error',
};
