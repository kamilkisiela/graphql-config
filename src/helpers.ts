import cosmiconfig from 'cosmiconfig';
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
  // https://regex101.com/r/sRTYo9/1
  // Yes:
  //  ${NAME:DEFAULT}
  //  ${NAME}
  // Not:
  //  ${NAME:}
  const R = /\$\{([A-Z0-9_]+(\:[^\:]+)?)\}/gi;
  return content.replace(R, item => {
    const [name, value] = item[1].split(':');

    return process.env[name] ? String(process.env[name]) : value;
  });
}

function transformContent(content: string): string {
  return replaceEnv(content);
}

const cosmi: any = cosmiconfig;
const createCustomLoader = (
  loader: cosmiconfig.SyncLoader,
): cosmiconfig.LoaderEntry => {
  return {
    sync(filepath, content) {
      return loader(filepath, transformContent(content));
    },
    async(filepath, content) {
      return loader(filepath, transformContent(content));
    },
  };
};

const loadYaml = createCustomLoader(cosmi.loadYaml);
const loadJson = createCustomLoader(cosmi.loadJson);

function createCosmiConfig() {
  // We need to wrap loaders in order to access and transform file content (as string)
  // Cosmiconfig has transform option but at this point config is not a string but an object
  return cosmiconfig('graphql', {
    loaders: {
      '.js': {sync: cosmi.loadJs, async: cosmi.loadJs},
      '.json': loadJson,
      '.yaml': loadYaml,
      '.yml': loadYaml,
      noExt: loadYaml,
    },
  });
}
