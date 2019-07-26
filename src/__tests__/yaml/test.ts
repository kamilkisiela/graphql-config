import test from 'ava'
import { getGraphQLProjectConfig } from '../../'

test('resolves schema from .graphqlrc.yml', async t => {
  const config = await getGraphQLProjectConfig(__dirname)
  const resolvedSchema = await config!.resolveIntrospection()

  t.snapshot(resolvedSchema)
})
