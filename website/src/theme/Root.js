import React from 'react';
import {
  ThemeProvider,
  GlobalStyles,
  Header,
  FooterExtended,
} from '@theguild/components';

// Default implementation, that you can customize
function Root({children}) {
  return (
    <ThemeProvider>
      <GlobalStyles includeFonts />
      <Header
        activeLink={'/open-source'}
        accentColor="var(--ifm-color-primary)"
      />
      {children}
      <FooterExtended
        resources={[
          {
            children: 'Introduction',
            title: 'Get started',
            href: '/introduction',
          },
          {
            children: 'Loading Config',
            title: 'Learn about Loading Config',
            href: '/load-config',
          },
        ]}
      />
    </ThemeProvider>
  );
}

export default Root;
