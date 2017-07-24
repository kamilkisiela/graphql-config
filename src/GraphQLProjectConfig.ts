import { dirname, resolve, relative, join } from 'path'

import {
  GraphQLSchema,
  printSchema,
  introspectionQuery,
  IntrospectionQuery,
  buildClientSchema,
} from 'graphql'

import { GraphQLClient } from 'graphql-request'

import {
  IntrospectionResult,
  GraphQLResolvedConfigData,
  GraphQLConfigData,
  GraphQLConfigExtensions,
} from './types'

import {
  matchesGlobs,
  mergeConfigs,
  readSchema,
  validateConfig,
  schemaToIntrospection,
  normalizeGlob,
} from './utils'

import {
  GraphQLEndpointExtension
} from './extensions'

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
    return resolve(this.configDir, relativePath)
  }

  includesFile(filePath: string): boolean {
    if (filePath.startsWith('file://')) {
      filePath = filePath.substr(7)
    }
    filePath = relative(this.configDir, resolve(join(this.configDir, filePath)))
    return (
      (!this.config.includes || matchesGlobs(filePath, this.includes)) &&
      !matchesGlobs(filePath, this.excludes)
    )
  }

  getSchema(): GraphQLSchema {
    if (this.schemaPath) {
      return readSchema(this.resolveConfigPath(this.schemaPath))
    }
    throw new Error(
      `"schemaPath" is required but not provided in ${this.configPath}`
    )
  }

  async resolveIntrospection(): Promise<IntrospectionResult> {
    return schemaToIntrospection(this.getSchema())
  }

  getSchemaSDL(): string {
    return printSchema(this.getSchema())
  }

  // Getters
  get configDir() {
    return dirname(this.configPath)
  }

  get schemaPath(): string | null {
    return this.config.schemaPath ? this.resolveConfigPath(this.config.schemaPath) : null
  }

  get includes(): string[] {
    return (this.config.includes || []).map(normalizeGlob)
  }

  get excludes(): string[] {
    return (this.config.excludes || []).map(normalizeGlob)
  }

  get extensions(): GraphQLConfigExtensions {
    return this.config.extensions || {}
  }

  /*
   extension related helper functions
  */
  get endpointExtension(): GraphQLEndpointExtension | null {
    return this.extensions.endpoint ?
      new GraphQLEndpointExtension(this.extensions.endpoint, this.configPath) : null
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
