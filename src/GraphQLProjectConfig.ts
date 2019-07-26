import { dirname, resolve, relative, join } from 'path'

import { printSchema } from 'graphql'

import {
  GraphQLResolvedConfigData,
  GraphQLConfigData,
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
  GraphQLEndpointsExtension
} from './extensions'

/**
 * This class can be used for simple usecases where there is no need in per-file API.
 */
export class GraphQLProjectConfig {
  public config: GraphQLResolvedConfigData

  constructor(
    config: GraphQLConfigData,
    public configPath: string,
    public projectName?: string
  ) {
    validateConfig(config)
    this.config = loadProjectConfig(config, projectName)
  }

  resolveConfigPath(relativePath: string) {
    return resolve(this.configDir, relativePath)
  }

  includesFile(fileUri: string) {
    const filePath = fileUri.startsWith('file://') ?
      fileUri.substr(7) : fileUri
    const fullFilePath = filePath.startsWith(this.configDir) ?
      filePath : resolve(join(this.configDir, filePath))
    const relativePath = relative(this.configDir, fullFilePath)
    return (
      (
        !this.config.includes ||
        matchesGlobs(relativePath, this.configDir, this.includes)
      ) && !matchesGlobs(relativePath, this.configDir, this.excludes)
    )
  }

  getSchema() {
    if (this.schemaPath) {
      return readSchema(this.resolveConfigPath(this.schemaPath))
    }
    throw new Error(
      `"schemaPath" is required but not provided in ${this.configPath}`
    )
  }

  async resolveIntrospection() {
    return schemaToIntrospection(this.getSchema())
  }

  getSchemaSDL() {
    return printSchema(this.getSchema())
  }

  // Getters
  get configDir() {
    return dirname(this.configPath)
  }

  get schemaPath(): string | null {
    return this.config.schemaPath ? this.resolveConfigPath(this.config.schemaPath) : null
  }

  get includes() {
    return (this.config.includes || []).map(normalizeGlob)
  }

  get excludes() {
    return (this.config.excludes || []).map(normalizeGlob)
  }

  get extensions() {
    return this.config.extensions || {}
  }

 /**
  * extension related helper functions
  */
  get endpointsExtension() {
    if (!this.extensions.endpoints) {
      return null
    }

    const { endpoints } = this.extensions

    if (Array.isArray(endpoints)) {
      throw new Error(`${this.configPath}: "endpoints" should be an object`)
    }

    if (Object.keys(endpoints).length === 0) {
      return null
    }

    return new GraphQLEndpointsExtension(
      this.extensions.endpoints,
      this.configPath
    )
  }
}

function loadProjectConfig(
  config: GraphQLConfigData,
  projectName?: string
) {
  const { projects, ...configBase } = config

  if (projects === undefined || !Object.keys(projects).length) {
    return config
  }

  if (!projectName) {
    throw new Error(
      `Project name must be specified for multiproject config. ` +
      `Valid project names: ${Object.keys(projects).join(', ')}`
    )
  }

  const projectConfig = projects[projectName]
  if (!projectConfig) {
    throw new Error(
      `"${projectName}" is not a valid project name. ` +
      `Valid project names: ${Object.keys(projects).join(', ')}`
    )
  }

  return mergeConfigs(configBase, projectConfig)
}
