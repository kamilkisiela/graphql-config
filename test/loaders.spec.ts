import {parse, DirectiveDefinitionNode, buildSchema} from 'graphql';

const schema = buildSchema(/* GraphQL */ `
  type Query {
    foo: String
  }
`);

jest.mock('@graphql-toolkit/core', () => {
  return {
    loadTypedefsSync() {
      return [
        {
          document: parse(/* GraphQL */ `
            type Query {
              foo: String @cache
            }
          `),
        },
      ];
    },
    loadSchemaSync() {
      return schema;
    },
    async loadSchema() {
      return schema;
    },
  };
});

import {LoadersRegistry} from '../src/loaders';

describe('middlewares', () => {
  test('loads Sources instead of GraphQLSchema when middlewares are defined', () => {
    const registry = new LoadersRegistry({cwd: __dirname});

    const cacheDirective: DirectiveDefinitionNode = {
      kind: 'DirectiveDefinition',
      name: {
        kind: 'Name',
        value: 'cache',
      },
      repeatable: false,
      locations: [
        {
          kind: 'Name',
          value: 'FIELD_DEFINITION',
        },
      ],
    };

    registry.use(doc => {
      return {
        ...doc,
        definitions: [...doc.definitions, cacheDirective],
      };
    });

    const schema = registry.loadSchemaSync('anything');

    expect(schema.getDirective('cache')).toBeDefined();
  });

  test('no middlewares means we load GraphQLSchema directly', async () => {
    const registry = new LoadersRegistry({cwd: __dirname});

    const received = registry.loadSchemaSync('anything');
    const receivedAsync = await registry.loadSchema('anything');

    expect(received).toBe(schema);
    expect(receivedAsync).toBe(schema);
  });
});
