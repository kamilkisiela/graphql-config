import {
  GraphQLConfigData,
  GraphQLProjectConfigData,
} from './types'

import {
  findConfigPath,
  readConfig,
  isFileInDirs,
  validateConfig,
  GRAPHQL_CONFIG_NAME,
} from './utils'

import { GraphQLProjectConfig } from './GraphQLProjectConfig'

export class GraphQLConfig {
  public config: GraphQLConfigData
  _configPath: string

  constructor(
    public rootPath: string = process.cwd()
  ) {
    const configPath = findConfigPath(rootPath)
    if (!configPath) {
      throw new Error(`'${GRAPHQL_CONFIG_NAME} file is not available in the provided ` +
        `config directory: ${this.rootPath}\nPlease check the config ` +
        `directory path and try again.`)
    }
    this._configPath = configPath
    this.config = readConfig(configPath)
    validateConfig(this.config)
  }

  getProjectConfig(projectName: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.rootPath, projectName, {
      config: this.config,
      path: this._configPath,
    })
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig {
    const { projects } = this.config
    if (!projects || Object.keys(projects).length === 0) {
      return new GraphQLProjectConfig(this.rootPath, undefined, {
        config: this.config,
        path: this._configPath,
      })
    }

    Object.entries(projects).forEach(([projectName, project]) => {
      if (
        isFileInDirs(filePath, project.includeDirs) &&
        !isFileInDirs(filePath, project.excludeDirs)
      ) {
        return new GraphQLProjectConfig(this.rootPath, projectName, {
          config: this.config,
          path: this._configPath,
        })
      }
    })

    throw new Error('File is not included in any config')
  }

  getProjects(): { [name: string]: GraphQLProjectConfigData } | undefined {
    return this.config.projects
  }
}
