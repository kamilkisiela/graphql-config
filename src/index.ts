import { isWebUri } from 'valid-url'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { graphql } from 'graphql/graphql'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import * as fetch from 'node-fetch'

type Config = ConfigFile | ConfigRequest | ConfigGraphQLJS

interface ConfigFile {
  type: 'file'
  file: string
}

interface ConfigRequest {
  type: 'request'
  url: string
  headers?: { [key: string]: string }
}

interface ConfigGraphQLJS {
  type: 'graphql-js',
  file: string
}

interface Schema {
  data: any
}

export function parse (path: string = process.cwd()): Config {
  try {
    const packageJson = require(`${path}/package.json`)
    if (packageJson.hasOwnProperty('graphql')) {
      return parseConfigJson(packageJson.graphql)
    }
  } catch (ex) {
    // do nothing here
  }

  try {
    const graphqlrc = JSON.parse(readFileSync(`${path}/.graphqlrc`, 'utf-8'))
    return parseConfigJson(graphqlrc)
  } catch (ex) {
    // do nothing here
  }

  if (process.env.hasOwnProperty('GRAPHQL_ENDPOINT')) {
    const endpoint = process.env.GRAPHQL_ENDPOINT
    if (!isWebUri(endpoint)) {
      throw new Error(`No valid GraphQL endpoint: ${endpoint}`)
    }

    return {
      url: endpoint,
      type: 'request',
    } as ConfigRequest
  }

  throw new Error('Couldn\'t find a GraphQL config. Please refer to https://github.com/graphcool/graphql-config')
}

export async function resolveSchema (config: Config): Promise<Schema> {
  switch (config.type) {
    case 'file':
      const schema = require(resolve(config.file))
      console.log(`Loaded GraphQL schema from ${config.file}`)
      return Promise.resolve(schema)
    case 'request':
      const configRequest = config as ConfigRequest
      return fetch(configRequest.url, {
        method: 'POST',
        body: JSON.stringify({
          query: introspectionQuery,
        }),
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
          },
          configRequest.headers || {}
        ),
      })
        .then((res): Promise<Schema> => {
          if (res.ok) {
            return res.json()
              .then((schema) => {
                console.log(`Loaded GraphQL schema from ${configRequest.url}`)
                return schema
              })
          } else {
            return res.text()
              .then((text): Schema => {
                throw new Error(`${res.statusText}: ${text}`)
              })
          }
        })
     case 'graphql-js':
       const schemaSource = require(resolve(config.file))
       console.log(`Loaded GraphQL schema from ${config.file}`)
       return graphql(schemaSource.default || schemaSource, introspectionQuery)

    default: throw new Error(`Invalid config: ${JSON.stringify(config)}`)
  }
}

export function parseConfigJson (json: any): Config {
  if (json.file) {
    return {
      file: json.file,
      type: 'file',
    } as ConfigFile
  }

  if (json.request) {
    return Object.assign(
      {
        type: 'request',
      },
      json.request
    ) as ConfigRequest
  }

  if (json['graphql-js']) {
    return {
      type: 'graphql-js',
      file: json['graphql-js'],
    } as ConfigGraphQLJS
  }

  throw new Error(`Invalid configuration file: ${JSON.stringify(json)}`)
}
