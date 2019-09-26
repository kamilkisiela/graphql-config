import { dirname, join } from 'path'
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import { findGraphQLConfigFile, ConfigNotFoundError } from '../../src'

test('returns a correct config filename', () => {
  const configFile = findGraphQLConfigFile(__dirname)
  expect(configFile).toEqual(join(__dirname, '.graphqlconfig'))
})

test('returns a correct config filename for 1st level of sub directories', () => {
  const configFile = findGraphQLConfigFile(
    `${__dirname}/../sub-directory-config`,
  )
  expect(configFile).toEqual(join(
    `${__dirname}/../sub-directory-config/sub-directory-2`,
    '.graphqlconfig',
  ))
})

test('throws GraphQLConfigNotFoundError when config is not found', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'graphql-config'))
  expect(() => findGraphQLConfigFile(tempDir)).toThrowError(ConfigNotFoundError)
})
