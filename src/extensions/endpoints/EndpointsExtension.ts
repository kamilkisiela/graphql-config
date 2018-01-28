import { GraphQLClient } from 'graphql-request'
import {
  GraphQLSchema,
  printSchema,
  buildClientSchema,
  introspectionQuery,
  IntrospectionQuery,
} from 'graphql'

import { resolveEnvsInValues, getUsedEnvs } from './resolveRefString'
import { IntrospectionResult } from '../../types'

export type GraphQLConfigEnpointsSubscription = {
  url: string
  connectionParams?: { [name: string]: string | undefined }
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
  [env: string]: GraphQLConfigEnpointConfig | GraphQLEndpoint
}

export type GraphQLConfigEnpointsData = GraphQLConfigEnpointsMapData

export class GraphQLEndpointsExtension {
  public raw: GraphQLConfigEnpointsMapData
  private configPath

  constructor(
    endpointConfig: GraphQLConfigEnpointsMapData,
    configPath: string,
  ) {
    this.raw = endpointConfig
    this.configPath = configPath
  }

  getRawEndpointsMap(): GraphQLConfigEnpointsMap {
    const endpoints = {}
    for (let name in this.raw) {
      const rawEndpoint = this.raw[name]
      if (typeof rawEndpoint === 'string') {
        endpoints[name] = { url: rawEndpoint }
      } else {
        endpoints[name] = rawEndpoint
      }
    }
    return endpoints
  }

  getEnvVarsForEndpoint(
    endpointName: string,
  ): { [name: string]: string | null } {
    return getUsedEnvs(this.getRawEndpoint(endpointName))
  }

  getEndpoint(
    endpointName: string,
    env: { [name: string]: string | undefined } = process.env,
  ): GraphQLEndpoint {
    const endpoint = this.getRawEndpoint(endpointName)
    try {
      const resolved = resolveEnvsInValues(endpoint, env)
      if (!(resolved instanceof GraphQLEndpoint)) {
        return new GraphQLEndpoint(resolved)
      }
      return resolved
    } catch (e) {
      e.message = `${this.configPath}: ${e.message}`
      throw e
    }
  }

  private getRawEndpoint(
    endpointName: string | undefined = process.env.GRAPHQL_CONFIG_ENDPOINT_NAME,
  ) {
    const rawEndpointsMap = this.getRawEndpointsMap()
    const endpointNames = Object.keys(rawEndpointsMap)

    if (endpointName == null) {
      if (endpointNames.length === 1) {
        endpointName = endpointNames[0]
      } else {
        throw new Error(
          'You have to specify endpoint name or define GRAPHQL_CONFIG_ENDPOINT_NAME enviroment variable',
        )
      }
    }

    const endpoint = rawEndpointsMap[endpointName]
    if (!endpoint) {
      throw new Error(
        `${this.configPath}: "${endpointName}" is not valid endpoint name. ` +
          `Valid endpoint names: ${endpointNames.join(', ')}`,
      )
    }

    if (!endpoint.url && !(endpoint instanceof GraphQLEndpoint)) {
      throw new Error(
        `${this
          .configPath}: "url" is required but is not specified for "${endpointName}" endpoint`,
      )
    }

    return endpoint
  }
}

export class GraphQLEndpoint {
  public url: string
  public headers: { [name: string]: string }
  public subscription: GraphQLConfigEnpointsSubscription

  constructor(resolvedConfig: GraphQLConfigEnpointConfig) {
    Object.assign(this, resolvedConfig)
  }

  getClient(clientOptions: any = {}): GraphQLClient {
    return new GraphQLClient(this.url, {
      ...clientOptions,
      headers: this.headers,
    })
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
