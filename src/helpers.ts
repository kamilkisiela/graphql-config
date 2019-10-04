import cosmiconfig from 'cosmiconfig';
import {ConfigNotFoundError, ConfigEmptyError, composeMessage} from './errors';
import {
  IGraphQLConfig,
  IGraphQLProject,
  IGraphQLProjects,
  GraphQLCofigResult,
} from './types';

const configName = 'graphql';

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

  const result = await cosmiconfig(configName).load(filepath);

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

  const result = await cosmiconfig(configName).search(rootDir);

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
