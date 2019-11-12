import {cosmiconfig, Loader, defaultLoaders} from 'cosmiconfig';
import {ConfigNotFoundError, ConfigEmptyError, composeMessage} from './errors';
import {
  IGraphQLConfig,
  IGraphQLProject,
  IGraphQLProjects,
  GraphQLCofigResult,
} from './types';

const cwd = typeof process !== 'undefined' ? process.cwd() : undefined;

export function isMultipleProjectConfig(
  config: IGraphQLConfig,
): config is IGraphQLProjects {
  return typeof (config as IGraphQLProjects).projects === 'object';
}

export function isSingleProjectConfig(
  config: IGraphQLConfig,
): config is IGraphQLProject {
  return typeof (config as IGraphQLProject).schema !== 'undefined';
}

export async function getConfig(filepath: string): Promise<GraphQLCofigResult> {
  if (!filepath) {
    throw new Error(`Defining a file path is required`);
  }

  const result = await createCosmiConfig().load(filepath);

  if (!result) {
    throw new ConfigNotFoundError(
      composeMessage(
        `GraphQL Config file is not available: ${filepath}`,
        `Please check the config filepath.`,
      ),
    );
  }

  if (result.isEmpty) {
    throw new ConfigEmptyError(
      composeMessage(
        `GraphQL Config file is empty.`,
        `Please check ${result.filepath}`,
      ),
    );
  }

  return {
    config: result.config as any,
    filepath: result.filepath,
  };
}

export async function findConfig(
  rootDir: string = cwd!,
): Promise<GraphQLCofigResult> {
  if (!rootDir) {
    throw new Error(`Defining a root directiry is required`);
  }

  const result = await createCosmiConfig().search(rootDir);

  if (!result) {
    throw new ConfigNotFoundError(
      composeMessage(
        `GraphQL Config file is not available in the provided config directory: ${rootDir}`,
        `Please check the config directory.`,
      ),
    );
  }

  if (result.isEmpty) {
    throw new ConfigEmptyError(
      composeMessage(
        `GraphQL Config file is empty.`,
        `Please check ${result.filepath}`,
      ),
    );
  }

  return {
    config: result.config as any,
    filepath: result.filepath,
  };
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

function createCosmiConfig() {
  const loadYaml = createCustomLoader(defaultLoaders['.yaml']);
  const loadJson = createCustomLoader(defaultLoaders['.json']);

  // We need to wrap loaders in order to access and transform file content (as string)
  // Cosmiconfig has transform option but at this point config is not a string but an object
  return cosmiconfig('graphql', {
    loaders: {
      '.js': defaultLoaders['.js'],
      '.json': loadJson,
      '.yaml': loadYaml,
      '.yml': loadYaml,
      noExt: loadYaml,
    },
  });
}

export function flatten<T>(arr: T[]): T extends (infer A)[] ? A[] : T[] {
  return Array.prototype.concat(...arr) as any;
}
