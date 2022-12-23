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

export function isLegacyConfig(filepath: string): boolean {
  filepath = filepath.toLowerCase();

  return legacySearchPlaces.some((name) => filepath.endsWith(name));
}

function transformContent(content: string): string {
  return env(content);
}

function createCustomLoader(loader: Loader): Loader {
  return (filepath, content) => loader(filepath, transformContent(content));
}

export function createCosmiConfig(moduleName: string, legacy: boolean) {
  const options = prepareCosmiconfig(moduleName, legacy);

  return cosmiconfig(moduleName, options);
}

export function createCosmiConfigSync(moduleName: string, legacy: boolean) {
  const options = prepareCosmiconfig(moduleName, legacy);

  return cosmiconfigSync(moduleName, options);
}

function prepareCosmiconfig(moduleName: string, legacy: boolean) {
  const loadYaml = createCustomLoader(defaultLoaders['.yaml']);

  const searchPlaces = [
    '#.config.js',
    '#.config.cjs',
    '#.config.json',
    '#.config.yaml',
    '#.config.yml',
    '#.config.toml',
    '.#rc',
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

  const loaders = {
    '.js': defaultLoaders['.js'],
    '.json': createCustomLoader(defaultLoaders['.json']),
    '.yaml': loadYaml,
    '.yml': loadYaml,
    '.toml': createCustomLoader(loadToml),
    noExt: loadYaml,
  };

  try {
    require.resolve('typescript');
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { TypeScriptLoader } = require('cosmiconfig-typescript-loader');
      loaders['.ts'] = TypeScriptLoader({ transpileOnly: true });
      searchPlaces.push('#.config.ts', '.#rc.ts');
    } catch (error) {
      // eslint-disable-next-line no-console -- print error
      console.error(error);
    }
  } catch {
    /* ignore if typescript is not installed */
  }

  // We need to wrap loaders in order to access and transform file content (as string)
  // Cosmiconfig has transform option but at this point config is not a string but an object
  return {
    searchPlaces: searchPlaces.map((place) => place.replace('#', moduleName)),
    loaders,
  };
}
