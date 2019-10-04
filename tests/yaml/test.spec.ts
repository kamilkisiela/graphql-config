import {getGraphQLProjectConfig} from '../../src';

test('yaml', async () => {
  const config = await getGraphQLProjectConfig(__dirname);
  const resolvedSchema = await config.resolveIntrospection();

  expect(resolvedSchema).toMatchSnapshot();
});
