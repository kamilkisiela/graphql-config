---
id: usage
title: Usage
sidebar_label: Usage
---

## Config search places

- `graphql.config.json`
- `graphql.config.js`
- `graphql.config.yaml`
- `graphql.config.yml`

- `.graphqlrc` _(YAML and JSON)_
- `.graphqlrc.json`
- `.graphqlrc.yaml`
- `.graphqlrc.yml`
- `.graphqlrc.js`

- `graphql` property in `package.json`

## Schema

The simplest config specifies only `schema` which points to the source of GraphQL Schema.

```yaml
schema: ./schema.graphql
```

Based on the above example you may think GraphQL Config accepts only single graphql files, but it does more than that.

To learn more about possible sources of GraphQL schema read the ["Specifying schema" chapter](./user-schema.md).

## Documents

Another piece of GraphQL may be operations and fragments. In GraphQL Config we call them `documents`.

```yaml
...
documents: src/components/**/*.graphql
```

By default, GraphQL Config is able to find and extract documents from graphql files but if you want to extend it with JavaScript and TypeScript files (also tsx and jsx) please read the ["Specifying documents" chapter](./user-documents.md).

## Include / Exclude

When you want to point out files related to the schema--for instance, React components--and make your IDE GraphQL Extension recognize those files, you can `include` and `exlude` items:

```yaml
...
include: src/components/**/*.jsx
exclude: src/components/__ignored__/**/*.jsx
```

> Remember that all files specified in `schema` or `documents` are included by default.

## Extensions

In order to pass information to GraphQL Config's consumers (like IDE extensions, Node libraries), you can use an `extensions` section that is a key-value object.

```yaml
schema: './schema/*.graphql'
extensions:
  codegen:
    generates:
      ./src/types.ts:
        plugins:
          - typescript
          - typescript-resolvers
```

Now [GraphQL Code Generator](https://graphql-code-generator.com/) is able to consume that data. 

## Projects

GraphQL Config allows you to define multiple projects within the same config file.

Consider, for instance, writing the following configuration:

```yaml
schema: './schema.graphql'
documents: './src/components/**/*.graphql'
```

This basically creates a singular, default project. In order to extend configuration to multiple projects, you can use the following approach:

```yaml
projects:
  foo: 
    schema: './packages/foo/schema.graphql'
    documents: './packages/foo/src/components/**/*.graphql'
  bar:
    schema: './packages/bar/schema.graphql'
```

It's also possible to define many projects where one is the default. You can simply add `default` as that project's name:

```yaml
projects:
  default: 
    schema: './packages/foo/schema.graphql'
    documents: './packages/foo/src/components/**/*.graphql'
  bar:
    schema: './packages/bar/schema.graphql'
```
