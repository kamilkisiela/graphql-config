import { execSync } from 'child_process';
import { cosmiconfig, cosmiconfigSync, Loader, defaultLoaders } from 'cosmiconfig';
import { createHash } from 'crypto';
import { promises } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';
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

const loadTypeScript: Loader = async (filepath, content) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TypeScriptLoader } = require('cosmiconfig-typescript-loader');
    return TypeScriptLoader({ transpileOnly: true })(filepath, content);
  } catch (err) {
    if (isRequireESMError(err)) {
      const hash = createHash('sha256').update(content).digest('base64url');

      const tempDir = join(tmpdir(), `graphql-config`);

      let inTempDir: string[] = [];
      try {
        inTempDir = await promises.readdir(tempDir);
      } catch (err) {
        if (err.code === 'ENOENT') {
          // tsc will create the directory if it doesn't exist.
        } else {
          throw err;
        }
      }

      let outDir = join(tempDir, new Date().getTime() + '-' + hash);
      const previousOutDir = inTempDir.find((s) => s.endsWith(hash));

      if (previousOutDir) {
        outDir = join(tempDir, previousOutDir);
      } else {
        // We're compiling the file, because ts-node doesn't work perfectly with ESM.
        execSync(`tsc ${filepath} --module commonjs --outDir ${outDir} --skipLibCheck`);
      }

      const newPath = join(outDir, basename(filepath).replace(/\.(m|c)?ts$/, '.js'));
      const config = import(newPath).then((m) => {
        const config = m.default;
        return 'default' in config ? config.default : config;
      });

      // If the cache has more than 10 files, we delete the oldest one.
      await removeOldestDirInCache(inTempDir, tempDir, 10);

      return config;
    }
    throw err;
  }
};

async function removeOldestDirInCache(inTempDir: string[], tempDir: string, cacheLimit: number) {
  if (inTempDir.length > cacheLimit) {
    const oldest = inTempDir.sort((a, b) => {
      const aTime = Number(a.split('-')[0]);
      const bTime = Number(b.split('-')[0]);

      return aTime - bTime;
    })[0];

    await promises.rm(join(tempDir, oldest), { recursive: true, force: true });
  }
}

function isRequireESMError(err: any) {
  return typeof err.stack === 'string' && err.stack.startsWith('Error [ERR_REQUIRE_ESM]:');
}

const loadToml: Loader = (...args) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { loadToml } = require('cosmiconfig-toml-loader');
  return createCustomLoader(loadToml)(...args);
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
      '.mts': loadTypeScript,
      '.cts': loadTypeScript,
      '.js': defaultLoaders['.js'],
      '.json': createCustomLoader(defaultLoaders['.json']),
      '.yaml': loadYaml,
      '.yml': loadYaml,
      '.toml': loadToml,
      noExt: loadYaml,
    },
  };
}
