import test from 'ava'
import { join, resolve } from 'path'
import { printSchema } from 'graphql'
import { getGraphQLConfig, GraphQLConfig } from '../../'

const CONFIG_DIR = join(__dirname, 'config')

let config: GraphQLConfig

test.beforeEach(async () => {
  config = await getGraphQLConfig(CONFIG_DIR)
})

test('returns a correct name', t => {
  const testWithSchemaConfig = config.getProjectConfig('testWithSchema')
  t.deepEqual(testWithSchemaConfig.projectName, 'testWithSchema')
})

test('returns config for file', t => {
  const testWithSchemaConfig = config.getConfigForFile(
    resolve('./config/schema-a.gql'),
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
    join(CONFIG_DIR, '__schema__/StarWarsSchema.gql'),
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
