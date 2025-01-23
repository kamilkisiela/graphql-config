import { FC, ReactNode } from 'react';
import {
  ConfigLogo,
  GitHubIcon,
  HiveFooter,
  PaperIcon,
  PencilIcon,
  PRODUCTS,
} from "@theguild/components";
import { getDefaultMetadata, getPageMap, GuildLayout } from '@theguild/components/server';
import '@theguild/components/style.css';

const description = PRODUCTS.CONFIG.title;
const websiteName = 'GraphQL-Config';

export const metadata = getDefaultMetadata({
  description,
  websiteName,
  productName: 'CONFIG',
});

const RootLayout: FC<{
  children: ReactNode;
}> = async ({ children }) => {
  const logo = <ConfigLogo fill="currentColor" className="h-auto w-8" />;
  return (
    <GuildLayout
      htmlProps={{
        // Override nav width
        className: '[&>.light_#h-navmenu-container]:max-w-[1392px]',
      }}
      websiteName={websiteName}
      description={description}
      logo={logo}
      layoutProps={{
        docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-config/tree/master/website',
        footer: (
          <HiveFooter
            logo={
              <div className="flex items-center gap-3">
                {logo}
                <span className="text-2xl/[1.2] font-medium tracking-[-0.16px]">{websiteName}</span>
              </div>
            }
            description={description}
            items={{
              resources: [
                {
                  children: 'Changelog',
                  href: '/changelog',
                  title: 'Changelog',
                },
              ],
            }}
          />
        ),
      }}
      pageMap={await getPageMap()}
      navbarProps={{
        developerMenu: [
          {
            href: '/docs',
            icon: <PaperIcon />,
            children: 'Documentation',
          },
          {
            href: 'https://the-guild.dev/blog',
            icon: <PencilIcon />,
            children: 'Blog',
          },
          {
            href: 'https://github.com/kamilkisiela/graphql-config',
            icon: <GitHubIcon />,
            children: 'GitHub',
          },
        ],
      }}
      lightOnlyPages={['/']}
    >
      {children}
    </GuildLayout>
  );
};

export default RootLayout;
