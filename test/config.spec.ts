import { buildSchema, buildASTSchema } from 'graphql';
import { resolve, basename } from 'path';
import { TempDir } from './utils/temp-dir';
import { runTests } from './utils/runner';
import { loadConfig, loadConfigSync, ConfigNotFoundError } from 'graphql-config';
import { beforeEach, beforeAll, test, describe, expect, afterAll } from 'vitest';

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

runTests({ async: loadConfig, sync: loadConfigSync })((load, mode) => {
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

      const config = await load({ rootDir: temp.dir });

      const schema = mode === 'async' ? await config.getDefault().getSchema() : config.getDefault().getSchemaSync();
      const query = schema.getQueryType();
      const fields = Object.keys(query.getFields());

      expect(query).toBeDefined();
      expect(fields).toContainEqual('foo');
    });

    test('load a single graphql file as string', async () => {
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

      const config = await load({ rootDir: temp.dir });

      const schema = buildSchema(
        mode === 'async' ? await config.getDefault().getSchema('string') : config.getDefault().getSchemaSync('string'),
      );
      const query = schema.getQueryType();
      const fields = Object.keys(query.getFields());

      expect(query).toBeDefined();
      expect(fields).toContainEqual('foo');
    });

    test('load a single graphql file as DocumentNode', async () => {
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

      const config = await load({ rootDir: temp.dir });

      const schema = buildASTSchema(
        mode === 'async'
          ? await config.getDefault().getSchema('DocumentNode')
          : config.getDefault().getSchemaSync('DocumentNode'),
      );
      const query = schema.getQueryType();
      const fields = Object.keys(query.getFields());

      expect(query).toBeDefined();
      expect(fields).toContainEqual('foo');
    });
  });

  describe('loading from supported config files', () => {
    const moduleName = 'graphql';
    const schemaFile = 'schema.graphql';

    const tsConfig = `export default { schema: '${schemaFile}' };`;
    const jsConfig = `module.exports = { schema: '${schemaFile}' };`;
    const yamlConfig = `schema: '${schemaFile}'`;
    const tomlConfig = `schema = "${schemaFile}"`;
    const jsonConfig = `{"schema": "${schemaFile}"}`;
    const packageJsonConfig = `{"${moduleName}": {"schema": "${schemaFile}"}}`;

    let configFiles = [
      // #.config files
      [`${moduleName}.config.ts`, tsConfig],
      [`${moduleName}.config.cts`, tsConfig],
      [`${moduleName}.config.mts`, tsConfig],
      [`${moduleName}.config.js`, jsConfig],
      [`${moduleName}.config.cjs`, jsConfig],
      [`${moduleName}.config.json`, jsonConfig],
      [`${moduleName}.config.yaml`, yamlConfig],
      [`${moduleName}.config.yml`, yamlConfig],
      [`${moduleName}.config.toml`, tomlConfig],
      // .#rc files
      [`.${moduleName}rc`, yamlConfig],
      [`.${moduleName}rc.ts`, tsConfig],
      [`.${moduleName}rc.cts`, tsConfig],
      [`.${moduleName}rc.mts`, tsConfig],
      [`.${moduleName}rc.js`, jsConfig],
      [`.${moduleName}rc.cjs`, jsConfig],
      [`.${moduleName}rc.json`, jsonConfig],
      [`.${moduleName}rc.yml`, yamlConfig],
      [`.${moduleName}rc.yaml`, yamlConfig],
      [`.${moduleName}rc.toml`, tomlConfig],
      // other files
      ['package.json', packageJsonConfig],
    ];

    if (mode === 'sync') {
      configFiles = configFiles.filter((configFile) => !configFile[0].endsWith('.ts'));
    }

    beforeEach(() => {
      temp.clean();
      temp.createFile(
        schemaFile,
        /* GraphQL */ `
          type Query {
            foo: String
          }
        `,
      );
    });

    test.each(configFiles)('load config from "%s"', async (name, content) => {
      temp.createFile(name, content);

      const config = await load({ rootDir: temp.dir });

      const loadedFileName = basename(config.filepath);
      const loadedSchema = config.getDefault().schema;

      expect(config).toBeDefined();
      expect(loadedFileName).toEqual(name);
      expect(loadedSchema).toEqual(schemaFile);
    });
  });

  describe('"type": "module" in package.json', () => {
    const schemaFile = 'schema.graphql';
    const tsConfig = `export default { schema: '${schemaFile}' };`;

    beforeEach(() => {
      temp.clean();
      temp.createFile(
        schemaFile,
        /* GraphQL */ `
          type Query {
            foo: String
          }
        `,
      );
      temp.createFile(
        'package.json',
        JSON.stringify({
          type: 'module',
        }),
      );
    });

    const extensions = ['ts', 'cts', 'mts'];

    test.each(extensions)('load a %s config', async (ext) => {
      temp.createFile(`graphql.config.${ext}`, tsConfig);

      const config = await load({ rootDir: temp.dir });

      const loadedSchema = config.getDefault().schema;

      expect(config).toBeDefined();
      expect(loadedSchema).toEqual(schemaFile);
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

      const config = await load({ rootDir: temp.dir });
      expect(config.getDefault().schema).toEqual('./schema.graphql');
    });

    test('not defined but with a default value inside quotation marks', async () => {
      const url = 'http://localhost:9000';
      temp.createFile(
        '.graphqlrc',
        `
        schema: \${FOO:"${url}"}
      `,
      );

      const config = await load({ rootDir: temp.dir });
      expect(config.getDefault().schema).toEqual(url);
    });

    test('not defined but with a default value inside quotation marks', async () => {
      const url = 'http://localhost:9000';
      temp.createFile(
        '.graphqlrc',
        `
        schema: \${FOO:${url}}
      `,
      );

      const config = await load({ rootDir: temp.dir });
      expect(config.getDefault().schema).toEqual(url);
    });

    test('defined and with a default value', async () => {
      temp.createFile(
        '.graphqlrc',
        `
        schema: \${SCHEMA:./schema.graphql}
      `,
      );

      const config = await load({ rootDir: temp.dir });
      expect(config.getDefault().schema).toEqual('./env.graphql');
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

      const config = await load({ rootDir: temp.dir });

      expect(config.getProjectForFile('./foo.graphql').name).toBe('foo');
      expect(config.getProjectForFile(resolve(temp.dir, './foo.graphql')).name).toBe('foo');
      expect(config.getProjectForFile('./bar.graphql').name).toBe('bar');
      expect(config.getProjectForFile(resolve(temp.dir, './bar.graphql')).name).toBe('bar');
      expect(config.getProjectForFile('./schemas/foo.graphql').name).toBe('qux');
      expect(config.getProjectForFile('./schemas/bar.graphql').name).toBe('qux');
      expect(config.getProjectForFile('./documents/baz.graphql').name).toBe('baz');
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

      const config = await load({ rootDir: temp.dir });

      expect(config.getProjectForFile('./foo/component.ts').name).toBe('foo');
      expect(config.getProjectForFile('./documents/barbar.graphql').name).toBe('bar');
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

      const config = await load({ rootDir: temp.dir });

      expect(config.getProjectForFile('./foo/component.ts').name).toBe('foo');
      // should point to a next project that includes the file
      expect(config.getProjectForFile('./foo/ignored/component.ts').name).toBe('bar');
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
        await load({ rootDir: temp.dir });

        throw new Error('Should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigNotFoundError);
      }

      const config = await load({
        rootDir: temp.dir,
        configName: 'foo',
      });

      expect(config.getDefault().schema).toEqual(schemaFile);
    });
  });
});
