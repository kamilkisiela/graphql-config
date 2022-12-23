import { ConfigNotFoundError, ConfigEmptyError, composeMessage } from '../errors.js';
import { GraphQLConfigResult } from '../types.js';
import { createCosmiConfig, createCosmiConfigSync, ConfigSearchResult } from './cosmiconfig.js';

const CWD = process.cwd();

type FindConfigOptions = {
  rootDir: string;
  configName: string;
  legacy?: boolean;
};

export async function findConfig({
  rootDir = CWD,
  legacy = true,
  configName,
}: FindConfigOptions): Promise<GraphQLConfigResult> {
  validate(rootDir);

  return resolve({
    rootDir,
    result: await createCosmiConfig(configName, legacy).search(rootDir),
  });
}

export function findConfigSync({ rootDir = CWD, legacy = true, configName }: FindConfigOptions): GraphQLConfigResult {
  validate(rootDir);

  return resolve({
    rootDir,
    result: createCosmiConfigSync(configName, legacy).search(rootDir),
  });
}

function validate(rootDir: string): void {
  if (!rootDir) {
    throw new Error(`Defining a root directory is required`);
  }
}

function resolve({ result, rootDir }: { result?: ConfigSearchResult; rootDir: string }) {
  if (!result) {
    throw new ConfigNotFoundError(
      composeMessage(
        `GraphQL Config file is not available in the provided config directory: ${rootDir}`,
        `Please check the config directory.`,
      ),
    );
  }

  if (result.isEmpty) {
    throw new ConfigEmptyError(composeMessage(`GraphQL Config file is empty.`, `Please check ${result.filepath}`));
  }

  return {
    config: result.config as any,
    filepath: result.filepath,
  };
}
