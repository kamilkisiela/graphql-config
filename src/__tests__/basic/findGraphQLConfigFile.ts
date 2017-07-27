import test from 'ava'
import { dirname, join } from 'path'
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
const schema = require('../schema.json')
import { findGraphQLConfigFile, ConfigNotFoundError } from '../../'

test('returns a correct config filename', (t) => {
  const configFile = findGraphQLConfigFile(__dirname)
  t.deepEqual(configFile, join(__dirname, '.graphqlconfig'))
});


test('throws GraphQLConfigNotFoundError when config is not found', (t) => {
  const tempDir = mkdtempSync(join(tmpdir(), 'graphql-config'))
  t.throws(() => findGraphQLConfigFile(tempDir), ConfigNotFoundError)
})
