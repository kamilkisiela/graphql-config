import { DirectiveDefinitionNode, buildSchema, GraphQLSchema, Kind } from 'graphql';
import { Loader, Source } from '@graphql-tools/utils';
import { beforeAll, test, describe, expect } from '@jest/globals';
import { LoadersRegistry } from 'graphql-config';
import { loadTypedefsSync, loadSchemaSync, loadSchema, LoadSchemaOptions } from '@graphql-tools/load';

jest.mock('@graphql-tools/load', () => {
  const { parse, buildSchema } = require('graphql');
  const document = parse(/* GraphQL */ `
    type Query {
      foo: String @cache
    }
  `);

  const schema = buildSchema(/* GraphQL */ `
    type Query {
      foo: String
    }
  `);

  schema.isTheOne = true;

  return {
    loadTypedefs: jest.fn(() => {
      return [{ document }];
    }),
    loadTypedefsSync: jest.fn(() => {
      return [{ document }];
    }),
    loadSchemaSync: jest.fn(() => {
      return schema;
    }),
    loadSchema: jest.fn(async () => {
      return schema;
    }),
  };
});

describe('middlewares', () => {
  test('loads Sources instead of GraphQLSchema when middlewares are defined', () => {
    const registry = new LoadersRegistry({ cwd: __dirname });

    const cacheDirective: DirectiveDefinitionNode = {
      kind: Kind.DIRECTIVE_DEFINITION,
      name: {
        kind: Kind.NAME,
        value: 'cache',
      },
      repeatable: false,
      locations: [
        {
          kind: Kind.NAME,
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
    const registry = new LoadersRegistry({ cwd: __dirname });

    const received = registry.loadSchemaSync('anything');
    const receivedAsync = await registry.loadSchema('anything');

    expect(received.isTheOne).toEqual(true);
    expect(receivedAsync.isTheOne).toEqual(true);
  });
});

class CustomLoader implements Loader {
  private schema: GraphQLSchema;

  constructor(schema) {
    this.schema = schema;
  }

  loaderId(): string {
    return 'custom';
  }

  async canLoad(): Promise<boolean> {
    return true;
  }

  canLoadSync(): boolean {
    return true;
  }

  async load(): Promise<Source[]> {
    return [{ schema: this.schema }];
  }

  loadSync(): Source[] {
    return [{ schema: this.schema }];
  }
}

const differentSchema = buildSchema(/* GraphQL */ `
  type Query {
    bar: String
  }
`);

describe('override', () => {
  beforeAll(() => {
    (loadTypedefsSync as jest.Mock).mockImplementation(jest.requireActual('@graphql-tools/load').loadTypedefsSync);
    (loadSchemaSync as jest.Mock).mockImplementation(jest.requireActual('@graphql-tools/load').loadSchemaSync);
    (loadSchema as jest.Mock).mockImplementation(jest.requireActual('@graphql-tools/load').loadSchema);
  });

  test('overrides default loaders', async () => {
    const registry = new LoadersRegistry({ cwd: __dirname });

    registry.override([new CustomLoader(differentSchema)]);

    const received = registry.loadSchemaSync('anything');
    const receivedAsync = await registry.loadSchema('anything');

    expect(received.getQueryType().getFields()['bar']).toBeDefined();
    expect(receivedAsync.getQueryType().getFields()['bar']).toBeDefined();
  });

  test('allows custom loader options', async () => {
    const registry = new LoadersRegistry({ cwd: __dirname });
    const customOptions = { assumeValidSDL: true } as Partial<LoadSchemaOptions>;
    const customLoader = new CustomLoader(differentSchema);
    const expectedOptions = {
      ...customOptions,
      cwd: __dirname,
      loaders: [customLoader],
    };

    registry.override([customLoader]);

    const received = registry.loadSchemaSync('anything', null, customOptions);
    const receivedAsync = await registry.loadSchema('anything', null, customOptions);

    expect(received.getQueryType().getFields().bar).toBeDefined();
    expect(receivedAsync.getQueryType().getFields().bar).toBeDefined();
    expect(loadSchema).toBeCalledWith('anything', expectedOptions);

    expect(loadSchemaSync).toBeCalledWith('anything', expectedOptions);
  });
});
