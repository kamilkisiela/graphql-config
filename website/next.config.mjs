import { createRequire } from 'module';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withGuildDocs } from '@guild-docs/server';
import { register } from 'esbuild-register/dist/node.js';
import { i18n } from './next-i18next.config.js';

const require = createRequire(import.meta.url);
register({ extensions: ['.ts', '.tsx'] });

const { getRoutes } = require('./routes.ts'); 

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
  withGuildDocs({
    i18n,
    getRoutes,
    redirects: () => {
      return [
        {
          permanent: true,
          source: '/legacy',
          destination: '/docs/recipes/migration',
        },
      ];
    },
    swcMinify: true, /* experimental SWS minify */
  }),
);
