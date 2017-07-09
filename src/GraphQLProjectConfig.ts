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
  _configPath: string

  constructor(
    path: string = process.cwd(),
    public projectName?: string,
    configData?: GraphQLConfigData
  ) {
    if (isPathToConfig(path)) {
      this._configPath = path
    } else {
      const configPath = findConfigPath(path)
      if (!configPath) {
        throw new Error("Can't find .graphqlconfig")
      }
      this._configPath = configPath
    }

    let config = configData
    if (config == null) {
      config = readConfig(this._configPath)
    }
    validateConfig(config)
    this.loadProjectConfig(config, projectName)
  }

  loadProjectConfig(config: GraphQLConfigData, projectName?: string) {
    const { projects, ...configBase } = config

    if (projects && projects.length && !projectName) {
      throw new Error('Project name must be specified for multiproject config')
    }

    if (!projectName || !projects) {
      this.config = config
      return
    }

    const projectConfig = projects[projectName]
    if (!projectConfig) {
      throw new Error(`No config for ${projectName}`)
    }

    this.config = { ...configBase, ...projectConfig }
  }

  resolveSchema(env: string = process.env.GRAPHQL_ENV): Promise<GraphQLSchema> {
    const {schemaPath, schemaUrl} = this.config

    if (schemaPath) {
      return readSchema(joinPaths(dirname(this._configPath), schemaPath))
    }
    if (schemaUrl) {
      return querySchema(schemaUrl)
    }
    // FIXME
    throw new Error('')
  }

  resolveIntrospection(env: string = process.env.GRAPHQL_ENV): Promise<any> {
    return this.resolveSchema(env)
      .then(schema => graphql(schema, introspectionQuery))
  }

  resolveSchemaIDL(env: string = process.env.GRAPHQL_ENV): Promise<any> {
    return this.resolveSchema(env)
      .then(schema => printSchema(schema))
  }

  getConfig(envName: string = process.env.GRAPHQL_ENV): GraphQLResolvedConfigData {
    const { env, ...configBase } = this.config
    if (!env || Object.keys(env).length === 0) {
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

  getEnvs(): { [envName: string]: GraphQLResolvedConfigData } | undefined {
    return this.config.env
  }
}
