---
id: documents
title: Specifying documents
sidebar_label: Specifying documents
---

GraphQL Config supports not only a schema but GraphQL Operations and Fragments too.

### Multiple files

You can specify a list of files:

```yaml
schema:
  - ./documents/foo.graphql
  - ./documents/bar.graphql
  - ./documents/baz.graphql
```

Use a glob pattern to find and include operations and fragments:

```yaml
schema: ./documents/*.graphql
```

GraphQL Config reads any matching files and parses them into DocumentNode objects.

