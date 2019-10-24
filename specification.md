# GraphQL Configuration

There are many ways to configure your application to use GraphQL, and while it is often enough to specify configuration options directly in your application code, maintaining and understanding the hard-coded configuration options may become a challenge as the scale grows. We recommend configuring your application with a `.graphqlrc` file that contains commonly needed GraphQL-related artifacts.

## GraphQL Configuration Format

After inspecting many GraphQL applications for use cases and communicating with many external contributors, we recommend configuring your GraphQL application with a below format:

```ts
// For the ease of understanding/formatting, we're using a
// TypeScript-like type to define the configuration format.

type GraphQLConfiguration =
  GraphQLProjectConfiguration & {
    projects?: {
      [projectName: string]: GraphQLProjectConfiguration
    }
  };

type GraphQLProjectConfiguration = {
  // File or files with schema
  schema?: GlobPath | GlobPath | Array<GlobPath | string>,

  // File or files with operations and fragments
  documents?: GlobPath | Array<GlobPath>,

  // For multiple applications with overlapping files,
  // these configuration options may be helpful
  includes?: Array<GlobPath>,
  excludes?: Array<GlobPath>,

  // If you'd like to specify any other configurations,
  // we provide a reserved namespace for it
  extensions?: {[name: string]: GraphQLConfigurationExtension}
};

type GraphQLConfigurationExtension = {
  [name: string]: any
};
```

## Use Cases

Usually, for a simple GraphQL applications, the only required configuration is a way to fetch a GraphQL schema:
```json
{
  "schema": "./schema.graphql"
}
```

For multiple apps with isolated directories, there are mainly two ways to set up the configuration. Each app can either use the `projects` property to specify each application's configuration, or have a separate `.graphql` file for each project root.
```json
{
  "projects": {
    "appA": {
      "schema": "./appA/appASchema.graphql"
    },
    "appB": {
      "schema": "./appB/resources/appBSchema.graphql"
    }
  }
}
```

Or each app can have a separate `.graphqlrc` file per each application and/or directories:
```
./appA/.graphqlrc
./appB/.graphqlrc
```

## `extensions` as Namespaces

> If your application requires a unique configuration option, use the `extensions` attribute to customize your own configuration option.

Additionally, we'd like to treat the `extensions` property as a sandbox for improving the overall GraphQL configuration. If there is a configuration option that you think will be useful for general purposes, please let us know! Meanwhile, take advantage of this 'extensions' for testing purposes.

For example, some application may choose to build using Webpack and need to specify Webpack-related configurations in GraphQL configuration. Also, they may need to process additional file types other than `.graphql`. Below suggests one way to configure these options using 'extensions':

```
{
  "schema": "...",
  "extensions": {
    "webpack": {
      // Webpack-specific options here!
    },
    // additional file types that you want to process
    "additionalFileTypes": [ ".js" ]
  }
}
```

# Experimental Configuration Options

Below are what we're experimenting with for additional fields. Before including in the official recommendation, we would like to iterate on a few different codebases first.

### Referencing Environment Variables

To reference environment variables, use the `${env:SOME_VAR}` syntax, for example:
```json
{
  "schema": "./schema.graphql",
  "extensions": {
    "customExtension": {
      "token": "${TOKEN}",
      "username": "${USERNAME:'default'}"
    }
  }
}
```

Note: To escape a `${` sequence just prefix it with a backslash like `\${some value}`.

Note: `url` can't be used as a key of this map.

## Including a set of customized validation rules

Sometimes a GraphQL application wants to either define an additional set of validation rules or specify a list of validation rules to be run at build/runtime. The GraphQL configuration can be a good place to locate where to look for this:

```js
// In customRules.js,
export const customRules: Array<(context: ValidationContext) => any> = { ... };

// And in .graphqlrc, specify where the custom rules are:
{
  "schema": "./schema.graphql",
  "extensions": {
    "customValidationRules": "./customRules.js"
  }
}
{
  "schema": "./schema.graphql",
  "extensions": {
    "customValidationRules": [ "./customRules.js", "./moreCustomRules.js" ]
  }
}
```

We're not yet officially supporting these rules, because most GraphQL tools don't yet have a way of using additional validation rules.
