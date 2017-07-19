import { dirname, resolve } from 'path'

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
  GraphQLConfigEnpointsMap,
} from './types'

import {
  matchesGlobs,
  mergeConfigs,
  readSchema,
  validateConfig,
} from './utils'

import {
  getUsedEnvs,
  resolveEnvsInValues,
} from './resolveRefString'

/*
 * this class can be used for simple usecases where there is no need in per-file API
 */
export class GraphQLProjectConfig {
  public config: GraphQLResolvedConfigData
  public configPath: string
  public projectName?: string

  constructor(
    config: GraphQLConfigData,
    configPath: string,
    projectName?: string
  ) {
    validateConfig(config)
    this.config = loadProjectConfig(config, projectName)
    this.configPath = configPath
    this.projectName = projectName
  }

  resolveConfigPath(relativePath: string): string {
    return resolve(dirname(this.configPath), relativePath)
  }

  includesFile(filePath: string): boolean {
    filePath = resolve(filePath)
    return (
      (!this.config.include || matchesGlobs(filePath, this.include)) &&
      !matchesGlobs(filePath, this.exclude)
    )
  }

  resolveSchema(): Promise<GraphQLSchema> {
    if (this.schemaPath) {
      return readSchema(this.resolveConfigPath(this.schemaPath))
    }
    throw new Error(
      `"schemaPath" is required but not provided in ${this.configPath}`
    )
  }

  resolveIntrospection(): Promise<any> {
    return this.resolveSchema()
      .then(schema => graphql(schema, introspectionQuery))
  }

  resolveSchemaSDL(): Promise<string> {
    return this.resolveSchema()
      .then(schema => printSchema(schema))
  }

  // Getters
  get schemaPath(): string {
    return this.resolveConfigPath(this.config.schemaPath)
  }

  get include(): string[] {
    return (this.config.include || []).map(
      glob => this.resolveConfigPath(glob)
    )
  }

  get exclude(): string[] {
    return (this.config.exclude || []).map(
      glob => this.resolveConfigPath(glob)
    )
  }

  get extensions(): GraphQLConfigExtensions {
    return this.config.extensions || {}
  }

  /*
   extension relatad helper functions
  */
  getEndpointsMap(): GraphQLConfigEnpointsMap {
    const endpoint = this.extensions.endpoint
    let result
    if (endpoint == null) {
      result = {}
    } else if (typeof endpoint === 'string') {
      result = {
        default: {
          url: endpoint,
        },
      }
    } else if (typeof endpoint !== 'object' || Array.isArray(endpoint)) {
      throw new Error(`${this.configPath}: "endpoint" should be string or object`)
    } else if (!endpoint['url']) {
      result = endpoint as GraphQLConfigEnpointsMap
    } else if (typeof endpoint['url'] === 'string') {
      result = {
        default: endpoint as GraphQLConfigEnpointConfig,
      }
    } else {
      throw new Error(`${this.configPath}: "url" should be a string`)
    }

    return result
  }

  getEndpointEnvVars(endpointName: string): { [name: string]: string | null } {
    const endpoint = this.getEndpointsMap()[endpointName]
    return getUsedEnvs(endpoint)
  }

  resolveEndpointInfo(
    endpointName: string = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME || 'default',
    env: { [name: string]: string } = process.env
  ): GraphQLConfigEnpointConfig {
    const endpoint = this.getEndpointsMap()[endpointName] || {}
    if (!endpoint || !endpoint.url) {
      throw new Error(`Endpoint "${endpointName}" is not defined in ${this.configPath}`)
    }
    return resolveEnvsInValues(endpoint, env)
  }

  resolveSchemaFromEndpoint(
    endpointName?: string,
    env?: { [name: string]: string }
  ): Promise<GraphQLSchema> {
    const endpoint = this.resolveEndpointInfo(endpointName, env)
    const { url, headers } = endpoint
    const client = new GraphQLClient(url, { headers })
    return client.request(introspectionQuery)
      .then(introspection => buildClientSchema(introspection))
  }
}

function loadProjectConfig(
  config: GraphQLConfigData,
  projectName?: string
) {
  const { projects, ...configBase } = config

  if (projects == null || !Object.keys(projects).length) {
    return config
  }

  if (!projectName) {
    throw new Error('Project name must be specified for multiproject config')
  }

  const projectConfig = projects[projectName]
  if (!projectConfig) {
    throw new Error(`No config for ${projectName}`)
  }

  return mergeConfigs(configBase, projectConfig)
}
