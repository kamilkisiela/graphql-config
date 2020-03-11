import {resolve} from 'path';
import {TempDir} from './utils/temp-dir';
import {loadConfig} from '../src/config';
import {ConfigNotFoundError} from '../src/errors';

const temp = new TempDir();

beforeEach(() => {
  temp.clean();
});

beforeAll(() => {
  process.env.SCHEMA = './env.graphql';
});

afterAll(() => {
  temp.deleteTempDir();
  process.env.SCHEMA = undefined;
});

describe('loaders', () => {
  test('load a single graphql file', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      schema: schema.graphql
    `,
    );

    temp.createFile(
      'schema.graphql',
      /* GraphQL */ `
        type Query {
          foo: String
        }
      `,
    );

    const config = await loadConfig({
      rootDir: temp.dir,
    });

    const schema = await config!.getDefault().getSchema();
    const query = schema.getQueryType()!;
    const fields = Object.keys(query.getFields());

    expect(query).toBeDefined();
    expect(fields).toContainEqual('foo');
  });
});

describe('environment variables', () => {
  test('not defined but with a default value', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      schema: \${FOO:./schema.graphql}
    `,
    );

    const config = await loadConfig({
      rootDir: temp.dir,
    });

    expect(config!.getDefault().schema).toEqual('./schema.graphql');
  });

  test('not defined but with a default value inside quotation marks', async () => {
    const url = 'http://localhost:9000';
    temp.createFile(
      '.graphqlrc',
      `
      schema: \${FOO:"${url}"}
    `,
    );

    const config = await loadConfig({
      rootDir: temp.dir,
    });

    expect(config!.getDefault().schema).toEqual(url);
  });

  test('not defined but with a default value inside quotation marks', async () => {
    const url = 'http://localhost:9000';
    temp.createFile(
      '.graphqlrc',
      `
      schema: \${FOO:${url}}
    `,
    );

    const config = await loadConfig({
      rootDir: temp.dir,
    });

    expect(config!.getDefault().schema).toEqual(url);
  });

  test('defined and with a default value', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      schema: \${SCHEMA:./schema.graphql}
    `,
    );

    const config = await loadConfig({
      rootDir: temp.dir,
    });

    expect(config!.getDefault().schema).toEqual('./env.graphql');
  });
});

describe('project matching by file path', () => {
  test('basic check', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      projects: 
        foo:
          schema: ./foo.graphql
        bar:
          schema: 
            - ./bar.graphql:
              noop: true
        baz:
          schema: ./documents/**/*.graphql

        qux:
          schema:
            - ./schemas/foo.graphql
            - ./schemas/bar.graphql
    `,
    );

    const config = (await loadConfig({
      rootDir: temp.dir,
    }))!;

    expect(config.getProjectForFile('./foo.graphql').name).toBe('foo');
    expect(
      config.getProjectForFile(resolve(temp.dir, './foo.graphql')).name,
    ).toBe('foo');
    expect(config.getProjectForFile('./bar.graphql').name).toBe('bar');
    expect(
      config.getProjectForFile(resolve(temp.dir, './bar.graphql')).name,
    ).toBe('bar');
    expect(config.getProjectForFile('./schemas/foo.graphql').name).toBe('qux');
    expect(config.getProjectForFile('./schemas/bar.graphql').name).toBe('qux');
    expect(config.getProjectForFile('./documents/baz.graphql').name).toBe(
      'baz',
    );
  });

  test('consider include', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      projects: 
        foo:
          schema: ./foo.graphql
          include: ./foo/*.ts
        bar:
          schema: ./bar.graphql
          documents: ./documents/**/*.graphql
    `,
    );

    const config = (await loadConfig({
      rootDir: temp.dir,
    }))!;

    expect(config.getProjectForFile('./foo/component.ts').name).toBe('foo');
    expect(config.getProjectForFile('./documents/barbar.graphql').name).toBe(
      'bar',
    );
  });

  test('consider exclude', async () => {
    temp.createFile(
      '.graphqlrc',
      `
      projects: 
        foo:
          schema: ./foo.graphql
          include: ./foo/*.ts
          exclude: ./foo/ignored/**
        bar:
          schema: ./bar.graphql
          documents: ./documents/**/*.graphql
    `,
    );

    const config = (await loadConfig({
      rootDir: temp.dir,
    }))!;

    expect(config.getProjectForFile('./foo/component.ts').name).toBe('foo');
    // should point to a next project that includes the file
    expect(config.getProjectForFile('./foo/ignored/component.ts').name).toBe(
      'bar',
    );
  });

  test('customizable config name', async () => {
    const schemaFile = 'schema.graphql';
    
    temp.createFile(
      schemaFile,
      /* GraphQL */ `
        type Query {
          foo: String
        }
      `,
    );
    temp.createFile(
      'foo.config.js',
      `
      module.exports = {
        schema: '${schemaFile}'
      }
    `,
    );

    try {
      await loadConfig({
        rootDir: temp.dir,
      });

      throw new Error('Should not be here');
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigNotFoundError);
    }

    const config = await loadConfig({
      rootDir: temp.dir,
      configName: 'foo',
    });

    expect(config!.getDefault().schema).toEqual(schemaFile);
  });
});
