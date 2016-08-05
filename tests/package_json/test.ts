import test from 'ava'
const schema = require('../schema.json')
import { serveSchema } from '../utils'
import { parse, resolveSchema } from '../../src'

test.before(async t => {
  await serveSchema()
})

test(async (t) => {
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})
