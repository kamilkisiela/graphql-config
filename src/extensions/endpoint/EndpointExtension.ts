import { GraphQLClient } from 'graphql-request'
import {
  GraphQLSchema,
  buildClientSchema,
  introspectionQuery,
  IntrospectionQuery,
} from 'graphql'

import { resolveEnvsInValues, getUsedEnvs } from './resolveRefString';

export type GraphQLConfigEnpointsSubscription = {
  url: string;
  connectionParams?: { [name: string]: string }
}

export type GraphQLConfigEnpointConfig = {
  url: string
  headers?: { [name: string]: string }
  subscription?: GraphQLConfigEnpointsSubscription
}

export type GraphQLConfigEnpointsMap = {
  [env: string]: GraphQLConfigEnpointConfig
}

export type GraphQLConfigEnpointsData = string | GraphQLConfigEnpointConfig | GraphQLConfigEnpointsMap

export class GraphQLEndpointExtension {
  public raw: GraphQLConfigEnpointsData
  private configPath

  constructor(endpointConfig: GraphQLConfigEnpointsData, configPath: string) {
    this.raw = endpointConfig
    this.configPath = configPath
  }

  getRawEndpointsMap(): GraphQLConfigEnpointsMap {
    const endpoint = this.raw
    let result
    if (typeof endpoint === 'string') {
      result = {
        default: {
          url: endpoint,
        },
      }
    } else if (typeof endpoint !== 'object' || Array.isArray(endpoint)) {
      throw new Error(`${this.configPath}: "endpoint" should be string or object`)
    } else if (!endpoint['url']) {
      result = endpoint as GraphQLConfigEnpointsMap
    } else if (typeof endpoint['url'] === 'string') {
      result = {
        default: endpoint as GraphQLConfigEnpointConfig,
      }
    } else {
      throw new Error(`${this.configPath}: "url" should be a string`)
    }

    return result
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

  resolveSchema(): Promise<GraphQLSchema> {
    const client = this.getClient()
    return client.request(introspectionQuery).then(introspection => {
      return buildClientSchema(introspection as IntrospectionQuery)
    })
  }
}
