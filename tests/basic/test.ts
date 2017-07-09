import test from 'ava'
const schema = require('../schema.json')
import { GraphQLProjectConfig } from '../../src'


test(async (t) => {
  const config = new GraphQLProjectConfig(__dirname);
  const resolvedSchema = await config.resolveIntrospection();

  t.deepEqual(resolvedSchema, schema)
})
