import { IntrospectionQuery } from 'graphql'
import { GraphQLConfigEnpointsData } from './extensions/';

export type IntrospectionResult = {
  data?: IntrospectionQuery
  errors?: any
}

export type GraphQLConfigExtensions = {
  endpoint?: GraphQLConfigEnpointsData,
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
