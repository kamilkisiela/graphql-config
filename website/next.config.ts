import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  redirects: async () =>
    Object.entries({
      '/legacy': '/docs/migration',
      '/docs/user/user-introduction': '/docs',
      '/docs/user/user-installation': '/docs/installation',
      '/docs/recipes/migration': '/docs/migration',
      '/docs/user/user-documents': 'docs/user/documents',
      '/docs/library/api-graphql-config': '/docs/library/graphql-config',
      '/docs/library/api-graphql-project-config': '/docs/library/graphql-project-config',
      '/docs/library/author-extensions': '/docs/library/extensions',
      '/docs/library/author-load-config': '/docs/library/load-config',
      '/docs/library/author-loaders': '/docs/library/loaders',
      '/usage': '/docs/user/usage',
      '/docs/user/user-usage': '/docs/user/usage',
      '/docs/user': '/docs/user/usage',
      '/docs/introduction': '/docs',
      '/extensions': '/docs/library/extensions',
      '/introduction': '/docs',
      '/schema': '/docs/user/schema',
      '/docs/schema': '/docs/user/schema',
      '/load-config': '/docs/library/load-config',
      '/docs/user/user-schema': '/docs/user/schema',
      '/documents': '/docs/user/documents',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
  output: 'export',
});
