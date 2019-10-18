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
