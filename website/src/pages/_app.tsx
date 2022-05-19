import { FC } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';
import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { handlePushRoute, CombinedThemeProvider, DocsPage, AppSeoProps, useGoogleAnalytics } from '@guild-docs/client';
import { Header, Subheader, FooterExtended } from '@theguild/components';
import '../../public/style.css';

import '@algolia/autocomplete-theme-classic';
import '@theguild/components/dist/static/css/SearchBarV2.css';

const styles: typeof chakraTheme['styles'] = {
  global: (props) => ({
    body: {
      bg: mode('white', 'gray.850')(props),
    },
  }),
};

const accentColor = '#1cc8ee';

const theme = extendTheme({
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      850: '#1b1b1b',
      900: '#171717',
    },
    accentColor,
  },
  fonts: {
    heading: 'TGCFont, sans-serif',
    body: 'TGCFont, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles,
});

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
const mdxRoutes = { data: serializedMdx && JSON.parse(serializedMdx) };

const AppContent: FC<AppProps> = (appProps) => {
  const { Component, pageProps, router } = appProps;
  const isDocs = router.asPath.startsWith('/docs');
  const googleAnalytics = useGoogleAnalytics({
    router,
    trackingId: 'G-JSN4LT7S7V',
  });

  return (
    <>
      <Script async src="https://the-guild.dev/static/crisp.js" />
      <Header accentColor={accentColor} activeLink="/open-source" themeSwitch searchBarProps={{ version: 'v2' }} />
      <Subheader
        activeLink={router.asPath}
        product={{
          title: 'GraphQL Config',
          description: '',
          image: {
            src: '/assets/subheader-logo.svg',
            alt: 'Docs',
          },
          onClick: (e) => handlePushRoute('/', e),
        }}
        links={[
          {
            children: 'Home',
            title: 'Read about GraphQL Config',
            href: '/',
            onClick: (e) => handlePushRoute('/', e),
          },
          {
            children: 'GitHub',
            title: "Head to the project's GitHub",
            href: 'https://github.com/kamilkisiela/graphql-config',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]}
        cta={{
          children: 'Get Started',
          title: 'View GraphQL Config Docs',
          href: '/docs/user/user-introduction',
          onClick: (e) => handlePushRoute('/docs/user/user-introduction', e),
        }}
      />
      <Script {...googleAnalytics.loadScriptProps} />
      <Script {...googleAnalytics.configScriptProps} />
      {isDocs ? (
        <DocsPage appProps={appProps} accentColor={accentColor} mdxRoutes={mdxRoutes} />
      ) : (
        <Component {...pageProps} />
      )}
      <FooterExtended />
    </>
  );
};

const AppContentWrapper = appWithTranslation(function TranslatedApp(appProps) {
  return <AppContent {...appProps} />;
});

const defaultSeo: AppSeoProps = {
  title: 'GraphQL Config',
  description: 'GraphQL Config',
  logo: {
    url: 'https://graphql-config.com/assets/subheader-logo.png',
    width: 50,
    height: 54,
  },
};

const App: FC<AppProps> = (appProps) => {
  return (
    <CombinedThemeProvider theme={theme} accentColor={accentColor} defaultSeo={defaultSeo}>
      <AppContentWrapper {...appProps} />
    </CombinedThemeProvider>
  );
};

export default App;
