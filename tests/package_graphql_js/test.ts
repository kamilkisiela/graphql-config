import test from 'ava'
const schema = require('../schema.json')
import { parse, resolveSchema } from '../../src'

test(async (t) => {
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})
