import { join as joinPaths, dirname, relative } from 'path'

import {
  GraphQLSchema,
  graphql,
  introspectionQuery,
  printSchema,
} from 'graphql'

import {
  GraphQLResolvedConfigData,
  GraphQLConfigData,
  GraphQLConfigExtensions,
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
  public config: GraphQLResolvedConfigData
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

  resolveSchema(): Promise<GraphQLSchema> {
    if (this.schemaPath) {
      return readSchema(this.resolveConfigPath(this.schemaPath))
    }
    throw new Error(`"schemaPath" is required but not provided in ${GRAPHQL_CONFIG_NAME}`)
  }

  resolveIntrospection(): Promise<any> {
    return this.resolveSchema()
      .then(schema => graphql(schema, introspectionQuery))
  }

  resolveSchemaIDL(): Promise<string> {
    return this.resolveSchema()
      .then(schema => printSchema(schema))
  }

  get schemaPath(): string {
    return this.config.schemaPath
  }

  get include(): string[] {
    return this.config.include || []
  }
  get exclude(): string[] {
    return this.config.exclude || []
  }

  includesFile(filePath: string): boolean {
    filePath = relative(this.configPath, filePath)
    return (
      matchesGlobs(filePath, this.config.include) &&
      !matchesGlobs(filePath, this.config.exclude)
    )
  }

  getExtensions(envName: string = process.env.GRAPHQL_ENV): GraphQLConfigExtensions {
    const extentions = this.config.extensions
    if (extentions == null) {
      return {}
    }

    const { env, ...extBase } = extentions
    if (env == null || !Object.keys(env).length) {
      return extentions
    }

    if (!envName) {
      // FIXME
      throw new Error('GRAPHQL_ENV is not specified')
    }

    const selectedEnvExtensions = env[envName]
    if (!selectedEnvExtensions) {
      const possibleNames = Object.keys(env)
      throw new Error(`Wrong value provided for GRAPHQL_ENV. ` +
        `The following values are valid: ${possibleNames.join(', ')}`)
    }

    return { ...extBase, ...selectedEnvExtensions }
  }

  getExtensionsPerEnv(): { [env: string]: GraphQLConfigExtensions } {
    const result = {}
    const envs = this.config.extensions && this.config.extensions.env || {}
    for (const envName in envs) {
      result[envName] = this.getExtensions(envName)
    }
    return result
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
