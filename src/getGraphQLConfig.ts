import { readConfig, validateConfig } from './utils'
import { findGraphQLConfigFile } from './findGraphQLConfigFile'
import { GraphQLConfig } from './GraphQLConfig'
import { GraphQLProjectConfig } from './GraphQLProjectConfig'

export function getGraphQLConfig(rootDir: string = process.cwd()): GraphQLConfig {
  const configPath = findGraphQLConfigFile(rootDir)
  const config = readConfig(configPath)
  validateConfig(config)

  return new GraphQLConfig(config, configPath)
}

export function getGraphQLProjectConfig(
  rootDir?: string,
  projectName: string = process.env.GRAPHQL_CONFIG_PROJECT
): GraphQLProjectConfig {
  return getGraphQLConfig(rootDir).getProjectConfig(projectName)
}
