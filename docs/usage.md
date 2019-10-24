---
id: usage
title: Usage
sidebar_label: Usage
---

## Config search places

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

## Projects

GraphQL Config allows to define multiple project within the same config file.

Think of it this way, when you write config:

```yaml
schema: './schema.graphql'
documents: './src/components/**/*.graphql'
```

You pretty much creates a default project.

In order to have multiple projects you write config this way:

```yaml
projects:
  foo: 
    schema: './packages/foo/schema.graphql'
    documents: './packages/foo/src/components/**/*.graphql'
  bar:
    schema: './packages/bar/schema.graphql'
```

It's also possible to define many projects where one is default. You simply put `default` as project's name:

```yaml
projects:
  default: 
    schema: './packages/foo/schema.graphql'
    documents: './packages/foo/src/components/**/*.graphql'
  bar:
    schema: './packages/bar/schema.graphql'
```
