import {parse, DirectiveDefinitionNode, buildSchema} from 'graphql';
import {Loader, Source} from '@graphql-tools/utils';
import {
  loadTypedefsSync,
  loadSchemaSync,
  loadSchema,
} from '@graphql-tools/load';

const schema = buildSchema(/* GraphQL */ `
  type Query {
    foo: String
  }
`);

jest.mock('@graphql-tools/load', () => {
  return {
    loadTypedefsSync: jest.fn(() => {
      return [
        {
          document: parse(/* GraphQL */ `
            type Query {
              foo: String @cache
            }
          `),
        },
      ];
    }),
    loadSchemaSync: jest.fn(() => {
      return schema;
    }),
    loadSchema: jest.fn(async () => {
      return schema;
    }),
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

    registry.use((doc) => {
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

describe('override', () => {
  beforeAll(() => {
    (loadTypedefsSync as any).mockImplementation(
      jest.requireActual('@graphql-tools/load').loadTypedefsSync,
    );
    (loadSchemaSync as any).mockImplementation(
      jest.requireActual('@graphql-tools/load').loadSchemaSync,
    );
    (loadSchema as any).mockImplementation(
      jest.requireActual('@graphql-tools/load').loadSchema,
    );
  });

  test('overrides default loaders', async () => {
    const registry = new LoadersRegistry({cwd: __dirname});
    const differentSchema = buildSchema(/* GraphQL */ `
      type Query {
        bar: String
      }
    `);

    class CustomLoader implements Loader {
      loaderId(): string {
        return 'custom';
      }
      async canLoad(): Promise<boolean> {
        return true;
      }
      canLoadSync(): boolean {
        return true;
      }
      async load(): Promise<Source> {
        return {schema: differentSchema};
      }
      loadSync(): Source {
        return {schema: differentSchema};
      }
    }

    registry.override([new CustomLoader()]);

    const received = registry.loadSchemaSync('anything');
    const receivedAsync = await registry.loadSchema('anything');

    expect(received.getQueryType().getFields()['bar']).toBeDefined();
    expect(receivedAsync.getQueryType().getFields()['bar']).toBeDefined();
  });
});
