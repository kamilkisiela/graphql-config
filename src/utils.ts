import { readFile, readFileSync } from 'fs'
import { extname } from 'path'
import { buildSchema, buildClientSchema } from 'graphql'
import * as minimatch from 'minimatch'
import * as yaml from 'js-yaml'

import { GraphQLConfigData } from './types'

export function readConfig(configPath: string): GraphQLConfigData {
  let config
  try {
    const rawConfig = readFileSync(configPath, 'utf-8')
    if (configPath.endsWith('.yaml')) {
      config = yaml.safeLoad(rawConfig)
    } else {
      config = JSON.parse(rawConfig)
    }
  } catch (error) {
    error.message = `Parsing ${configPath} file has failed.\n` + error.message
    throw error
  }

  return config
}

export function matchesGlobs(filePath: string, globs?: string[]): boolean {
  return (globs || []).some(
    glob => minimatch(filePath, glob, {matchBase: true})
  )
}

export function validateConfig(config: GraphQLConfigData) {
  // FIXME: implement
}

export function mergeConfigs(
  dest: GraphQLConfigData,
  src: GraphQLConfigData
): GraphQLConfigData {
  const result = { ...dest, ...src }
  if (dest.extensions && src.extensions) {
    result.extensions = { ...dest.extensions, ...src.extensions }
  }
  if (dest.projects && src.projects) {
    result.projects = { ...dest.projects, ...src.projects }
  }
  return result
}

export function readSchema(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (error, data) => {
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
        throw new Error('Unsupported schema file extention. Only ".graphql" and ".json" are supported')
    }
  })
}
