import {readConfig} from './utils';
import {findGraphQLConfigFile} from './find-graphql-config-file';
import {GraphQLConfig} from './graphql-config';
import {GraphQLProjectConfig} from './graphql-project-config';

export function getGraphQLConfig(
  rootDir: string = process.cwd(),
): GraphQLConfig {
  const configPath = findGraphQLConfigFile(rootDir);
  const config = readConfig(configPath);

  return new GraphQLConfig(config, configPath);
}

export function getGraphQLProjectConfig(
  rootDir?: string,
  projectName: string | undefined = process.env.GRAPHQL_CONFIG_PROJECT,
): GraphQLProjectConfig {
  return getGraphQLConfig(rootDir).getProjectConfig(projectName);
}
