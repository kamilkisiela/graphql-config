import { cosmiconfig, cosmiconfigSync, Loader, defaultLoaders } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import { loadToml } from 'cosmiconfig-toml-loader';
import { env } from 'string-env-interpolation';

export interface ConfigSearchResult {
  config: any;
  filepath: string;
  isEmpty?: boolean;
}

const legacySearchPlaces = ['.graphqlconfig', '.graphqlconfig.json', '.graphqlconfig.yaml', '.graphqlconfig.yml'];

export function isLegacyConfig(filepath: string): boolean {
  filepath = filepath.toLowerCase();

  return legacySearchPlaces.some((name) => filepath.endsWith(name));
}

function transformContent(content: string): string {
  return env(content);
}

const createCustomLoader = (loader: Loader): Loader => {
  return (filepath, content) => {
    return loader(filepath, transformContent(content));
  };
};

export function createCosmiConfig(
  moduleName: string,
  {
    legacy,
  }: {
    legacy: boolean;
  },
) {
  const options = prepareCosmiconfig(moduleName, {
    legacy,
  });

  return cosmiconfig(moduleName, options);
}

export function createCosmiConfigSync(moduleName: string, { legacy }: { legacy: boolean }) {
  const options = prepareCosmiconfig(moduleName, { legacy });

  return cosmiconfigSync(moduleName, options);
}

function prepareCosmiconfig(moduleName: string, { legacy }: { legacy: boolean }) {
  const loadYaml = createCustomLoader(defaultLoaders['.yaml']);
  const loadTomlCustom = createCustomLoader(loadToml);
  const loadJson = createCustomLoader(defaultLoaders['.json']);

  const searchPlaces = [
    '#.config.ts',
    '#.config.js',
    '#.config.cjs',
    '#.config.json',
    '#.config.yaml',
    '#.config.yml',
    '#.config.toml',
    '.#rc',
    '.#rc.ts',
    '.#rc.js',
    '.#rc.cjs',
    '.#rc.json',
    '.#rc.yml',
    '.#rc.yaml',
    '.#rc.toml',
    'package.json',
  ];

  if (legacy) {
    searchPlaces.push(...legacySearchPlaces);
  }

  // We need to wrap loaders in order to access and transform file content (as string)
  // Cosmiconfig has transform option but at this point config is not a string but an object
  return {
    searchPlaces: searchPlaces.map((place) => place.replace('#', moduleName)),
    loaders: {
      '.ts': TypeScriptLoader(),
      '.js': defaultLoaders['.js'],
      '.json': loadJson,
      '.yaml': loadYaml,
      '.yml': loadYaml,
      '.toml': loadTomlCustom,
      noExt: loadYaml,
    },
  };
}
