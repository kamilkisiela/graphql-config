import { withGuildDocs } from 'guild-docs/next.config';

export default withGuildDocs({
  redirects: () =>
    Object.entries({
      '/legacy': '/docs/migration',
      '/docs/user/user-introduction': '/docs',
      '/docs/user/user-installation': '/docs/installation',
      '/docs/recipes/migration': '/docs/migration',
      '/docs/user/user-usage': 'docs/user/usage',
      '/docs/user/user-documents': 'docs/user/documents',
      '/docs/user/user-schema': 'docs/user/schema',
      '/docs/library/api-graphql-config': '/docs/library/graphql-config',
      '/docs/library/api-graphql-project-config': '/docs/library/graphql-project-config',
      '/docs/library/author-extensions': '/docs/library/extensions',
      '/docs/library/author-load-config': '/docs/library/load-config',
      '/docs/library/author-loaders': '/docs/library/loaders',
      '/usage': '/docs/user/usage'
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
