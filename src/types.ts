type GraphQLConfigurationExtension = {
  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath?: string,
  schemaUrl?: string,

  includeDirs?: Array<string>,
  excludeDirs?: Array<string>,

  extensions?: { [name: string]: GraphQLConfigurationExtension }
}

export type GraphQLPerEnvConfig = {
  env?: { [name: string]: GraphQLResolvedConfigData }
}

export type GraphQLProjectConfigData = GraphQLResolvedConfigData & GraphQLPerEnvConfig

export type GraphQLPerProjectConfig = {
  projects?: { [projectName: string]: GraphQLProjectConfigData }
}

export type GraphQLConfigData = GraphQLProjectConfigData & GraphQLPerProjectConfig
