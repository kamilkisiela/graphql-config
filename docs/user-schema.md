---
id: schema
title: Specifying schema
sidebar_label: Specifying schema
---

The simplest config specifies only `schema` which points to the source of GraphQL Schema.

```yaml
schema: ./schema.graphql
```

Based on the above example you may think GraphQL Config accepts only single graphql files, but it does more than that.

### Multiple files

In case of modularized schema, we got you covered.

You can specify a list of files:

```yaml
schema:
  - ./foo.graphql
  - ./bar.graphql
  - ./baz.graphql
```

Use a glob pattern to find and include pieces of schema:

```yaml
schema: ./*.graphql
```

GraphQL Config looks for those files, reads them and merges together to produce a GraphQL Schema object.

### Introspection result

A very common way to store GraphQL Schema is to introspect it and save the result as a JSON file:

```yaml
schema: ./schema.json
```

### Endpoint

In case you want to access a running GraphQL server you can easily pass its address:

```yaml
schema: http://localhost:4000/graphql
```


