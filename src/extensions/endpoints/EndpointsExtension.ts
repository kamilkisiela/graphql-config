import { GraphQLClient } from 'graphql-request'
import {
  GraphQLSchema,
  printSchema,
  buildClientSchema,
  introspectionQuery,
  IntrospectionQuery,
} from 'graphql'

import { resolveEnvsInValues, getUsedEnvs } from './resolveRefString';
import { IntrospectionResult } from '../../types'

export type GraphQLConfigEnpointsSubscription = {
  url: string;
  connectionParams?: { [name: string]: string }
}

export type GraphQLConfigEnpointConfig = {
  url: string
  headers?: { [name: string]: string }
  subscription?: GraphQLConfigEnpointsSubscription
}

export type GraphQLConfigEnpointsMapData = {
  [env: string]: GraphQLConfigEnpointConfig | string
}

export type GraphQLConfigEnpointsMap = {
  [env: string]: GraphQLConfigEnpointConfig
}

export type GraphQLConfigEnpointsData = GraphQLConfigEnpointsMap

export class GraphQLEndpointsExtension {
  public raw: GraphQLConfigEnpointsMapData
  private configPath

  constructor(endpointConfig: GraphQLConfigEnpointsMapData, configPath: string) {
    this.raw = endpointConfig
    this.configPath = configPath
  }

  getRawEndpointsMap(): GraphQLConfigEnpointsMap {
    const endpoints = this.raw
    return valuesMap(endpoints, value => {
      if (typeof value === 'string') {
        return { url: value }
      }
      return value;
    })
  }

  getEnvVarsForEndpoint(
    endpointName: string = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME,
  ): { [name: string]: string | null } {
    const endpoint = this.getRawEndpointsMap()[endpointName]
    if (!endpoint || !endpoint.url) {
      throw new Error(
        `${this.configPath}: "${endpointName}" is not valid endpoint name. Valid endpoint names: ` +
        Object.keys(this.getRawEndpointsMap()).join(', ')
      )
    }
    return getUsedEnvs(endpoint)
  }

  getEndpoint(
    endpointName: string = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME,
    env: { [name: string]: string } = process.env
  ): GraphQLEndpoint {
    const endpoint = this.getRawEndpointsMap()[endpointName]
    if (!endpoint) {
      throw new Error(
        `${this.configPath}: "${endpointName}" is not valid endpoint name. Valid endpoint names: ` +
        Object.keys(this.getRawEndpointsMap()).join(', ')
      )
    }
    if (!endpoint.url) {
      throw new Error(
        `${this.configPath}: "url" is required but is not specified for "${endpointName}" endpoint`
      )
    }
    try {
      return new GraphQLEndpoint(resolveEnvsInValues(endpoint, env))
    } catch (e) {
      // prefix error
      e.message = `${this.configPath}: ${e.message}`;
      throw e;
    }
  }

}

export class GraphQLEndpoint {
  public url: string
  public headers: { [name: string] : string}
  public subscription: GraphQLConfigEnpointsSubscription

  constructor(resolvedConfig: GraphQLConfigEnpointConfig) {
    Object.assign(this, resolvedConfig);
  }

  getClient(
    clientOptions: any = {}
  ): GraphQLClient {
    return new GraphQLClient(this.url, { ...clientOptions, headers: this.headers })
  }

  async resolveIntrospection(): Promise<IntrospectionResult> {
    const client = this.getClient()
    const data = await client.request(introspectionQuery)
    return { data } as IntrospectionResult
  }

  async resolveSchema(): Promise<GraphQLSchema> {
    const introspection = await this.resolveIntrospection()
    return buildClientSchema(introspection.data)
  }

  async resolveSchemaSDL(): Promise<string> {
    const schema = await this.resolveSchema()
    return printSchema(schema)
  }
}


function valuesMap<T extends any, K>(
  obj: {[key: string]: T},
  fn: (val: T) => K
):{[key: string]: K} {
  const res: {[key: string]: K} = {}
  for (let key in obj) {
    res[key] = fn(obj[key]);
  }
  return res;
}
