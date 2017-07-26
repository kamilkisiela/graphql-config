import { IntrospectionQuery } from 'graphql'
import { GraphQLConfigEnpointsData } from './extensions/';

export type IntrospectionResult = {
  data: IntrospectionQuery
  extensions?: Object
  errors?: any
}

export type GraphQLConfigExtensions = {
  endpoints?: GraphQLConfigEnpointsData,
  [name: string]: any
}

export type GraphQLResolvedConfigData = {
  schemaPath: string,

  includes?: Array<string>,
  excludes?: Array<string>,

  extensions?: GraphQLConfigExtensions;
}

export type GraphQLConfigData = GraphQLResolvedConfigData & {
  projects?: { [projectName: string]: GraphQLResolvedConfigData }
}
