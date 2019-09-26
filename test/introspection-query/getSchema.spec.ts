import {printSchema, buildSchema} from 'graphql';
import {getGraphQLConfig} from '../../src';

test('reads single schema', async () => {
  const config = await getGraphQLConfig(__dirname);

  const typeDefs = /* GraphQL */ `
    schema {
      query: RootQueryType
    }

    type Bar {
      widgets: [Widget]
    }

    type RootQueryType {
      foo: String
      bar: Bar
    }

    type Widget {
      count: Int
    }
  `;

  expect(printSchema(config.getProjectConfig('testSchemaA').getSchema())).toBe(
    printSchema(buildSchema(typeDefs)),
  );
});
