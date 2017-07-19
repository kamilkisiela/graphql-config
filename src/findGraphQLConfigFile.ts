import { resolve, join as joinPaths, dirname } from 'path'
import { existsSync } from 'fs'

const GRAPHQL_CONFIG_NAME = '.graphqlrc'
const GRAPHQL_CONFIG_YAML_NAME = '.graphqlrc.yaml'

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

  throw new Error(
    `'${GRAPHQL_CONFIG_NAME} file is not available in the provided config ` +
    `directory: ${filePath}\nPlease check the config directory path and try again.`
  )
}
