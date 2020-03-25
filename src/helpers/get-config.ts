import {ConfigNotFoundError, ConfigEmptyError, composeMessage} from '../errors';
import {GraphQLConfigResult} from '../types';
import {
  ConfigSearchResult,
  createCosmiConfigSync,
  createCosmiConfig,
} from './cosmiconfig';

export async function getConfig({
  filepath,
  configName,
  legacy = true,
}: {
  filepath: string;
  configName: string;
  legacy?: boolean;
}): Promise<GraphQLConfigResult> {
  validate({filepath});

  return resolve({
    result: await createCosmiConfig(configName, {legacy}).load(filepath),
    filepath,
  });
}

export function getConfigSync({
  filepath,
  configName,
  legacy = true,
}: {
  filepath: string;
  configName: string;
  legacy?: boolean;
}): GraphQLConfigResult {
  validate({filepath});

  return resolve({
    result: createCosmiConfigSync(configName, {legacy}).load(filepath),
    filepath,
  });
}

//

function resolve({
  result,
  filepath,
}: {
  result?: ConfigSearchResult;
  filepath: string;
}) {
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

function validate({filepath}: {filepath?: string}) {
  if (!filepath) {
    throw new Error(`Defining a file path is required`);
  }
}
