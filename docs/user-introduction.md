---
id: introduction
title: Introduction to GraphQL Config
sidebar_label: Introduction
---

# GraphQL Config

There are many ways to configure your application to use GraphQL, and while it is often enough to specify configuration options directly in your application code, maintaining and understanding the hard-coded configuration options may become a challenge as the scale grows. We recommend configuring your application with a `.graphqlrc` file that contains commonly needed GraphQL-related artifacts.

Think about GraphQL Config as **one configuration for all your GraphQL tools**.

The basic idea is to have one configuration file that any GraphQL tool could consume. 

## As a developer

From the developer perspective, you gain simplicity and a central place to setup libraries, tools and your IDE extensions. 

## As a library author

From the tool's author point of view, it becomes easier to maintain the code respobsible for handling configuration, loading GraphQL Schema or even files with GraphQL operations and fragments. GraphQL Config provides a set of useful methods and an easy to work with API.

## Example

```yaml
schema: 'packages/api/src/schema.graphql'
documents: 'packages/app/src/components/**/*.graphql'
extensions:
  customExtension:
    foo: true
```

