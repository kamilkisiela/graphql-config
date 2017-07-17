export type GraphQLConfigExtensions = {
  'endpoint'?: string | {
    url: string
    headers?: { [name: string]: string }
  },
  'subscription-endpoint'?: string | {
    url: string,
    connectionParams?: { [name: string]: string }
  },

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
