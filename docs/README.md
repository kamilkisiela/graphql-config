# `graphql-config` library documentation

The library exports the following entities:

**Functions:**

- [`loadConfig`](#loadConfig)

**Classes:**

- [`GraphQLConfig`](#graphqlconfig)
- [`GraphQLProjectConfig`](#graphqlprojectconfig)
- [`GraphQLEndpointExtension`](#graphqlendpointsextension)

Advanced .graphqlrc may contain a few `projects` with `includes/excludes` configured,
so if your tool works on per-file basis use `getGraphQLConfig` and `GraphQLConfig`.
For simpler use-cases when your tool needs only a schema `getGraphQLProjectConfig` and
`GraphQLProjectConfig` should be used.

## `loadConfig`

`function loadConfig(options: LoadConfigOptions): string`

Starting from current working directory and down the directory tree until `options.rootDir` returns path to the first reached graphql config file. Throws `ConfigNotFoundError` error when config is not found.

**Options**:

- `filepath` - path of the config file
- `rootDir` - directory where the config may be or where GraphQL Config should stop looking for a config file (starting at current working directory)
- `extensions` - an array of `GraphQLExtensionDeclaration`
- `throwOnMissing` - throw on missing config (default: true)
- `throwOnEmpty` - throw on empty config file (default: true)

## `GraphQLConfig`

```js
class GraphQLConfig {
  filepath: string;
  dirpath: string;
  projects: { [name: string]: GraphQLProjectConfig };
  extensions: GraphQLExtensionsRegistry

  getDefault(): GraphQLProjectConfig | never;
  getProject(name?: string): GraphQLProjectConfig | never;
  getProjectForFile(filepath: string): GraphQLProjectConfig | never;
}
```

## `GraphQLProjectConfig`

```js
class GraphQLProjectConfig {
  schema: SchemaPointer;
  documents?: DocumentPointer;
  name: string;
  filepath: string;
  dirpath: string;
  
  // Extensions
  extensions: IExtensions;
  hasExtension(name: string): boolean;
  extension<T = any>(name: string): T

  // Schema
  getSchema(): Promise<GraphQLSchema>;
  getSchema(out: 'DocumentNode'): Promise<DocumentNode>;
  getSchema(out: 'GraphQLSchema'): Promise<GraphQLSchema>;

  loadSchema(pointer: SchemaPointer): Promise<GraphQLSchema>;
  loadSchema(pointer: SchemaPointer, out: 'DocumentNode'): Promise<DocumentNode>;
  loadSchema(pointer: SchemaPointer, out: 'GraphQLSchema'): Promise<GraphQLSchema>;

  // Documents
  getDocuments(): Promise<Source[]>;
  loadDocuments(pointer: DocumentPointer): Promise<Source[]>;

  match(filepath: string): boolean
}
```

