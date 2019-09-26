import cosmiconfig from 'cosmiconfig';
import {ConfigNotFoundError, ConfigEmptyError} from './errors';
import {GraphQLConfig} from './GraphQLConfig';
import {GraphQLProjectConfig} from './GraphQLProjectConfig';

export async function getGraphQLConfig(
  rootDir: string = process.cwd(),
): Promise<GraphQLConfig> {
  const moduleName = 'graphql';
  const result = await cosmiconfig('graphql', {
    loaders: {
      [`.${moduleName}config`]: (cosmiconfig as any).loadJson,
    },
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `${moduleName}.config.js`,
      // deprecated
      `.${moduleName}config`,
      `.${moduleName}config.yml`,
      `.${moduleName}config.yaml`,
    ],
  }).search(rootDir);

  if (!result) {
    throw new ConfigNotFoundError(
      `GraphQL Config file is not available in the provided config ` +
        `directory: ${rootDir}\nPlease check the config directory.`,
    );
  }

  if (result.isEmpty) {
    throw new ConfigEmptyError(
      `GraphQL Config file is empty.\nPlease check ${result.filepath}`,
    );
  }

  return new GraphQLConfig(result.config as any, result.filepath);
}

export async function getGraphQLProjectConfig(
  rootDir?: string,
  projectName: string | undefined = process.env.GRAPHQL_CONFIG_PROJECT,
): Promise<GraphQLProjectConfig> {
  return (await getGraphQLConfig(rootDir)).getProjectConfig(projectName);
}
