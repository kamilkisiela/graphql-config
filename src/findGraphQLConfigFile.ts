import { resolve, join as joinPaths, dirname, basename } from 'path'
import { existsSync } from 'fs'
import * as Finder from 'fs-finder'

import {
  ConfigNotFoundError
} from './errors'

export const GRAPHQL_CONFIG_NAME = '.graphqlconfig'
export const GRAPHQL_CONFIG_YAML_NAME = '.graphqlconfig.yaml'
export const GRAPHQL_CONFIG_YML_NAME = '.graphqlconfig.yml'

function isRootDir(path: string): boolean {
  return dirname(path) === path
}

export function findGraphQLConfigFile(filePath: string): string {
  filePath = resolve(filePath)

  if (
    filePath.endsWith(GRAPHQL_CONFIG_NAME) ||
    filePath.endsWith(GRAPHQL_CONFIG_YAML_NAME) ||
    filePath.endsWith(GRAPHQL_CONFIG_YML_NAME)
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
    if (existsSync(configPath + '.yml')) {
      return configPath + '.yml'
    }
    currentDir = dirname(currentDir)
  }

  // Try to find GraphQL config in first level of sub-directories.
  const subDirectories = Finder.in(filePath).showSystemFiles().findDirectories()
  const subDirectoriesWithGraphQLConfig = subDirectories.map(subDirectory => {
    const subDirectoryFiles = Finder.in(subDirectory).showSystemFiles().findFiles().map(file => basename(file))
    if (subDirectoryFiles.includes(GRAPHQL_CONFIG_NAME)) {
      return `${subDirectory}/${GRAPHQL_CONFIG_NAME}`
    } 
    if (subDirectoryFiles.includes(`${GRAPHQL_CONFIG_NAME}.yml`)) {
      return `${subDirectory}/${GRAPHQL_CONFIG_NAME}.yml`
    }
    if (subDirectoryFiles.includes(`${GRAPHQL_CONFIG_NAME}.yaml`)) {
      return `${subDirectory}/${GRAPHQL_CONFIG_NAME}.yaml`
    }
  })
  if (subDirectoriesWithGraphQLConfig.length > 0) {
    return subDirectoriesWithGraphQLConfig[0]
  }

  throw new ConfigNotFoundError(
    `"${GRAPHQL_CONFIG_NAME}" file is not available in the provided config ` +
    `directory: ${filePath}\nPlease check the config directory.`
  )
}
