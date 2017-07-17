export type GraphQLConfigEnpointConfig = {
  url: string
  headers?: { [name: string]: string }
  subscription?: {
    url: string;
    connectionParams?: { [name: string]: string }
  }
}

export type GraphQLConfigExtensions = {
  endpoint: string | GraphQLConfigEnpointConfig | {
    [env: string]: GraphQLConfigEnpointConfig
  },

  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath: string,

  include?: Array<string>,
  exclude?: Array<string>,

  extensions: GraphQLConfigExtensions;
}

export type GraphQLConfigData = GraphQLResolvedConfigData & {
  projects?: { [projectName: string]: GraphQLResolvedConfigData }
}
