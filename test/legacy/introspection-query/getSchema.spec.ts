import {printSchema, buildSchema} from 'graphql';
import {getGraphQLConfig} from '../../../src/legacy';

test('reads single schema', async () => {
  const config = getGraphQLConfig(__dirname);

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
