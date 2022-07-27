import { withGuildDocs } from 'guild-docs/next.config';

export default withGuildDocs({
  redirects: () => [
    {
      source: '/docs/introduction',
      destination: '/docs',
      permanent: true,
    },
    {
      source: '/docs/user/user-introduction',
      destination: '/docs',
      permanent: true,
    },
    {
      source: '/docs/user/user-installation',
      destination: '/docs/installation',
      permanent: true,
    },
    {
      source: '/docs/recipes/migration',
      destination: '/docs/migration',
      permanent: true,
    },
  ],
});
