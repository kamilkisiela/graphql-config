import { relative } from 'path'
import { validateConfig } from './utils'

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
    validateConfig(config)
    this.config = config
    this.configPath = configPath
  }

  getProjectConfig(projectName?: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.config, this.configPath, projectName)
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig | null {
    const { projects } = this.config

    filePath = relative(this.configPath, filePath)
    if (!projects || Object.keys(projects).length === 0) {
      const config = new GraphQLProjectConfig(this.config, this.configPath, undefined)
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
