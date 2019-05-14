import { IntrospectionQuery } from 'graphql'
import { GraphQLConfigEnpointsData } from './extensions/';

export type Variables = { [key: string]: any }

export interface Headers {
  [key: string]: string
}

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

export interface GraphQLError {
  message: string
  locations: { line: number, column: number }[]
  path: string[]
}

export interface GraphQLResponse {
  data?: any
  errors?: GraphQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface GraphQLRequestContext {
  query: string
  variables?: Variables
}

export class ClientError extends Error {

  response: GraphQLResponse
  request: GraphQLRequestContext

  constructor (response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({ response, request })}`

    super(message)

    this.response = response
    this.request = request

    // this is needed as Safari doesn't support .captureStackTrace
    /* tslint:disable-next-line */
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ClientError)
    }
  }

  private static extractMessage (response: GraphQLResponse): string {
    try {
      return response.errors![0].message
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`
    }
  }
}
