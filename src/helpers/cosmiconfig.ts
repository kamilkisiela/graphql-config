import { cosmiconfig, cosmiconfigSync, Loader, defaultLoaders } from 'cosmiconfig';
import { loadToml } from 'cosmiconfig-toml-loader';
import { env } from 'string-env-interpolation';

export interface ConfigSearchResult {
  config: any;
  filepath: string;
  isEmpty?: boolean;
}

const legacySearchPlaces = [
  '.graphqlconfig',
  '.graphqlconfig.json',
  '.graphqlconfig.yaml',
  '.graphqlconfig.yml',
] as const;

export function isLegacyConfig(filePath: string): boolean {
  filePath = filePath.toLowerCase();
  return legacySearchPlaces.some((name) => filePath.endsWith(name));
}

function transformContent(content: string): string {
  return env(content);
}

function createCustomLoader(loader: Loader): Loader {
  return (filePath, content) => loader(filePath, transformContent(content));
}

export function createCosmiConfig(moduleName: string, legacy: boolean) {
  const options = prepareCosmiconfig(moduleName, legacy);

  return cosmiconfig(moduleName, options);
}

export function createCosmiConfigSync(moduleName: string, legacy: boolean) {
  const options = prepareCosmiconfig(moduleName, legacy);

  return cosmiconfigSync(moduleName, options);
}

const loadTypeScript: Loader = (...args) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TypeScriptLoader } = require('cosmiconfig-typescript-loader');

  return TypeScriptLoader({ transpileOnly: true })(...args);
};

function prepareCosmiconfig(moduleName: string, legacy: boolean) {
  const loadYaml = createCustomLoader(defaultLoaders['.yaml']);

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
      '.ts': loadTypeScript,
      '.js': defaultLoaders['.js'],
      '.json': createCustomLoader(defaultLoaders['.json']),
      '.yaml': loadYaml,
      '.yml': loadYaml,
      '.toml': createCustomLoader(loadToml),
      noExt: loadYaml,
    },
  };
}
