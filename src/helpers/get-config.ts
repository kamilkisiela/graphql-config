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
}: {
  filepath: string;
  configName: string;
}): Promise<GraphQLConfigResult> {
  validate({filepath});

  return resolve({
    result: await createCosmiConfig(configName).load(filepath),
    filepath,
  });
}

export function getConfigSync({
  filepath,
  configName,
}: {
  filepath: string;
  configName: string;
}): GraphQLConfigResult {
  validate({filepath});

  return resolve({
    result: createCosmiConfigSync(configName).load(filepath),
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
