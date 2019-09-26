import test from 'ava'
import { getGraphQLProjectConfig } from '../../'

test(async t => {
  const config = getGraphQLProjectConfig(__dirname)
  const resolvedSchema = await config.resolveIntrospection()

  t.snapshot(resolvedSchema)
})
