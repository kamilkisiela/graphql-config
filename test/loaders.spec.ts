import {parse, DirectiveDefinitionNode} from 'graphql';

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
  };
});

import {LoadersRegistry} from '../src/loaders';

test('Middlewares', () => {
  const registry = new LoadersRegistry({cwd: __dirname});

  expect(() => {
    registry.loadSchemaSync('anything');
  }).toThrow(/cache/);

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
