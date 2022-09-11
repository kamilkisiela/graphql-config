import { withGuildDocs } from 'guild-docs/next.config';
import { applyUnderscoreRedirects } from 'guild-docs/underscore-redirects';

export default withGuildDocs({
  basePath: process.env.NEXT_BASE_PATH && process.env.NEXT_BASE_PATH !== '' ? process.env.NEXT_BASE_PATH : undefined,
  experimental: {
    images: {
      unoptimized: true, // doesn't work with `next export`
      allowFutureImage: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, meta) {
    applyUnderscoreRedirects(config, meta);

    return config;
  },
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
      '/usage': '/docs/user/usage',
      '/docs/user/user-usage': '/docs',
      '/docs/user': '/docs',
      '/docs/introduction': '/docs',
      '/docs/user/user-schema': '/docs',
      '/docs/user': '/docs',
      '/extensions': '/docs/library/extensions',
      '/introduction': '/docs',
      '/schema': '/docs/user/schema',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
