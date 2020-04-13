import {
  cosmiconfig,
  cosmiconfigSync,
  Loader,
  defaultLoaders,
} from 'cosmiconfig';

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
];

export function isLegacyConfig(filepath: string): boolean {
  filepath = filepath.toLowerCase();

  return legacySearchPlaces.some(name => filepath.endsWith(name));
}

function replaceEnv(content: string) {
  // https://regex101.com/r/k9saS6/2
  // Yes:
  //  ${NAME:DEFAULT}
  //  ${NAME:"DEFAULT"}
  //  ${NAME}
  // Not:
  //  ${NAME:}

  const R = /\$\{([A-Z0-9_]+(\:[^\}]+)?)\}/gi;

  return content.replace(R, (_, result: string) => {
    let [name, value, ...rest] = result.split(':');

    if (value) {
      if (rest && rest.length) {
        value = [value, ...rest].join(':');
      }

      value = value.trim();

      if (value.startsWith(`"`)) {
        value = value.replace(/^\"([^\"]+)\"$/g, '$1');
      } else if (value.startsWith(`'`)) {
        value = value.replace(/^\'([^\']+)\'$/g, '$1');
      }
    }

    return process.env[name] ? String(process.env[name]) : value;
  });
}

function transformContent(content: string): string {
  return replaceEnv(content);
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

export function createCosmiConfigSync(
  moduleName: string,
  {legacy}: {legacy: boolean},
) {
  const options = prepareCosmiconfig(moduleName, {
    legacy,
  });

  return cosmiconfigSync(moduleName, options);
}

function prepareCosmiconfig(moduleName: string, {legacy}: {legacy: boolean}) {
  const loadYaml = createCustomLoader(defaultLoaders['.yaml']);
  const loadJson = createCustomLoader(defaultLoaders['.json']);

  const searchPlaces = [
    `#.config.js`,
    '#.config.json',
    '#.config.yaml',
    '#.config.yml',
    '.#rc',
    '.#rc.js',
    '.#rc.json',
    '.#rc.yml',
    '.#rc.yaml',
  ];

  if (legacy) {
    searchPlaces.push(...legacySearchPlaces);
  }

  // We need to wrap loaders in order to access and transform file content (as string)
  // Cosmiconfig has transform option but at this point config is not a string but an object
  return {
    searchPlaces: searchPlaces.map(place => place.replace('#', moduleName)),
    loaders: {
      '.js': defaultLoaders['.js'],
      '.json': loadJson,
      '.yaml': loadYaml,
      '.yml': loadYaml,
      noExt: loadYaml,
    },
  };
}
