import Script from 'next/script';
import { AppProps } from 'next/app';
import { FooterExtended, Header, ThemeProvider } from '@theguild/components';
import { useGoogleAnalytics } from 'guild-docs';
import 'guild-docs/style.css';

export default function App({ Component, pageProps, router }: AppProps) {
  const googleAnalytics = useGoogleAnalytics({
    router,
    trackingId: 'G-JSN4LT7S7V',
  });
  return (
    <ThemeProvider>
      <Script async src="https://the-guild.dev/static/crisp.js" />
      <Header accentColor="#1cc8ee" themeSwitch searchBarProps={{ version: 'v2' }} />
      <Script {...googleAnalytics.loadScriptProps} />
      <Script {...googleAnalytics.configScriptProps} />
      <Component {...pageProps} />
      <FooterExtended />
    </ThemeProvider>
  );
}

// const defaultSeo = {
//   title: 'GraphQL Config',
//   description: 'GraphQL Config',
//   logo: {
//     url: 'https://graphql-config.com/assets/subheader-logo.png',
//     width: 50,
//     height: 54,
//   },
// };
