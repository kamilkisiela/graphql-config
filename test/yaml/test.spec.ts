import {getGraphQLProjectConfig} from '../../src';

test('yaml', async () => {
  const config = getGraphQLProjectConfig(__dirname);
  const resolvedSchema = await config.resolveIntrospection();

  expect(resolvedSchema).toMatchSnapshot();
});
