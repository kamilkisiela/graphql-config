import { lstatSync, readFileSync, writeFileSync } from 'fs'
import { extname, join } from 'path'
import { importSchema } from 'graphql-import'
import * as minimatch from 'minimatch'
import * as yaml from 'js-yaml'
import {
  Source,
  GraphQLSchema,
  graphql,
  printSchema,
  buildSchema,
  buildClientSchema,
  introspectionQuery,
  IntrospectionQuery,
} from 'graphql'

import { GraphQLConfigData, IntrospectionResult } from './types'

export function readConfig(configPath: string): GraphQLConfigData {
  let config
  try {
    const rawConfig = readFileSync(configPath, 'utf-8')
    if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
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

export function writeConfig(configPath: string, config: GraphQLConfigData) {
  let configContents
  if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
    configContents = yaml.safeDump(config)
  } else {
    configContents = JSON.stringify(config)
  }

  writeFileSync(configPath, configContents, 'utf-8')
}

export function normalizeGlob(glob: string): string {
  if (glob.startsWith('./')) {
    return glob.substr(2)
  }
  return glob
}

export function matchesGlobs(
  filePath: string,
  configDir: string,
  globs?: string[],
): boolean {
  return (globs || []).some(glob => {
    try {
      const globStat = lstatSync(join(configDir, glob))
      const newGlob = glob.length === 0 ? '.' : glob
      const globToMatch = globStat.isDirectory() ? `${glob}/**` : glob
      return minimatch(filePath, globToMatch, { matchBase: true })
    } catch (error) {
      // Out of errors that lstat provides, EACCES and ENOENT are the
      // most likely. For both cases, run the match with the raw glob
      // and return the result.
      return minimatch(filePath, glob, { matchBase: true })
    }
  })
}

export function validateConfig(config: GraphQLConfigData) {
  // FIXME: implement
}

export function mergeConfigs(
  dest: GraphQLConfigData,
  src: GraphQLConfigData,
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

export function schemaToIntrospection(schema: GraphQLSchema) {
  return graphql(schema, introspectionQuery) as Promise<IntrospectionResult>
}

// Predicate for errors/data can be removed after typescript 2.7.
// See: https://github.com/Microsoft/TypeScript/pull/19513
export function introspectionToSchema(introspection: IntrospectionResult | (IntrospectionQuery & { errors: undefined, data: undefined; })) {
  if (introspection.errors != null) {
    throw new Error('Introspection result contains errors')
  }

  return buildClientSchema(introspection.data ? introspection.data : introspection as IntrospectionQuery)
}

export function readSchema(path): GraphQLSchema {
  // FIXME: prefix error
  switch (extname(path)) {
    case '.graphql':
      return valueToSchema(importSchema(path))
    case '.json':
      const data = readFileSync(path, { encoding: 'utf-8' })
      const introspection = JSON.parse(data)
      return valueToSchema(introspection)
    default:
      throw new Error(
        'Unsupported schema file extention. Only ".graphql" and ".json" are supported',
      )
  }
}

function valueToSchema(
  schema: GraphQLSchema | string | Source | IntrospectionResult,
): GraphQLSchema {
  if (schema instanceof GraphQLSchema) {
    return schema
  } else if (typeof schema === 'string') {
    return buildSchema(schema)
  } else if (schema instanceof Source) {
    return buildSchema(schema)
  } else if (typeof schema === 'object' && !Array.isArray(schema)) {
    return introspectionToSchema(schema as IntrospectionResult)
  }
  throw new Error('Can not convert data to a schema')
}

export async function writeSchema(
  path: string,
  schema: GraphQLSchema,
  schemaExtensions?: { [name: string]: string },
): Promise<void> {
  schema = valueToSchema(schema)
  let data: string
  switch (extname(path)) {
    case '.graphql':
      data = ''
      if (schemaExtensions) {
        for (const name in schemaExtensions) {
          data += `# ${name}: ${schemaExtensions[name]}\n`
        }
        data += '\n'
      }
      data += printSchema(schema)
      break
    case '.json':
      const introspection = await schemaToIntrospection(schema)
      introspection.extensions = {
        ['graphql-config']: schemaExtensions,
      }
      data = JSON.stringify(introspection, null, 2)
      break
    default:
      throw new Error(
        'Unsupported schema file extention. Only ".graphql" and ".json" are supported',
      )
  }
  writeFileSync(path, data, 'utf-8')
}

export function getSchemaExtensions(path: string): { [name: string]: string } {
  const data = readFileSync(path, 'utf-8')
  switch (extname(path)) {
    case '.graphql':
      const extensions = {}
      for (const line of data.split('\n')) {
        const result = /# ([^:]+): (.+)$/.exec(line)
        if (result == null) {
          break
        }
        const [_, key, value] = result
        extensions[key] = value
      }
      return extensions
    case '.json':
      const introspection = JSON.parse(data)
      if (!introspection.extentions) {
        return {}
      }
      return introspection.extensions['graphql-config'] || {}
    default:
      throw new Error(
        'Unsupported schema file extention. Only ".graphql" and ".json" are supported',
      )
  }
}
