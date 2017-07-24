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
    if (typeof endpoints !== 'object' || Array.isArray(endpoints)) {
      throw new Error(`${this.configPath}: "endpoints" should be an object`)
    } else {
      return valuesMap(endpoints, value => {
        if (typeof value === 'string') {
          return { url: value }
        }
        return value;
      })
    }
  }

  getEnvVarsForEndpoint(
    endpointName: string = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME || 'default',
  ): { [name: string]: string | null } {
    const endpoint = this.getRawEndpointsMap()[endpointName]
    if (!endpoint || !endpoint.url) {
      throw new Error(`Endpoint "${endpointName}" is not defined in "${this.configPath}"`)
    }
    return getUsedEnvs(endpoint)
  }

  getEndpoint(
    endpointName: string = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME || 'default',
    env: { [name: string]: string } = process.env
  ): GraphQLEndpoint {
    const endpoint = this.getRawEndpointsMap()[endpointName]
    if (!endpoint || !endpoint.url) {
      throw new Error(`Endpoint "${endpointName}" is not defined in ${this.configPath}`)
    }
    return new GraphQLEndpoint(resolveEnvsInValues(endpoint, env))
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
