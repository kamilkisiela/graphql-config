import { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { FooterExtended, Header, ThemeProvider } from '@theguild/components';
import 'guild-docs/style.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ThemeProvider>
      <Header accentColor="#1cc8ee" themeSwitch searchBarProps={{ version: 'v2' }} />
      <Component {...pageProps} />
      <FooterExtended />
    </ThemeProvider>
  );
}

// const defaultSeo: AppSeoProps = {
//   title: 'GraphQL Mesh',
//   description: 'GraphQL Mesh Docs',
//   logo: {
//     url: '',
//     width: 50,
//     height: 54,
//   },
// };
