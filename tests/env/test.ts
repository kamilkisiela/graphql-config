import test from 'ava'
const schema = require('../schema.json')
import { serveSchema } from '../utils'
import { parse, resolveSchema } from '../../src'

test.before(async t => {
  await serveSchema()
})

test(async (t) => {
  process.env['GRAPHQL_ENDPOINT'] = 'http://localhost:33333'
  process.env['GRAPHQL_HEADERS'] = '{"authorization":"xxxxx"}'

  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})
