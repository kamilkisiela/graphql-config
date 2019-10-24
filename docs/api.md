---
id: api
title: Consuming API
sidebar_label: Consuming API
---

## loadConfig

It's the starting point of using GraphQL Config. It looks for a config file in [predefined search places](./usage.md#config-search-places) in the currently working directory.

A basic usage:

```typescript
import {loadConfig} from 'graphql-config';

async function main() {
  const config = await loadConfig(); // an instance of GraphQLConfig
}
```

### Options

#### asd

asd

## GraphQLConfig

```typescript
```
