import {dirname, resolve, relative, join, normalize} from 'path';
import {platform} from 'os';
import {GraphQLSchema, printSchema} from 'graphql';
import {
  IntrospectionResult,
  GraphQLResolvedConfigData,
  GraphQLConfigData,
  GraphQLConfigExtensions,
} from './types';
import {
  matchesGlobs,
  mergeConfigs,
  readSchema,
  validateConfig,
  schemaToIntrospection,
  normalizeGlob,
} from './utils';
import {GraphQLEndpointsExtension} from './extensions';

const isWindows = platform() === 'win32';

/*
 * this class can be used for simple usecases where there is no need in per-file API
 */
export class GraphQLProjectConfig {
  public config: GraphQLResolvedConfigData;
  public configPath: string;
  public projectName?: string;

  constructor(
    config: GraphQLConfigData,
    configPath: string,
    projectName?: string,
  ) {
    validateConfig(config);
    this.config = loadProjectConfig(config, projectName);
    this.configPath = configPath;
    this.projectName = projectName;
  }

  resolveConfigPath(relativePath: string): string {
    return resolve(this.configDir, relativePath);
  }

  includesFile(fileUri: string): boolean {
    let filePath = fileUri;

    if (fileUri.startsWith('file://')) {
      if (isWindows) {
        filePath = filePath.substr(8);
        filePath = decodeURIComponent(filePath);
        filePath = normalize(filePath);
      } else {
        filePath = filePath.substr(7);
        filePath = decodeURIComponent(filePath);
      }
    }

    const fullFilePath = filePath.startsWith(this.configDir)
      ? filePath
      : resolve(join(this.configDir, filePath));
    const relativePath = relative(this.configDir, fullFilePath);
    return (
      (!this.config.includes ||
        matchesGlobs(relativePath, this.configDir, this.includes)) &&
      !matchesGlobs(relativePath, this.configDir, this.excludes)
    );
  }

  getSchema(): GraphQLSchema {
    if (this.schemaPath) {
      return readSchema(this.resolveConfigPath(this.schemaPath));
    }
    throw new Error(
      `"schemaPath" is required but not provided in ${this.configPath}`,
    );
  }

  async resolveIntrospection(): Promise<IntrospectionResult> {
    return schemaToIntrospection(this.getSchema());
  }

  getSchemaSDL(): string {
    return printSchema(this.getSchema());
  }

  // Getters
  get configDir() {
    return dirname(this.configPath);
  }

  get schemaPath(): string | null {
    return this.config.schemaPath
      ? this.resolveConfigPath(this.config.schemaPath)
      : null;
  }

  get includes(): string[] {
    return (this.config.includes || []).map(normalizeGlob);
  }

  get excludes(): string[] {
    return (this.config.excludes || []).map(normalizeGlob);
  }

  get extensions(): GraphQLConfigExtensions {
    return this.config.extensions || {};
  }

  /*
   extension related helper functions
  */
  get endpointsExtension(): GraphQLEndpointsExtension | null {
    if (!this.extensions.endpoints) {
      return null;
    }

    const {endpoints} = this.extensions;

    if (typeof endpoints !== 'object' || Array.isArray(endpoints)) {
      throw new Error(`${this.configPath}: "endpoints" should be an object`);
    }

    if (Object.keys(endpoints).length === 0) {
      return null;
    }

    return new GraphQLEndpointsExtension(
      this.extensions.endpoints,
      this.configPath,
    );
  }
}

function loadProjectConfig(config: GraphQLConfigData, projectName?: string) {
  const {projects, ...configBase} = config;

  if (projects == null || !Object.keys(projects).length) {
    return config;
  }

  if (!projectName) {
    throw new Error(
      `Project name must be specified for multiproject config. ` +
        `Valid project names: ${Object.keys(projects).join(', ')}`,
    );
  }

  const projectConfig = projects[projectName];
  if (!projectConfig) {
    throw new Error(
      `"${projectName}" is not a valid project name. ` +
        `Valid project names: ${Object.keys(projects).join(', ')}`,
    );
  }

  return mergeConfigs(configBase, projectConfig);
}
