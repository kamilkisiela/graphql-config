import test from 'ava'
import { getGraphQLProjectConfig, GraphQLEndpointExtension } from '../../'
import { serveSchema } from '../utils'

let endpoint:GraphQLEndpointExtension
test.beforeEach(() => {
  endpoint = getGraphQLProjectConfig().endpointExtension as GraphQLEndpointExtension
})

test('getEndpointsMap', async (t) => {
  t.deepEqual(endpoint.getRawEndpointsMap(), {
    default: {
      url: '${env:TEST_ENDPOINT_URL}',
    },
  })
})

test('getEndpointEnvVars should returns null for undefined env var', async (t) => {
  t.deepEqual(endpoint.getEnvVarsForEndpoint('default'), {TEST_ENDPOINT_URL: null})
})

test('getEndpointEnvVars should returns value for defined env var', async (t) => {
  const testURL = 'http://test.com'
  process.env['TEST_ENDPOINT_URL'] = testURL
  t.deepEqual(endpoint.getEnvVarsForEndpoint('default'), {TEST_ENDPOINT_URL: testURL})
  delete process.env['TEST_ENDPOINT_URL']
})

test('resolveSchemaFromEndpoint should throw when not all env variables are set', async (t) => {
  t.throws(() => endpoint.getEndpoint('default').resolveSchema())
})

test('ability to pass external values as env vars to resolveSchemaFromEndpoint', async (t) => {
  await serveSchema()
  t.notThrows(() => {
    return endpoint.getEndpoint('default', {TEST_ENDPOINT_URL: 'http://127.0.0.1:33333'}).resolveSchema()
  })
})
