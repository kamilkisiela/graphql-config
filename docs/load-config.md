---
id: load-config
title: Loading Config
sidebar_label: Loading Config
---

## loadConfig

It's the starting point of using GraphQL Config. It looks for a config file in [predefined search places](./usage.md#config-search-places) in the currently working directory.

A basic usage:

```typescript
import {loadConfig} from 'graphql-config';

async function main() {
  const config = await loadConfig({...}); // an instance of GraphQLConfig
}
```

## Options

### `filepath`

_type: `string`_

An exact path of a config file.

### `rootDir`

_type: `string`_

A path of a directory where GraphQL Config should look for a file _(uses process.cwd() by default)_.

### `extensions`

_type: `GraphQLExtensionDeclaration[]`_

An array of `GraphQLExtensionDeclaration` objects, place to register extensions.

### `throwOnMissing`

_type: `boolean`_

GraphQL Config throws an error where there's no config file by default.

### `throwOnEmpty`

_type: `boolean`_

GraphQL Config by default throws an error if there's a config file but is empty.
