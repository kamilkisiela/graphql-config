/* eslint-disable react-hooks/rules-of-hooks */
/* eslint sort-keys: error */
import { defineConfig, Giscus, PRODUCTS, useTheme } from '@theguild/components';
import { useRouter } from 'next/router';

export default defineConfig({
  docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-config/tree/master/website', // base URL for the docs repository
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
  websiteName: 'CONFIG',
  description: PRODUCTS.CONFIG.title,
  logo: PRODUCTS.CONFIG.logo,
});
