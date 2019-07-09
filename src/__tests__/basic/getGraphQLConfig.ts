import test from 'ava'
import { join, resolve } from 'path'
import { printSchema } from 'graphql'
import { getGraphQLConfig, GraphQLConfig } from '../../'

const CONFIG_DIR = join(__dirname, 'config')

let config: GraphQLConfig

test.beforeEach(() => {
  config = getGraphQLConfig(CONFIG_DIR)
})

test('returns a correct name', t => {
  const testWithSchemaConfig = config.getProjectConfig('testWithSchema')
  t.deepEqual(testWithSchemaConfig.projectName, 'testWithSchema')
})

test("returns the correct tagNames", t => {
  const testWithSchemaConfig = config.getProjectConfig("testWithSchema")
  t.deepEqual(testWithSchemaConfig.tagNames, ["gql"])
  const testWithTagNamesConfig = config.getProjectConfig("testWithTagNames")
  t.deepEqual(testWithTagNamesConfig.tagNames, ["graphql"])
})

test('returns config for file', t => {
  const testWithSchemaConfig = config.getConfigForFile(
    resolve('./config/schema-a.graphql'),
  )
  if (testWithSchemaConfig) {
    t.deepEqual(testWithSchemaConfig.projectName, 'testWithSchema')
  } else {
    t.fail()
  }
})

test('returns a correct root dir', t => {
  t.deepEqual(config.configDir, CONFIG_DIR)
})

test('returns a correct schema path', t => {
  t.deepEqual(
    config.getProjectConfig('testWithSchema').schemaPath,
    join(CONFIG_DIR, '__schema__/StarWarsSchema.graphql'),
  )
  t.deepEqual(config.getProjectConfig('testWithoutSchema').schemaPath, null)
})

test('reads single schema', t => {
  const typeDefs = `\
type Query {
  hello: String!
}
`

  t.is(
    printSchema(config.getProjectConfig('testSchemaA').getSchema()),
    typeDefs,
  )
})

test('reads imported schema', t => {
  const typeDefs = `\
type Query {
  hello: String!
  user: User!
}

type User {
  name: String
}
`

  t.is(
    printSchema(config.getProjectConfig('testSchemaB').getSchema()),
    typeDefs,
  )
})
