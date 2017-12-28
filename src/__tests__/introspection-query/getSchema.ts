import test from 'ava'
import { join } from 'path'
import { printSchema } from 'graphql'
const schema = require('../schema.json')
import { getGraphQLConfig, GraphQLConfig } from '../../'

test('reads single schema', t => {
  const config = getGraphQLConfig(__dirname)

  const typeDefs = `\
schema {
  query: RootQueryType
}

type Bar {
  widgets: [Widget]
}

type RootQueryType {
  foo: String
  bar: Bar
}

type Widget {
  count: Int
}
`

  t.is(
    printSchema(config.getProjectConfig('testSchemaA').getSchema()),
    typeDefs,
  )
})
