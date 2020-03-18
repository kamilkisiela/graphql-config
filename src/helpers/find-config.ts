import {ConfigNotFoundError, ConfigEmptyError, composeMessage} from '../errors';
import {GraphQLConfigResult} from '../types';
import {
  createCosmiConfig,
  createCosmiConfigSync,
  ConfigSearchResult,
} from './cosmiconfig';

const cwd = typeof process !== 'undefined' ? process.cwd() : undefined;

export async function findConfig({
  rootDir = cwd!,
  legacy = true,
  configName,
}: {
  rootDir: string;
  configName: string;
  legacy?: boolean;
}): Promise<GraphQLConfigResult> {
  validate({rootDir});

  return resolve({
    rootDir,
    result: await createCosmiConfig(configName, {legacy}).search(rootDir),
  });
}

export function findConfigSync({
  rootDir = cwd!,
  legacy = true,
  configName,
}: {
  rootDir: string;
  configName: string;
  legacy?: boolean;
}): GraphQLConfigResult {
  validate({rootDir});

  return resolve({
    rootDir,
    result: createCosmiConfigSync(configName, {legacy}).search(rootDir),
  });
}

//

function validate({rootDir}: {rootDir: string}) {
  if (!rootDir) {
    throw new Error(`Defining a root directory is required`);
  }
}

function resolve({
  result,
  rootDir,
}: {
  result?: ConfigSearchResult;
  rootDir: string;
}) {
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
