import {dirname} from 'path';
import {writeConfig} from './utils';
import {GraphQLConfigData} from './types';
import {GraphQLProjectConfig} from './graphql-project-config';

export class GraphQLConfig {
  public config: GraphQLConfigData;
  public configPath: string;

  constructor(config: GraphQLConfigData, configPath: string) {
    this.config = config;
    this.configPath = configPath;
  }

  get configDir() {
    return dirname(this.configPath);
  }

  getProjectConfig(projectName?: string): GraphQLProjectConfig {
    return new GraphQLProjectConfig(this.config, this.configPath, projectName);
  }

  getConfigForFile(filePath: string): GraphQLProjectConfig | undefined {
    const {projects} = this.config;

    if (!projects || Object.keys(projects).length === 0) {
      const config = new GraphQLProjectConfig(
        this.config,
        this.configPath,
        undefined,
      );
      return config.includesFile(filePath) ? config : undefined;
    }

    return (
      Object.values(this.getProjects()).find(project =>
        project.includesFile(filePath),
      ) || undefined
    );
  }

  getProjectNameForFile(filePath: string): string | undefined {
    const proj = this.getConfigForFile(filePath);
    return (proj && proj.projectName) || undefined;
  }

  getProjects(): {[name: string]: GraphQLProjectConfig} | undefined {
    const result = {};
    for (const projectName in this.config.projects || {}) {
      result[projectName] = this.getProjectConfig(projectName);
    }
    if (Object.keys(result).length === 0) {
      return undefined;
    }
    return result;
  }

  saveConfig(newConfig: GraphQLConfigData, projectName?: string) {
    let config;
    if (projectName) {
      config = this.config;
      config.projects = config.projects || {};
      config.projects[projectName] = config.projects[projectName] || {};
      config.projects[projectName] = newConfig;
    } else {
      config = newConfig;
    }
    writeConfig(this.configPath, config);
  }
}
