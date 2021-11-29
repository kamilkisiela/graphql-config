---
title: Writing and Consuming Extensions
sidebar_label: Extensions
---

The main purpose of GraphQL Config Extensions is to pass information to extension's consumer in order to extend the behavior of GraphQL Config's logic.

GraphQL Config ships TypeScript declaration files so let's make use of them in following examples.

## How to write extensions

In order to make sure you write extensions correctly, import and use the`GraphQLExtensionDeclaration` type from `graphql-config` package. Thanks to TypeScript, you get autocompletion and in-editor validation.

The main requirement of an extension is its name. Providing a name lets GraphQL Config to match the extension with its namespace in the config file.

```typescript
import {GraphQLExtensionDeclaration} from 'graphql-config';

const InspectorExtension: GraphQLExtensionDeclaration = (api) => {
  return {
    name: 'inspector',
  };
};
```

### Schema Middlewares

GraphQL Config lets you intercept the GraphQL Schema loading process which may be helpful when dealing with custom directives like in Relay or Apollo Federation. We call it Middlewares.

```typescript
import {GraphQLExtensionDeclaration} from 'graphql-config';

const RelayExtension: GraphQLExtensionDeclaration = (api) => {
  api.loaders.schema.use((document) => {
    // The middleware receives a DocumentNode object
    // Adds relay directives
    // Returns a new DocumentNode
    return addRelayToDocumentNode(document);
  });

  return {
    name: 'relay',
  };
};
```

## Consuming extension

As a GraphQL tool author you will likely want to load the config and register your extension in order to understand user's configuration.

```typescript
import {loadConfig} from 'graphql-config';
import {InspectorExtension} from './extension';

async function main() {
  const config = await loadConfig({
    extensions: [InspectorExtension],
  });
}
```

> Synchronous version: `loadConfigSync`

Now that everything is ready, GraphQL Config understands there's the Inspector extension.

In order to access information stored in the config file, do the following:

```typescript
async function main() {
  // ... code from previous steps

  // Reads configuration of a default project
  const project = config.getDefault();
  // Reads configuration of a named project
  const project = config.getProject('admin');

  // Reads extenion's configuration defined in a project
  const inspectorConfig = project.extension('inspector');

  // Given following config file:
  //
  // schema: './schema.graphql'
  // extensions:
  //  inspector:
  //    validate: true
  //

  // You're able to get `validate`:
  if (inspectorConfig.validate === true) {
    // ...
  }
}
```

Getting `GraphQLSchema` is straightforward: each project has `getSchema(): Promise<GraphQLSchema>` method.

```typescript
async function main() {
  // ... code from the previous example
  if (inspectorConfig.validate === true) {
    const schema = await project.getSchema();

    validateSchema(schema);
  }
}
```

GraphQL Config is able to generate a schema not only as `GraphQLSchema` object, but also as a `DocumentNode`. (For more info, read the API reference of [`GraphQLProjectConfig`](api-graphql-project-config).)
It's also capable of loading operations and fragments.

## Registering Loaders

In previous examples, we pointed GraphQL Config to the `schema.graphql` file. GraphQL Config, by default, understands the Introspection result stored in JSON file, GraphQL files (`.graphql`, `.gql`, `.graphqls` and `.gqls`) and the document returned by any functioning GraphQL endpoint (specified by URL).

In some cases, you may want to extend that behavior and teach GraphQL Config how to look for GraphQL SDL (modularized schema for example) across many JavaScript or TypeScript files.

It's now possible thanks to **loaders**.

The [GraphQL Tools](https://github.com/ardatan/graphql-tools) library has [a few already written loaders](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) that GraphQL Config uses. We mentioned the default loaders, but the repo contains a few extra ones.

For simplicity, we're going to use only [the one](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders/code-file) responsible for extracting GraphQL SDL from code files.

```typescript
import {CodeFileLoader} from '@graphql-tools/code-file-loader';

const InspectorExtension: GraphQLExtensionDeclaration = (api) => {
  // Lets schema
  api.loaders.schema.register(new CodeFileLoader());
  // documents
  api.loaders.documents.register(new CodeFileLoader());

  return {
    name: 'inspector',
  };
};
```

Let's say you have GraphQL SDL modularized across multiple TypeScript files, written like this:

```typescript
import {gql} from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    user(id: ID!): User!
  }
`;
```

With `CodeFileLoader` you can extract those GraphQL pieces:

```yaml
schema: './src/modules/*.ts' # uses a glob pattern to look for files
extensions:
  inspector:
    validate: true
```

There are two kinds of loaders. One is responsible for handling schemas, and the other covers Operations and Fragments (we call them both `Documents`).

To read more about loaders, please check ["Loaders" chapter](author-loaders)
