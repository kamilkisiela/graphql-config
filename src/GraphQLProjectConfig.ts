import { join as joinPaths, dirname } from 'path'

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
  GraphQLPerEnvConfig,
} from './types'

import {
  isPathToConfig,
  findConfigPath,
  readConfig,
  validateConfig,
  mergeConfigs,
  readSchema,
  querySchema,
} from './utils'

export class GraphQLProjectConfig {
  public config: GraphQLProjectConfigData
  public configPath: string

  constructor(
    path: string = process.cwd(),
    public projectName?: string,
    configData?: GraphQLConfigData
  ) {
    if (isPathToConfig(path)) {
      this.configPath = path
    } else {
      const configPath = findConfigPath(path)
      if (!configPath) {
        throw new Error("Can't find .graphqlconfig")
      }
      this.configPath = configPath
    }

    let config = configData
    if (config == null) {
      config = readConfig(this.configPath)
    }
    validateConfig(config)
    this.config = this.loadProjectConfig(config, projectName)
  }

  loadProjectConfig(
    config: GraphQLConfigData,
    projectName: string = process.env.GRAPHQL_PROJECT
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

  resolveConfigPath(relativePath: string): string {
    return joinPaths(dirname(this.configPath), relativePath)
  }

  resolveSchema(env?: string): Promise<GraphQLSchema> {
    const {schemaPath, schemaUrl} = this.getConfig(env)

    if (schemaPath) {
      return readSchema(this.resolveConfigPath(schemaPath))
    }
    if (schemaUrl) {
      return querySchema(schemaUrl)
    }
    // FIXME
    throw new Error('')
  }

  resolveIntrospection(env?: string): Promise<GraphQLSchema> {
    return this.resolveSchema(env)
      .then(schema => graphql(schema, introspectionQuery))
  }

  resolveSchemaIDL(env?: string): Promise<GraphQLSchema> {
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
      // FIXME
      throw new Error(`${possibleNames}`)
    }

    return mergeConfigs(configBase, selectedEnvConfig)
  }

  getEnvs(): GraphQLPerEnvConfig {
    const result = {}
    for (const envName in (this.config.env || {})) {
      result[envName] = this.getConfig(envName)
    }
    return result
  }
}
