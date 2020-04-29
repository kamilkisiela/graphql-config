---
id: create-config
title: Creating Config
sidebar_label: Creating Config
---

## createConfig

This function is one of the starting points for using GraphQL Config. It's different than `loadConfig` because it doesn't look for a config file, it's you who needs to provide an object instead.

A basic usage example:

```typescript
import {createConfig} from 'graphql-config';

function main() {
  const config = createConfig({
    config: {
      schema: 'schema.graphql',
    },
    extensions: [
      /* ... */
    ],
  }); // an instance of GraphQLConfig
}
```

## Options

### `config`

_type: `IGraphQLConfig`_

Raw GraphQL Config object.


### `extensions`

_type: `GraphQLExtensionDeclaration[]`_

An array of `GraphQLExtensionDeclaration` objects, place to register extensions.
