import { resolve, dirname } from 'path'
import { validateConfig, writeConfig } from './utils'

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

  get configDir() {
    return dirname(this.configPath)
  }

  getProjectConfig(projectName?: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.config, this.configPath, projectName)
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig | null {
    const { projects } = this.config

    if (!projects || Object.keys(projects).length === 0) {
      const config = new GraphQLProjectConfig(this.config, this.configPath, undefined)
      return config.includesFile(filePath) ? config : null
    }

    return Object.values(this.getProjects()).find(
      project => project.includesFile(filePath)
    ) || null
  }

  getProjectNameForFile(filePath: string): string | null {
    const proj = this.getConfigForFile(filePath);
    return proj && proj.projectName || null;
  }

  getProjects(): { [name: string]: GraphQLProjectConfig } {
    const result = {}
    for (const projectName in (this.config.projects || {})) {
      result[projectName] = this.getProjectConfig(projectName)
    }
    return result
  }

  saveConfig(newConfig: GraphQLConfigData, projectName?: string) {
    let config
    if (projectName) {
      config = this.config;
      config.projects = config.projects || {};
      config.projects[projectName] = config.projects[projectName] || {}
      config.projects[projectName] = newConfig
    } else {
      config = newConfig
    }
    writeConfig(this.configPath, config)
  }
}
