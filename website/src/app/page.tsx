import {
  CallToAction, ConfigLogo,
  GitHubIcon,
  Hero,
  ToolsAndLibrariesCards
} from "@theguild/components";
import { metadata as rootMetadata } from './layout';

export const metadata = {
  alternates: {
    // to remove leading slash
    canonical: '.',
  },
  openGraph: {
    ...rootMetadata!.openGraph,
    // to remove leading slash
    url: '.',
  },
};

export default function IndexPage() {
  return (
    <div className="flex h-full flex-col mx-auto max-w-[90rem] overflow-hidden">
      <Hero
        heading="GraphQL Config"
        text="One configuration for all your GraphQL tools. The easiest way to configure your development environment with your GraphQL Schema."
        logo={<ConfigLogo />}
        checkmarks={['Fully open source', 'No vendor lock']}
        // Original logo has some issues with overflowing <path> elements
        className="[&_.-z-10>svg]:fill-[#B0CBD1]"
      >
        <CallToAction variant="primary-inverted" href="/docs">
          Get started
        </CallToAction>
        <CallToAction variant="secondary-inverted" href="/changelog">
          Changelog
        </CallToAction>
        <CallToAction variant="tertiary" href="https://github.com/kamilkisiela/graphql-config">
          <GitHubIcon className="size-6" />
          GitHub
        </CallToAction>
      </Hero>
      <ToolsAndLibrariesCards className="mx-4 mt-6 md:mx-6" />
    </div>
  );
}
