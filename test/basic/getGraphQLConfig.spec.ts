import { join, resolve } from 'path';
import { printSchema, buildSchema } from 'graphql';
import { getGraphQLConfig, GraphQLConfig } from '../../src';

const CONFIG_DIR = join(__dirname, 'config');

let config: GraphQLConfig;

beforeEach(() => {
  config = getGraphQLConfig(CONFIG_DIR);
});

test('returns a correct name', () => {
  const testWithSchemaConfig = config.getProjectConfig('testWithSchema');
  expect(testWithSchemaConfig.projectName).toEqual('testWithSchema');
});

test('returns config for file', () => {
  const testWithSchemaConfig = config.getConfigForFile(
    resolve('./config/schema-a.graphql'),
  );
  if (testWithSchemaConfig) {
    expect(testWithSchemaConfig.projectName).toEqual('testWithSchema');
  }

  expect.assertions(1);
});

test('returns a correct root dir', () => {
  expect(config.configDir).toEqual(CONFIG_DIR);
});

test('returns a correct schema path', () => {
  expect(config.getProjectConfig('testWithSchema').schemaPath).toEqual(
    join(CONFIG_DIR, '__schema__/StarWarsSchema.graphql'),
  );
  expect(config.getProjectConfig('testWithoutSchema').schemaPath).toEqual(null);
});

test('reads single schema', () => {
  const typeDefs = `\
type Query {
  hello: String!
}
`;

  expect(printSchema(config.getProjectConfig('testSchemaA').getSchema())).toBe(
    typeDefs,
  );
});

test('reads imported schema', () => {
  const typeDefs = /* GraphQL */ `
    type Query {
      hello: String!
      user: User!
    }

    type User {
      name: String
    }
  `;

  expect(printSchema(config.getProjectConfig('testSchemaB').getSchema())).toBe(
    printSchema(buildSchema(typeDefs)),
  );
});
