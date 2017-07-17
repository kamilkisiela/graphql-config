import { join as joinPaths, dirname, relative } from 'path'

import {
  GraphQLSchema,
  graphql,
  introspectionQuery,
  printSchema,
  buildClientSchema,
} from 'graphql'

import { GraphQLClient } from 'graphql-request'

import {
  GraphQLResolvedConfigData,
  GraphQLConfigData,
  GraphQLConfigExtensions,
  GraphQLConfigEnpointConfig,
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

  includesFile(filePath: string): boolean {
    filePath = relative(this.configPath, filePath)
    return (
      matchesGlobs(filePath, this.config.include) &&
      !matchesGlobs(filePath, this.config.exclude)
    )
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

  // Getters
  get schemaPath(): string {
    return this.config.schemaPath
  }

  get include(): string[] {
    return this.config.include || []
  }

  get exclude(): string[] {
    return this.config.exclude || []
  }

  get extensions(): GraphQLConfigExtensions {
    return this.config.extensions || {}
  }

  // helper functions
  getEndpointsMap(): { [name: string]: GraphQLConfigEnpointConfig } {
    const endpoint = this.extensions.endpoint
    if (typeof endpoint === 'string') {
      return {
        default: {
          url: endpoint,
        },
      }
    } else if (endpoint['url'] && typeof endpoint['url'] === 'string') {
      return {
        // FIXME
        default: endpoint as GraphQLConfigEnpointConfig,
      }
    } else {
      // FIXME
      return endpoint as any
    }
  }

  resolveSchemaFromEndpoint(name: string = 'default'): Promise<GraphQLSchema> {
    const { url, headers } = this.getEndpointsMap()[name]
    if (!url) {
      // TODO
      throw new Error('Undefined endpoint')
    }
    const client = new GraphQLClient(url, { headers })
    return client.request(introspectionQuery)
      .then(introspection => buildClientSchema(introspection))
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
