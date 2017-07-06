import { readFile, readFileSync, existsSync } from 'fs'
import { resolve, join, dirname, sep, extname } from 'path'
import { graphql } from 'graphql/graphql'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import { buildSchema } from 'graphql/utilities/buildASTSchema'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'
import { request } from 'graphql-request'

export const GRAPHQL_CONFIG_NAME = '.graphqlconfig'

function findConfigPath(filePath) {
  let currentDir = dirname(resolve(filePath))

  while (!isRootDir(currentDir)) {
    const configPath = join(currentDir, GRAPHQL_CONFIG_NAME)
    if (existsSync(configPath)) {
      return configPath
    }
    currentDir = dirname(currentDir)
  }

  return null
}

export function validateConfig(config) {
  // FIXME
  // TODO check if projects are overlapping
  // forbid recursive projects and env
}

function isRootDir(path: string): boolean {
  return dirname(path) === path
}

function isSubPath(from, to) {
  from = resolve(from)
  to = resolve(to)
  return (from === to || to.startsWith(from + sep))
}

function isFileInDirs(filePath, dirs) {
  return (dirs || []).some(dir => isSubPath(dir, filePath))
}

function merge(object, source) {
  // if (source == null)
  // for (const name in object) {
  //   merge(object[name], source[name])
  // }
}

function resolveProject(config, filePath) {
  const { projects, ...configBase } = config
  if (!projects || Object.keys(projects).length === 0) {
    return config
  }

  projects.each(project => {
    if (
      isFileInDirs(filePath, project.includeDirs) &&
      !isFileInDirs(filePath, project.excludeDirs)
    ) {
      return merge(configBase, project)
    }
  })

  // FIXME
  throw new Error('')
}

function resolveEnv(config, envName?: string) {
  const { env, ...configBase } = config.env
  if (!env || Object.keys(env).length === 0) {
    return config
  }

  if (!envName) {
    envName = process.env.GRAPHQL_ENV
  }

  if (!envName) {
    // FIXME
    throw new Error('')
  }

  const selectedEnv = env[envName]
  if (!selectedEnv) {
    const possibleNames = Object.keys(env)
    // FIXME:
    throw new Error(`${possibleNames}`)
  }

  return merge(configBase, selectedEnv)
}

export function getProjectConfig(filePath) {
  const configPath = findConfigPath(filePath)

  if (configPath === null) {
    // '${GRAPHQL_CONFIG_NAME} file is not available in the provided ' +
    // `config directory: ${configDir}\nPlease check the config ` +
    // 'directory path and try again.',
    throw new Error('')
  }

  const rawConfig = readFileSync(configPath, 'utf-8')

  let config
  try {
    config = JSON.parse(rawConfig)
  } catch (error) {
    // FIXME: prefix error
    // console.error('Parsing JSON in .graphqlrc file has failed.')
    throw new Error(error)
  }

  validateConfig(config)
  return { ...resolveProject(config, filePath), configPath }
}

export function getConfig(filePath, envName?: string) {
  const config = getProjectConfig(filePath)
  return resolveEnv(config, envName)
}

function readSchema(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (error, data) => {
      // FIXME prefix error
      error ? reject(error) : resolve(data)
    })
  }).then(data => {
    // FIXME: prefix error
    switch (extname(path)) {
      case '.graphql':
        return buildSchema(data)
      case '.json':
        return buildClientSchema(JSON.parse(data))
      default:
        throw new Error('Unsupported schema file extention')
    }
  })
}

function querySchema(url, options?) {
  return request(url, introspectionQuery)
}

export function getSchema(filePath) {
  const {schemaPath, configPath, schemaUrl} = getConfig(filePath)

  if (schemaPath) {
    return readSchema(join(configPath, schemaPath))
  }
  if (schemaUrl) {
    return querySchema(schemaUrl)
  }
  // FIXME
  throw new Error('')
}

export function getIntospection(filePath) {
  return getSchema(filePath)
    .then(schema => graphql(schema, introspectionQuery))
}

export function getSchemaIDL(filePath) {
  return getSchema(filePath)
    .then(schema => printSchema(schema))
}
