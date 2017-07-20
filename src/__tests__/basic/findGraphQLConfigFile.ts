import test from 'ava'
import { dirname, join } from 'path';
const schema = require('../schema.json')
import { findGraphQLConfigFile, ConfigNotFoundError } from '../../'

test('returns a correct config filename', (t) => {
  const configFile = findGraphQLConfigFile(__dirname)
  t.deepEqual(configFile, join(__dirname, '.graphqlconfig'))
});


test('throws GraphQLConfigNotFoundError when config is not found', (t) => {
  try {
    findGraphQLConfigFile(dirname(__dirname))
  } catch(error) {
    t.truthy(error instanceof ConfigNotFoundError)
    return
  };
  t.fail('findGraphQLConfigFile should throw when config is not found')
})
