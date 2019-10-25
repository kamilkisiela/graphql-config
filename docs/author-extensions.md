---
id: extensions
title: Writing and Consuming Extensions
sidebar_label: Extensions
---

Main purpose of Extensions is to pass information to extension's consumer but also to extend the behavior of GraphQL Config's logic.

GraphQL Config ships TypeScript declaration files so let's get use of them in following examples.

## How to write extension

In order to make sure you write extension correctly, import and use `GraphQLExtensionDeclaration` type from `graphql-config` package. Thanks to TypeScript you get autocompletion and in-editor validation.

The main requirement of an extension is its name. Providing a name lets GraphQL Config to match the extension with its namespace in the config file.

```typescript
import {GraphQLExtensionDeclaration} from 'graphql-config';

const InspectorExtension: GraphQLExtensionDeclaration = api => {
  return {
    name: 'inspector',
  };
};
```

## Consuming extension

As a GraphQL tool author you want to load the config and register your extension in order to understand user's configuration.

```typescript
import {loadConfig} from 'graphql-config';
import {InspectorExtension} from './extension';

async function main() {
  const config = await loadConfig({
    extensions: [InspectorExtension]
  });
}
```

Now everything is ready, GraphQL Config understands there's the Inspector extension.

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

Getting `GraphQLSchema` is straightforward, each project has `getSchema(): Promise<GraphQLSchema>` method.

```typescript
async function main() {
  // ... code from the previous example
  if (inspectorConfig.validate === true) {
    const schema = await project.getSchema();

    validateSchema(schema);
  }
}
```

GraphQL Config is able to get schema not only as `GraphQLSchema` object but also `DocumentNode`, read the API reference of [`GraphQLProjectConfig`](./api-graphql-project-config.md).
It's also capable of loading operations and fragments.

## Registering Loaders

In previous examples, we pointed GraphQL Config to the `schema.graphql` file. GraphQL Config by default, understands Introspection result stored in JSON file, GraphQL files (`.graphql`, `.gql`, `.graphqls` and `.gqls`) and an URL to GraphQL endpoint.

But in many cases, you want to extend that behavior and teach GraphQL Config how to look for GraphQL SDL (modularized schema for example) across many JavaScript or TypeScript files.

It's now possible thanks to Loaders.

The [GraphQL Toolkit](https://github.com/ardatan/graphql-toolkit) library has [few already written loaders](https://github.com/ardatan/graphql-toolkit/tree/master/packages/loaders) that GraphQL Config uses. We mentioned those default loaders but it has few extra ones.

For simplicity, we're going to use only [the one](https://github.com/ardatan/graphql-toolkit/tree/master/packages/loaders/code-file) responsible for extracting GraphQL SDL from code files.

```typescript
import { CodeFileLoader } from '@graphql-toolkit/code-file-loader';

const InspectorExtension: GraphQLExtensionDeclaration = api => {
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
import { gql } from 'graphql-tag';

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

With `CodeFileLoader` you're able to extract those GraphQL pieces:

```yaml
schema: './src/modules/*.ts' # uses a glob pattern to look for files
extensions:
  inspector:
    validate: true
```

There are two kinds of loaders, one responsible of handling schema and the other covers Operations and Fragments (we call them both `Documents`).

To read more about loaders, please check ["Loaders" chapter](./author-loaders.md)
