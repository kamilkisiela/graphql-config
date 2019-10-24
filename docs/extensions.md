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

```typescript
```

## Registering loaders

```typescript
const InspectorExtension: GraphQLExtensionDeclaration = api => {
  // schema
  api.loaders.schema.register(new CodeFileLoader());
  api.loaders.schema.register(GitLoader);
  api.loaders.schema.register(GithubLoader);
  // documents
  api.loaders.documents.register(new CodeFileLoader());

  return {
    name: 'inspector',
  };
};
```