---
title: Introduction to GraphQL Config
sidebar_label: Introduction
---

# GraphQL Config

There are many ways to configure your application to use GraphQL, and while it is often enough to specify configuration options directly in your application code, maintaining and understanding the hard-coded configuration options may become a challenge as the scale grows. We recommend configuring your application with a `.graphqlrc` file that contains commonly needed GraphQL-related artifacts.

> The configuration should be placed on the root folder if you are using workspaces.

Think about GraphQL Config as **one configuration for all your GraphQL tools**.

The basic idea is to have one configuration file that any GraphQL tool could consume.

## As a developer

From the developer perspective, you gain simplicity and a central place to setup libraries, tools and your IDE extensions.

## As a library author

From the point of view of a library author, GraphQL Config makes it easier to maintain the code responsible for handling configuration, loading GraphQL schemas or even files with GraphQL operations and fragments. GraphQL Config provides a set of useful methods and an easy-to-work-with API.

## Examples

Learn more in [usage docs](usage)

### `.graphqlrc`, or `.graphqlrc.yml/yaml`

```yml
schema: 'packages/api/src/schema.graphql'
documents: 'packages/app/src/components/**/*.graphql'
extensions:
  customExtension:
    foo: true
```

### `.graphqlrc`,`graphql.config.json` or `.graphqlrc.json`

```json
{
  "schema": "https://localhost:8000"
}
```

### `graphql.config.toml` or `.graphqlrc.toml`

```toml
schema = "https://localhost:8080"
```

### `graphql.config.js` or `.graphqlrc.js`

```js
module.exports = {
  schema: 'https://localhost:8000'
}
```

### `graphql.config.ts` or `.graphqlrc.ts`

```ts
import type { IGraphQLConfig } from 'graphql-config'

const config: IGraphQLConfig = {
  schema: 'https://localhost:8000'
}

export default config
```

### Custom paths

custom extension paths with `.mycustomrc.js`, `mycustom.config.yml`, etcetera - any filename listed in [usage docs](usage) with `graphql` replaced by the `loadConfig()` parameter [`configName`](load-config#configname)

```js
await loadConfig({ configName: 'mycustom' })
```

would allow you to use `.mycustomrc.js`:

```js
module.exports = {
  schema: 'https://localhost:8000'
}
```

### Lookup Order

We are using `cosmiconfig` to load the schema, and it uses the following flow to look for configurations:

1. a `package.json` property
2. a JSON or YAML, extensionless "rc file"
3. a "rc file" with the extensions `.json`, `.yaml`, `.yml`, `.toml`, `.ts` or `.js`.
4. a `.config.js` CommonJS module, or a `.config.ts` Typescript module using [`cosmiconfig-typescript-loader`](https://github.com/EndemolShineGroup/cosmiconfig-typescript-loader)
