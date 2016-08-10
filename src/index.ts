import { isWebUri } from 'valid-url'
import { readFileSync } from 'fs'
import { join } from 'path'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import * as fetch from 'node-fetch'

type Config = ConfigFile | ConfigRequest

interface ConfigFile {
  type: 'file'
  file: string
}

interface ConfigRequest {
  type: 'request'
  url: string
  headers?: { [key: string]: string }
}

interface Schema {
  data: any
}

export function parse (): Config {

  try {
    const packageJson = require(`${process.cwd()}/package.json`)
    if (packageJson.hasOwnProperty('graphql')) {
      return parseConfigJson(packageJson.graphql)
    }
  } catch (ex) {
    // do nothing here
  }

  try {
    const graphqlrc = JSON.parse(readFileSync(`${process.cwd()}/.graphqlrc`, 'utf-8'))
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
      const schema = require(join(process.cwd(), config.file))
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
        .then((res) => {
          if (res.ok) {
            return res.json()
              .then((schema) => {
                console.log(`Loaded GraphQL schema from ${configRequest.url}`)
                return schema
              })
          } else {
            return res.text()
              .then((text) => {
                throw new Error(`${res.statusText}: ${text}`)
              })
          }
        })
    default: throw new Error(`Invalid config: ${JSON.stringify(config)}`)
  }
}

function parseConfigJson (json: any): Config {
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

  throw new Error(`Invalid configuration file: ${JSON.stringify(json)}`)
}
