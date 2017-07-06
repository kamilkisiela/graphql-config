import {
  GraphQLSchema
} from 'graphql'

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

  constructor(
    public rootPath: string = process.cwd()
  ) {
    const configFileName = findConfigPath(rootPath)
    if (!configFileName) {
      // '${GRAPHQL_CONFIG_NAME} file is not available in the provided ' +
      // `config directory: ${configDir}\nPlease check the config ` +
      // 'directory path and try again.',
      throw new Error(`Can't find ${GRAPHQL_CONFIG_NAME}`)
    }

    this.config = readConfig(configFileName)
    validateConfig(this.config)
  }


  getProjectConfig(projectName: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.rootPath, projectName)
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig {
    const { projects, ...configBase } = this.config
    if (!projects || Object.keys(projects).length === 0) {
      return new GraphQLProjectConfig(this.rootPath)
    }

    Object.entries(projects).forEach(([projectName, project]) => {
      if (
        isFileInDirs(filePath, project.includeDirs) &&
        !isFileInDirs(filePath, project.excludeDirs)
      ) {
        return new GraphQLProjectConfig(this.rootPath, projectName)
      }
    })

    throw new Error('File is not included in any config')
  }

  getProjects(): { [name: string]: GraphQLProjectConfigData } | undefined {
    return this.config.projects
  }
}
