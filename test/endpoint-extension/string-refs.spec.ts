import {
  getGraphQLProjectConfig,
  GraphQLEndpointsExtension,
  getUsedEnvs,
} from '../../src';
import {serveSchema} from '../utils';

let endpoints: GraphQLEndpointsExtension;
beforeEach(async () => {
  endpoints = (await getGraphQLProjectConfig(__dirname)).endpointsExtension!;
});

test('getEndpointsMap', async () => {
  expect(endpoints.getRawEndpointsMap()).toEqual({
    default: {
      url: '${env:TEST_ENDPOINT_URL}',
    },
  });
});

test('getEndpointEnvVars should returns null for undefined env var', async () => {
  expect(endpoints.getEnvVarsForEndpoint('default')).toEqual({
    TEST_ENDPOINT_URL: null,
  });
});

test('getEndpointEnvVars should returns value for defined env var', async () => {
  const testURL = 'http://test.com';
  process.env['TEST_ENDPOINT_URL'] = testURL;
  expect(endpoints.getEnvVarsForEndpoint('default')).toEqual({
    TEST_ENDPOINT_URL: testURL,
  });
  delete process.env['TEST_ENDPOINT_URL'];
});

test('resolveSchemaFromEndpoint should throw when not all env variables are set', async () => {
  expect(() => endpoints.getEndpoint('default').resolveSchema()).toThrow();
});

test('ability to pass external values as env vars to resolveSchemaFromEndpoint', async () => {
  serveSchema(33333);
  expect(() => {
    return endpoints
      .getEndpoint('default', {TEST_ENDPOINT_URL: 'http://127.0.0.1:33333'})
      .resolveSchema();
  }).not.toThrow();
});

test('getUsedEnvs', async () => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://127.0.0.1:${env:EXTENSION_TEST_PORT}',
      },
    },
  };

  const envs = getUsedEnvs(configData);

  expect(Object.keys(envs)[0]).toBe('EXTENSION_TEST_PORT');
});
