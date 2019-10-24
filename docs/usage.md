---
id: usage
title: Usage
sidebar_label: Usage
---

## Possible config files

- `.graphqlrc` _(YAML and JSON)_
- `.graphqlrc.json`
- `.graphqlrc.yaml`
- `.graphqlrc.yml`
- `.graphqlrc.js`
- `graphql.config.js`
- `graphql` property in `package.json`

## Schema

The simplest config specifies only `schema` which points to the source of GraphQL Schema.

```yaml
schema: ./schema.graphql
```

Based on the above example you may think GraphQL Config accepts only single graphql files, but it does more than that.

To learn more about possible sources of GraphQL schema read the ["Specifying schema" chapter](./schema).

## Documents

Another piece of GraphQL may be operations and fragments. In GraphQL Config we call them `documents`.

```yaml
...
documents: src/components/**/*.graphql
```

By default, GraphQL Config is able to find and extract documents from graphql files but if you want to extend it with JavaScript and TypeScript files (also tsx and jsx) please read the ["Specifying documents" chapter](./documents).

## Include / Exclude

When you want to point out files related to the schema, like React components and make your IDE GraphQL Extension recognize them, you're able to do it in `include` and `exlude` items:

```yaml
...
include: src/components/**/*.jsx
exclude: src/components/__ignored__/**/*.jsx
```

> Remember that all files specified in `schema` or `documents` are included by default

## Extensions

In order to pass information to GraphQL Config's consumers (like IDE extensions, node libraries), there's `extensions` section that is a key-value object.

```yaml
schema: './schema/*.graphql'
extensions:
  graphql-codegen:
    generates:
      ./src/types.ts:
        plugins:
          - typescript
          - typescript-resolvers
```

Now [GraphQL Code Generator](https://graphql-code-generator.com/) is able to consume that data. 
