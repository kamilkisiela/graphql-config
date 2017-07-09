type GraphQLConfigurationExtension = {
  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath?: string,
  schemaUrl?: string,

  includeDirs?: Array<string>,
  excludeDirs?: Array<string>,

  extensions?: {[name: string]: GraphQLConfigurationExtension}
}

export type GraphQLPerEnvConfig = {
  env?: {[name: string]: GraphQLResolvedConfigData}
}

export type GraphQLProjectConfigData = GraphQLResolvedConfigData & GraphQLPerEnvConfig

export type GraphQLConfigData = GraphQLProjectConfigData & {
  projects?: {
    [projectName: string]: GraphQLProjectConfigData
  }
}
