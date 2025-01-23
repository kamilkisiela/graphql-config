import {
  CallToAction,
  GitHubIcon,
  Hero,
  StitchingLogo,
  ToolsAndLibrariesCards,
} from '@theguild/components';
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
        heading="Schema Stitching"
        text="Automatically stitch multiple schemas together into one larger API in a simple, fast and powerful way."
        logo={<StitchingLogo />}
        checkmarks={['Fully open source', 'No vendor lock']}
        // Original logo has some issues with overflowing <path> elements
        className="[&_.-z-10>svg]:fill-[#B0CBD1]"
      >
        <CallToAction variant="primary-inverted" href="/docs">
          Get started
        </CallToAction>
        <CallToAction variant="secondary-inverted" href="/handbook">
          Handbook
        </CallToAction>
        <CallToAction variant="tertiary" href="https://github.com/ardatan/schema-stitching">
          <GitHubIcon className="size-6" />
          GitHub
        </CallToAction>
      </Hero>
      <ToolsAndLibrariesCards className="mx-4 mt-6 md:mx-6" />
    </div>
  );
}
