import { readFile, readFileSync, existsSync } from 'fs'
import { resolve, join, dirname, sep, extname } from 'path'
import { buildSchema, buildClientSchema, introspectionQuery } from 'graphql'
import { request } from 'graphql-request'
import { GraphQLConfigData } from './types'

export const GRAPHQL_CONFIG_NAME = '.graphqlconfig'

function isRootDir(path: string): boolean {
  return dirname(path) === path
}

function isSubPath(from: string, to: string): boolean {
  from = resolve(from)
  to = resolve(to)
  return (from === to || to.startsWith(from + sep))
}

export function isPathToConfig(path: string) {
  return (extname(path) === GRAPHQL_CONFIG_NAME)
}

export function findConfigPath(filePath: string): string | null {
  let currentDir = resolve(filePath)

  while (!isRootDir(currentDir)) {
    const configPath = join(currentDir, GRAPHQL_CONFIG_NAME)
    if (existsSync(configPath)) {
      return configPath
    }
    currentDir = dirname(currentDir)
  }

  return null
}

export function readConfig(configPath: string): GraphQLConfigData {
  const rawConfig = readFileSync(configPath, 'utf-8')

  let config
  try {
    config = JSON.parse(rawConfig)
  } catch (error) {
    // FIXME: prefix error
    // console.error('Parsing JSON in .graphqlrc file has failed.')
    throw new Error(error)
  }

  // validateConfig(config)
  return config
}

export function isFileInDirs(filePath: string, dirs?: string[]): boolean {
  return (dirs || []).some(dir => isSubPath(dir, filePath))
}

export function validateConfig(config: GraphQLConfigData) {
  // FIXME:
}

export function mergeConfigs(
  dest: GraphQLConfigData,
  src: GraphQLConfigData
): GraphQLConfigData {
  // FIXME: handle extensions, envs and projects
  return { ...dest, ...src }
}

export function readSchema(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (error, data) => {
      // FIXME: prefix error
      error ? reject(error) : resolve(data)
    })
  }).then((data: string) => {
    // FIXME: prefix error
    switch (extname(path)) {
      case '.graphql':
        return buildSchema(data)
      case '.json':
        return buildClientSchema(JSON.parse(data).data)
      default:
        throw new Error('Unsupported schema file extention')
    }
  })
}

export function querySchema(url: string, options?) {
  return request(url, introspectionQuery)
}
