export type ServerExtensionConfig = {
  url: string
  headers: { [name: string]: string }
}

export type GraphQLConfigExtensions = {
  server?: ServerExtensionConfig,
  'server-query'?: ServerExtensionConfig,
  'server-mutation'?: ServerExtensionConfig,
  'server-subscription'?: ServerExtensionConfig,

  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath: string,

  include?: Array<string>,
  exclude?: Array<string>,

  extensions?: GraphQLConfigExtensions;
}

export type GraphQLProjectConfigData = GraphQLResolvedConfigData & {
  env?: { [name: string]: GraphQLResolvedConfigData }
}

export type GraphQLConfigData = GraphQLProjectConfigData & {
  projects?: { [projectName: string]: GraphQLProjectConfigData }
}
