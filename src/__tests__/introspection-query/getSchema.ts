import test from 'ava'
import { printSchema } from 'graphql'
import { getGraphQLConfig } from '../../'

test('reads single schema', async t => {
  const config = await getGraphQLConfig(__dirname)

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
