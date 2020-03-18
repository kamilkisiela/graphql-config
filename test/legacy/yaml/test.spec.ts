import {getGraphQLProjectConfig} from '../../../src/legacy';

test('yaml', async () => {
  const config = getGraphQLProjectConfig(__dirname);
  const resolvedSchema = await config.resolveIntrospection();

  expect(resolvedSchema).toMatchSnapshot();
});
