import { resolve, join as joinPaths, dirname } from 'path'
import { existsSync } from 'fs'

import {
  ConfigNotFoundError
} from './errors'

export const GRAPHQL_CONFIG_NAME = '.graphqlconfig'
export const GRAPHQL_CONFIG_YAML_NAME = '.graphqlconfig.yaml'

function isRootDir(path: string): boolean {
  return dirname(path) === path
}

export function findGraphQLConfigFile(filePath: string): string {
  filePath = resolve(filePath)

  if (
    filePath.endsWith(GRAPHQL_CONFIG_NAME) ||
    filePath.endsWith(GRAPHQL_CONFIG_YAML_NAME)
  ) {
    return filePath
  }

  let currentDir = filePath
  while (!isRootDir(currentDir)) {
    const configPath = joinPaths(currentDir, GRAPHQL_CONFIG_NAME)
    if (existsSync(configPath)) {
      return configPath
    }
    if (existsSync(configPath + '.yaml')) {
      return configPath + '.yaml'
    }
    currentDir = dirname(currentDir)
  }

  throw new ConfigNotFoundError(
    `"${GRAPHQL_CONFIG_NAME}" file is not available in the provided config ` +
    `directory: ${filePath}\nPlease check the config directory.`
  )
}
