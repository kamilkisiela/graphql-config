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
  configName,
}: {
  rootDir: string;
  configName: string;
}): Promise<GraphQLConfigResult> {
  validate({rootDir});

  return resolve({
    rootDir,
    result: await createCosmiConfig(configName).search(rootDir),
  });
}

export function findConfigSync({
  rootDir = cwd!,
  configName,
}: {
  rootDir: string;
  configName: string;
}): GraphQLConfigResult {
  validate({rootDir});

  return resolve({
    rootDir,
    result: createCosmiConfigSync(configName).search(rootDir),
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
