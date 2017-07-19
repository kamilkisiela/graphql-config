import test from 'ava'
const schema = require('../schema.json')
import { getGraphQLProjectConfig } from '../../'

test(async (t) => {
  const config = getGraphQLProjectConfig()
  const resolvedSchema = await config.resolveIntrospection()

  t.deepEqual(resolvedSchema, schema)
})
