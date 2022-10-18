/* eslint-disable react-hooks/rules-of-hooks */
import { ConfigLogo, defineConfig, Giscus, useTheme } from '@theguild/components';
import { useRouter } from 'next/router';

const SITE_NAME = 'GraphQL Config';

export default defineConfig({
  titleSuffix: ` – ${SITE_NAME}`,
  docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-config/tree/master/website', // base URL for the docs repository
  logo: (
    <>
      <ConfigLogo className="mr-1.5 h-9 w-9" />
      <div>
        <h1 className="md:text-md text-sm font-medium">{SITE_NAME}</h1>
        <h2 className="hidden text-xs sm:!block">One configuration for all your GraphQL tools</h2>
      </div>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="description" content={`${SITE_NAME}: documentation`} />
      <meta name="og:title" content={`${SITE_NAME}: documentation`} />
    </>
  ),
  main: {
    extraContent() {
      const { resolvedTheme } = useTheme();
      const { route } = useRouter();

      if (route === '/') {
        return null;
      }
      return (
        <Giscus
          // ensure giscus is reloaded when client side route is changed
          key={route}
          repo="kamilkisiela/graphql-config"
          repoId="MDEwOlJlcG9zaXRvcnk2NDQ3MDQzNg=="
          category="Docs Discussions"
          categoryId="DIC_kwDOA9e9pM4CSDVk"
          mapping="pathname"
          theme={resolvedTheme}
        />
      );
    },
  },
});
