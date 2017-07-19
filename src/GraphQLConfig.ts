import { relative } from 'path'

import {
  GraphQLConfigData,
} from './types'

import { GraphQLProjectConfig } from './GraphQLProjectConfig'

export class GraphQLConfig {
  public config: GraphQLConfigData
  public configPath: string

  constructor(
    config: GraphQLConfigData,
    configPath: string
  ) {
    this.config = config
    this.configPath = configPath
  }

  getProjectConfig(projectName?: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.config, projectName, this.configPath)
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig | null {
    const { projects } = this.config

    filePath = relative(this.configPath, filePath)
    if (!projects || Object.keys(projects).length === 0) {
      const config = new GraphQLProjectConfig(this.config, undefined, this.configPath)
      return config.includesFile(filePath) ? config : null
    }

    return Object.values(this.getProjects()).find(
      project => project.includesFile(filePath)
    ) || null
  }

  getProjects(): { [name: string]: GraphQLProjectConfig } {
    const result = {}
    for (const projectName in (this.config.projects || {})) {
      result[projectName] = this.getProjectConfig(projectName)
    }
    return result
  }
}
