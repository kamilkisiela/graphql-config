export type GraphQLConfigExtensionEnvs = {
  'env'?: { [name: string]: GraphQLConfigBaseExtensions }
}

export type GraphQLConfigBaseExtensions = {
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

export type GraphQLConfigExtensions = GraphQLConfigExtensionEnvs & GraphQLConfigBaseExtensions

export type GraphQLResolvedConfigData = {
  schemaPath: string,

  include?: Array<string>,
  exclude?: Array<string>,

  extensions?: GraphQLConfigExtensions;
}

export type GraphQLConfigData = GraphQLResolvedConfigData & {
  projects?: { [projectName: string]: GraphQLResolvedConfigData }
}
