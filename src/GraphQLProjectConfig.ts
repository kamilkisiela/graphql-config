import { join as joinPaths, dirname, relative } from 'path'

import {
  GraphQLSchema,
  graphql,
  introspectionQuery,
  printSchema,
} from 'graphql'

import {
  GraphQLResolvedConfigData,
  GraphQLProjectConfigData,
  GraphQLConfigData,
} from './types'

import {
  isPathToConfig,
  findConfigPath,
  readConfig,
  matchesGlobs,
  validateConfig,
  mergeConfigs,
  readSchema,
  GRAPHQL_CONFIG_NAME,
} from './utils'

/*
 * this class can be used for simple usecases where there is no need in per-file API
 */
export class GraphQLProjectConfig {
  public config: GraphQLProjectConfigData
  public configPath: string

  constructor(
    path: string = process.cwd(),
    public projectName: string = process.env.GRAPHQL_PROJECT,
    configData?: GraphQLConfigData // in case the data is already parsed
  ) {
    if (isPathToConfig(path)) {
      this.configPath = path
    } else {
      this.configPath = findConfigPath(path)
    }

    let config = configData
    if (config == null) {
      config = readConfig(this.configPath)
    }
    validateConfig(config)
    this.config = loadProjectConfig(config, projectName)
  }

  resolveConfigPath(relativePath: string): string {
    return joinPaths(dirname(this.configPath), relativePath)
  }

  resolveSchema(env?: string): Promise<GraphQLSchema> {
    const { schemaPath } = this.getConfig(env)

    if (schemaPath) {
      return readSchema(this.resolveConfigPath(schemaPath))
    }
    throw new Error(`"schemaPath" is required but not provided in ${GRAPHQL_CONFIG_NAME}`)
  }

  resolveIntrospection(env?: string): Promise<any> {
    return this.resolveSchema(env)
      .then(schema => graphql(schema, introspectionQuery))
  }

  resolveSchemaIDL(env?: string): Promise<string> {
    return this.resolveSchema(env)
      .then(schema => printSchema(schema))
  }

  getConfig(envName: string = process.env.GRAPHQL_ENV): GraphQLResolvedConfigData {
    const { env, ...configBase } = this.config
    if (env == null || !Object.keys(env).length) {
      return this.config
    }

    if (!envName) {
      // FIXME
      throw new Error('GRAPHQL_ENV is not specified')
    }

    const selectedEnvConfig = env[envName]
    if (!selectedEnvConfig) {
      const possibleNames = Object.keys(env)
      throw new Error(`Wrong value provided for GRAPHQL_ENV. ` +
        `The following values are valid: ${possibleNames.join(', ')}`)
    }

    return mergeConfigs(configBase, selectedEnvConfig)
  }

  getEnvs(): { [env: string]: GraphQLResolvedConfigData } {
    const result = {}
    for (const envName in (this.config.env || {})) {
      result[envName] = this.getConfig(envName)
    }
    return result
  }

  includesFile(filePath: string): boolean {
    filePath = relative(this.configPath, filePath)
    return (
      matchesGlobs(filePath, this.config.include) &&
      !matchesGlobs(filePath, this.config.exclude)
    )
  }
}

function loadProjectConfig(
  config: GraphQLConfigData,
  projectName: string
) {
  const { projects, ...configBase } = config

  if (projects == null || !Object.keys(projects).length) {
    return config
  }

  // TODO: try checking GRAPHQL_CONFIG_PROJECT env var ?
  if (!projectName) {
    throw new Error('Project name must be specified for multiproject config')
  }

  const projectConfig = projects[projectName]
  if (!projectConfig) {
    throw new Error(`No config for ${projectName}`)
  }

  return mergeConfigs(configBase, projectConfig)
}
