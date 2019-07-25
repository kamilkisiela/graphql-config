import test from 'ava'
import {
  getGraphQLProjectConfig,
  GraphQLEndpointsExtension,
  getUsedEnvs,
} from '../../'
import { serveSchema } from '../utils'

let endpoints: GraphQLEndpointsExtension
test.beforeEach(async () => {
  endpoints = (await getGraphQLProjectConfig(__dirname))!
    .endpointsExtension as GraphQLEndpointsExtension
})

test('getEndpointsMap', async t => {
  t.deepEqual(endpoints.getRawEndpointsMap(), {
    default: {
      url: '${env:TEST_ENDPOINT_URL}',
    },
  })
})

test('getEndpointEnvVars should returns null for undefined env var', async t => {
  t.deepEqual(endpoints.getEnvVarsForEndpoint('default'), {
    TEST_ENDPOINT_URL: null,
  })
})

test('getEndpointEnvVars should returns value for defined env var', async t => {
  const testURL = 'http://test.com'
  process.env['TEST_ENDPOINT_URL'] = testURL
  t.deepEqual(endpoints.getEnvVarsForEndpoint('default'), {
    TEST_ENDPOINT_URL: testURL,
  })
  delete process.env['TEST_ENDPOINT_URL']
})

test('resolveSchemaFromEndpoint should throw when not all env variables are set', async t => {
  t.throws(() => endpoints.getEndpoint('default').resolveSchema())
})

test('ability to pass external values as env vars to resolveSchemaFromEndpoint', async t => {
  await serveSchema()
  t.notThrows(() => {
    return endpoints
      .getEndpoint('default', { TEST_ENDPOINT_URL: 'http://127.0.0.1:33333' })
      .resolveSchema()
  })
})

test('getUsedEnvs', async t => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://127.0.0.1:${env:EXTENSION_TEST_PORT}',
      },
    },
  }

  const envs = getUsedEnvs(configData)

  t.is(Object.keys(envs)[0], 'EXTENSION_TEST_PORT')
})
