---
title: Specifying documents
---

GraphQL Config supports not only a schema but GraphQL Operations and Fragments too.

### Multiple files

You can specify a list of files:

```yml
documents:
  - ./documents/foo.graphql
  - ./documents/bar.graphql
  - ./documents/baz.graphql
```

Use a glob pattern to find and include operations and fragments:

```yml
documents: ./documents/*.graphql
```

GraphQL Config reads any matching files and parses them into `DocumentNode` objects.
