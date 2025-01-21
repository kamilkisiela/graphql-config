/* eslint-disable react-hooks/rules-of-hooks */
/* eslint sort-keys: error */
import { defineConfig, Giscus, PRODUCTS, useTheme } from '@theguild/components';
import { useRouter } from 'next/router';

export default defineConfig({
  description: 'One GraphQL configuration',
  docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-config/tree/master/website', // base URL for the docs repository
  // @ts-expect-error - Typings are wrong
  logo: PRODUCTS.CONFIG.logo({ className: 'w-8' }),
  main({ children }) {
    const { resolvedTheme } = useTheme();
    const { route } = useRouter();

    const comments = route !== '/' && (
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
    return (
      <>
        {children}
        {comments}
      </>
    );
  },
  websiteName: 'GraphQL-Config',
});
