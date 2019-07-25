import test from 'ava'
import { graphql, introspectionQuery } from 'graphql'
import { GraphQLProjectConfig } from '../../'
import { serveSchema } from '../utils'

test.before(() => {
  return serveSchema()
})

const confPath = `${__dirname}/.graphql`

test('getEndpointsMap when endpoint is string url', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://default',
      },
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath)
  const endpoints = config.endpointsExtension
  t.deepEqual(endpoints && endpoints.getRawEndpointsMap(), {
    dev: { url: 'http://default' },
  })
})

test('getEndpointsMap when endpoint is single endpoint config', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: {
          url: 'http://default',
          subscription: {
            url: 'ws://test',
          },
        },
      },
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath, undefined)
  const endpoint = config.endpointsExtension
  t.deepEqual(endpoint && endpoint.getRawEndpointsMap(), {
    dev: configData.extensions.endpoints.dev,
  })
})

test('getEndpointsMap when endpoint is endpoints map', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://dev',
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

  const endpoint = config.endpointsExtension
  t.deepEqual(endpoint && endpoint.getRawEndpointsMap(), {
    dev: {
      url: 'http://dev',
    },
    prod: {
      url: 'http://prod',
      subscription: {
        url: 'ws://prod',
      },
    },
  })
})

test('resolveSchemaFromEndpoint should throw if non-existing endpoint is specified', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
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
  const endpoint = config.endpointsExtension
  error = t.throws(
    () => endpoint && endpoint.getEndpoint('prod').resolveSchema(),
  )
  t.regex(
    error.message,
    /"prod" is not valid endpoint name. Valid endpoint names: dev/,
  )
})

test('resolveSchemaFromEndpoint HTTP', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://127.0.0.1:33333',
      },
    },
  }

  const config = new GraphQLProjectConfig(configData, confPath, undefined)
  if (!config.endpointsExtension) {
    throw new Error('endpointExtension can\'t be empty')
  }
  const schema = await config.endpointsExtension
    .getEndpoint('dev')
    .resolveSchema()
  const resolvedIntrospection = await graphql(schema, introspectionQuery)
  t.snapshot(resolvedIntrospection)
})
