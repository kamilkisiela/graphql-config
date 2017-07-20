import test from 'ava'
import { join } from 'path';
const schema = require('../schema.json')
import { getGraphQLConfig, GraphQLConfig } from '../../'

const CONFIG_DIR = join(__dirname, 'config')

let config:GraphQLConfig

test.beforeEach(() => {
  config = getGraphQLConfig(CONFIG_DIR)
})

test('returns a correct name', (t) => {
  const testWithSchemaConfig = config.getProjectConfig('testWithSchema');
  t.deepEqual(testWithSchemaConfig.projectName, 'testWithSchema');
});

test('returns a correct root dir', (t) => t.deepEqual(config.configDir, CONFIG_DIR));

test('returns a correct schema path', (t) => {
  t.deepEqual(
    config.getProjectConfig('testWithSchema').schemaPath,
    join(CONFIG_DIR, '__schema__/StarWarsSchema.graphql')
  );
  t.deepEqual(config.getProjectConfig('testWithoutSchema').schemaPath, null);
});
