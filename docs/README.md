# `graphql-config` library documentation

The library exports the following entities:

**Functions:**
- [`findGraphQLConfigFile`](#findgraphqlconfigfile)
- [`getGraphQLConfig`](#getgraphqlconfig)
- [`getGraphQLProjectConfig`](#getgraphqlprojectconfig)

**Classes:**
- [`GraphQLConfig`](#graphqlconfig)
- [`GraphQLProjectConfig`](#graphqlprojectconfig)
- [`GraphQLEndpointExtension`](#graphqlendpointsextension)

Advanced .graphqlconfig may contain a few `projects` with `includes/excludes` configured,
so if your tool works on per-file basis use `getGraphQLConfig` and `GraphQLConfig`.
For simpler use-cases when your tool needs only a schema `getGraphQLProjectConfig` and
`GraphQLProjectConfig` should be used.

## `findGraphQLConfigFile`

`function findGraphQLConfigFile(filePath: string): string`

Starting from `filePath` and up the directory tree returns path to the first reached `.graphqlconfig`
or `.graphqlconfig.yaml` file. Throws `ConfigNotFoundError` error when config is not found.

**Arguments**:
  - `filePath` - file path or directory to start search from

## `getGraphQLConfig`

`function getGraphQLConfig(rootDir: string = process.cwd()): GraphQLConfig`

**Arguments**:
  - `rootDir` - root dir of a project

Parses the first found config file starting from the `rootDir`.
Returns an instance of [`GraphQLConfig`](#graphqlconfig)


## `getGraphQLProjectConfig`

```js
export function getGraphQLProjectConfig(
  rootDir?: string,
  projectName: string = process.env.GRAPHQL_CONFIG_PROJECT
): GraphQLProjectConfig
```

**Arguments**:
- `rootDir` - root dir of a project
- `projectName` - optional projectName (for multiproject configs). Defaults to the value of
  `GRAPHQL_CONFIG_PROJECT` environment variables

Parses the first found config file starting from the `rootDir`.
Returns an instance of [`GraphQLProjectConfig`](#graphqlprojectconfig)


## `GraphQLConfig`

```js
class GraphQLConfig {
  config: GraphQLConfigData
  configPath: string

  get configDir(): string

  getProjectConfig(projectName?: string): GraphQLProjectConfig
  getConfigForFile(filePath: string): GraphQLProjectConfig | undefined
  getProjectNameForFile(filePath: string): string | undefined
  getProjects(): { [name: string]: GraphQLProjectConfig } | undefined
}
```

## `GraphQLProjectConfig`

```js
class GraphQLProjectConfig {
  config: GraphQLResolvedConfigData
  configPath: string
  projectName?: string

  resolveConfigPath(relativePath: string): string // resolves path relative to config
  includesFile(filePath: string): boolean

  getSchema(): GraphQLSchema
  getSchemaSDL(): string
  async resolveIntrospection(): Promise<IntrospectionResult>

  // getters
  get configDir()
  get schemaPath(): string | null
  get includes(): string[]
  get excludes(): string[]
  get extensions(): GraphQLConfigExtensions

  // extension related helper functions
  get endpointsExtension(): GraphQLEndpointExtension | null
}
```

## `GraphQLEndpointsExtension`

Instance of `GraphQLEndpointExtension` can be retrieved from an instance of `GraphQLProjectConfig`
using `endpointsExtension` getter:

```js
import { getGraphQLProjectConfig } from 'graphql-config';

const config = getGraphQLProjectConfig('./optionalProjectDir');
const endpointsExtension = config.endpointsExtension;
// use endpointsExtension
```

The difficulty with endpoints is that they can contain
[references to the environment variables](../specification.md#referencing-environment-variables):

```js
"headers": {
  "Authorization": "Bearer ${env:AUTH_TOKEN}"
}
```

If your tool is run from console all references will be automatically resolved from
OS environment variables.
But if the tool is not started from console it doesn't have access to the OS env variables.
In this case you have to provide them (e.g. ask user to input them).
Below is the example of how to do this using this lib:

```js
import { getGraphQLProjectConfig } from 'graphql-config';

const config = getGraphQLProjectConfig('./optionalProjectDir');
const endpointsExt = config.endpointsExtension;

// get endpoint names (it will always have at least one item 'default')
const endpointNames = Object.keys(endpointsExt.getRawEndpointsMap());

const chosenEndpointName = endpointNames[0]; // user can select this

const usedEnvs = endpointsExt.getEnvVarsForEndpoint(chosenEndpointName);
// `usedEnvs` is the map from env name to the resolved value or null if can't resolve
// use this map to present user with UI to fill the missing variables
const filledEnvs = getEnvsFromUI(); // some your function
const endpoint = endpointsExt.getEndpoint(chosenEndpointName, filledEnvs);

// now use endpoint to create a GraphQL Client to this endpoint
const client = endpoint.getClient();
await client.request('....');
// or to resolve schema
const schema = await endpoint.resolveSchema();
```

For more detailed documentation refer [to the implementation](../src/extensions/endpoint/)
