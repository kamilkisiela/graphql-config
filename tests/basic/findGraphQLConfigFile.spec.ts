import {join} from 'path';
import {mkdtempSync} from 'fs';
import {tmpdir} from 'os';
import {getGraphQLConfig, ConfigNotFoundError} from '../../src';

test('returns a correct config filename', async () => {
  const config = await getGraphQLConfig(__dirname);
  expect(config.configPath).toEqual(join(__dirname, '.graphqlconfig'));
});

test.skip('returns a correct config filename for 1st level of sub directories', async () => {
  const config = await getGraphQLConfig(`${__dirname}/../sub-directory-config`);
  expect(config.configPath).toEqual(
    join(
      `${__dirname}/../sub-directory-config/sub-directory-2`,
      '.graphqlconfig',
    ),
  );
});

test('throws GraphQLConfigNotFoundError when config is not found', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'graphql-config'));
  try {
    await getGraphQLConfig(tempDir);
  } catch (error) {
    expect(error).toBeInstanceOf(ConfigNotFoundError);
  }
  expect.assertions(1);
});
