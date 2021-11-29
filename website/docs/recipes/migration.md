---
id: migration
title: Migration
---

This chapter is not for library authors, but users. We explain here a new syntax and how to migrate from `v2.0` to `v3.0`.

> **LIBRARY AUTHORS.**
> Legacy syntax (v2.0) is deprecated but still supported through API of GraphQL Config v3.0. As a library author, you consume GraphQL Config API as usual, the legacy syntax is backported to new one under the hood.

## Migration tool

We prepared a command-line tool to help you migrate your legacy GraphQL Config:

    npx graphql-config-migrate

The migration tool will ask few questions and move your config files to the new syntax.

## New Syntax

### schemaPath

Read ["Usage" chapter](usage#schema) to understand the `schema` field.

```diff
- schemaPath: "schema.graphql"
+ schema: "schema.graphql"
```

### includes and excludes

Minor change here, remove the `s` at the end. The logic behind `include` and `exclude` stays the same but please read about it in ["Usage" chapter](usage#include--exclude).

```diff
- includes: "src/*.graphql"
+ include: "src/*.graphql"
```

```diff
- excludes: "tests/*.graphql"
+ exclude: "tests/*.graphql"
```

### documents (new)

Read ["Usage" chapter](usage#documents) to understand new `documents` field.

```diff
+ documents: "ui/*.graphql"
```

### extensions

No changes here, but please read the ["Usage" chapter](usage#extensions).

### projects

No changes here, but please read the ["Usage" chapter](usage#projects).
