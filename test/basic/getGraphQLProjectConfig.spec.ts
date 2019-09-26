import test from 'ava'
import { getGraphQLProjectConfig } from '../../'

test('resolves schema from file', async t => {
  const config = getGraphQLProjectConfig(__dirname)
  const resolvedSchema = await config.resolveIntrospection()

  t.snapshot(resolvedSchema)
})
