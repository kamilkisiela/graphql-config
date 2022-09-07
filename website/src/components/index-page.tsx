import { FeatureList, HeroGradient, NPMBadge } from '@theguild/components';
import { handlePushRoute } from 'guild-docs';
import { ReactElement } from 'react';

export function IndexPage(): ReactElement {
  return (
    <>
      <HeroGradient
        title="GraphQL Config"
        description={
          <>
            One configuration for all your GraphQL tools.
            <br />
            The easiest way to configure your development environment with your GraphQL Schema.
          </>
        }
        link={{
          href: '/docs',
          children: 'Get Started',
          title: 'Get started with GraphQL Config',
          onClick: (e) => handlePushRoute('/docs', e),
        }}
        version={<NPMBadge name="graphql-config" />}
        colors={['#5f6184', '#000']}
      />

      <FeatureList
        items={[
          {
            title: 'Easy To Use',
            description: 'You gain simplicity and a central place to setup your tools.',
            image: {
              src: '',
              loading: 'eager',
              placeholder: 'empty',
            },
          },
          {
            title: 'Fully Configurable',
            description: 'Highly customizable and extensible',
            image: {
              src: '',
              loading: 'eager',
              placeholder: 'empty',
            },
          },
          {
            title: 'Open Source',
            description: 'A standard in the community',
            image: {
              src: '',
              loading: 'eager',
              placeholder: 'empty',
            },
          },
        ]}
      />
    </>
  );
}
