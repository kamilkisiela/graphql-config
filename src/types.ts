export type GraphQLConfigEnpointConfig = {
  url: string
  headers?: { [name: string]: string }
  subscription?: {
    url: string;
    connectionParams?: { [name: string]: string }
  }
}

export type GraphQLConfigEnpointsMap = {
  [env: string]: GraphQLConfigEnpointConfig
}

export type GraphQLConfigExtensions = {
  endpoint?: string | GraphQLConfigEnpointConfig | GraphQLConfigEnpointsMap,
  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath: string,

  include?: Array<string>,
  exclude?: Array<string>,

  extensions?: GraphQLConfigExtensions;
}

export type GraphQLConfigData = GraphQLResolvedConfigData & {
  projects?: { [projectName: string]: GraphQLResolvedConfigData }
}
