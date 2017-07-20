import test from 'ava'
import { graphql, introspectionQuery } from 'graphql'
import { GraphQLProjectConfig, GraphQLEndpointExtension } from '../../'
import { serveSchema } from '../utils'
const introspection = require('../schema.json')

test.before(async (t) => {
  return await serveSchema()
})


const confPath = `${__dirname}/.graphqlrc`

test('getEndpointsMap when endpoint is string url', async (t) => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: 'http://default',
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath)
  const endpoint = config.endpointExtension
  t.deepEqual(endpoint && endpoint.getRawEndpointsMap(), { default: { url: 'http://default' }})
})

test('getEndpointsMap when endpoint is single endpoint config', async (t) => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: {
        url: 'http://default',
        subscription: {
          url: 'ws://test',
        },
      },
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath, undefined)
  const endpoint = config.endpointExtension
  t.deepEqual(endpoint && endpoint.getRawEndpointsMap(), { default: configData.extensions.endpoint })
})

test('getEndpointsMap when endpoint is endpoints map', async (t) => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: {
        dev: {
          url: 'http://dev',
          subscription: {
            url: 'ws://dev',
          },
        },
        prod: {
          url: 'http://prod',
          subscription: {
            url: 'ws://prod',
          },
        },
      },
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath, undefined)

  const endpoint = config.endpointExtension
  t.deepEqual(endpoint && endpoint.getRawEndpointsMap(), configData.extensions.endpoint)
})

test('resolveSchemaFromEndpoint should throw if non-existing endpoint is specified', async (t) => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: {
        dev: {
          url: 'http://dev',
          subscription: {
            url: 'ws://dev',
          },
        },
      },
    },
  }
  const config = new GraphQLProjectConfig(configData, confPath, undefined)
  let error
  const endpoint = config.endpointExtension
  error = t.throws(() => endpoint && endpoint.getEndpoint('prod').resolveSchema())
  t.regex(error.message, /^Endpoint.*is not defined/)
  error = t.throws(() => endpoint && endpoint.getEndpoint('prod').resolveSchema())
  t.regex(error.message, /^Endpoint.*is not defined/)
})

test('resolveSchemaFromEndpoint HTTP', async (t) => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: 'http://127.0.0.1:33333',
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath, undefined)
  if (!config.endpointExtension){
    throw 'endpointExtension can\'t be empty'
  }
  const schema = await config.endpointExtension.getEndpoint().resolveSchema()
  const resolvedIntrospection = await graphql(schema, introspectionQuery)
  t.deepEqual(resolvedIntrospection, introspection)
})
