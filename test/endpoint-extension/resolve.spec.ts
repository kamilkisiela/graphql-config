import { graphql, introspectionQuery } from 'graphql';
import { GraphQLProjectConfig } from '../../src';
import { serveSchema } from '../utils';

beforeAll(() => {
  serveSchema(33333);
});

const confPath = `${__dirname}/.graphqlconfig`;

test('getEndpointsMap when endpoint is string url', async () => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://default',
      },
    },
  };

  const config = new GraphQLProjectConfig(configData, confPath);
  const endpoints = config.endpointsExtension;
  expect(endpoints && endpoints.getRawEndpointsMap()).toEqual({
    dev: { url: 'http://default' },
  });
});

test('getEndpointsMap when endpoint is single endpoint config', async () => {
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
  };

  const config = new GraphQLProjectConfig(configData, confPath, undefined);
  const endpoint = config.endpointsExtension;
  expect(endpoint && endpoint.getRawEndpointsMap()).toEqual({
    dev: configData.extensions.endpoints.dev,
  });
});

test('getEndpointsMap when endpoint is endpoints map', async () => {
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
  };

  const config = new GraphQLProjectConfig(configData, confPath, undefined);

  const endpoint = config.endpointsExtension;
  expect(endpoint && endpoint.getRawEndpointsMap()).toEqual({
    dev: {
      url: 'http://dev',
    },
    prod: {
      url: 'http://prod',
      subscription: {
        url: 'ws://prod',
      },
    },
  });
});

test('resolveSchemaFromEndpoint should throw if non-existing endpoint is specified', async () => {
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
  };
  const config = new GraphQLProjectConfig(configData, confPath, undefined);
  const endpoint = config.endpointsExtension;
  expect(
    () => endpoint && endpoint.getEndpoint('prod').resolveSchema(),
  ).toThrowError(
    /"prod" is not valid endpoint name. Valid endpoint names: dev/,
  );
});

test('resolveSchemaFromEndpoint HTTP', async () => {
  const configData = {
    schemaPath: '../schema.json',
    extensions: {
      endpoints: {
        dev: 'http://127.0.0.1:33333',
      },
    },
  };

  const config = new GraphQLProjectConfig(configData, confPath, undefined);
  if (!config.endpointsExtension) {
    throw 'endpointExtension can\'t be empty';
  }
  const schema = await config.endpointsExtension
    .getEndpoint('dev')
    .resolveSchema();
  const resolvedIntrospection = await graphql(schema, introspectionQuery);
  expect(resolvedIntrospection).toMatchSnapshot();
});
