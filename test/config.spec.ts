import {resolve} from 'path';
import {TempDir} from './utils/temp-dir';
import {loadConfig} from '../src/config';

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
  test('', async () => {
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
});
