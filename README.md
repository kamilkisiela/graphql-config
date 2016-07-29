# graphql-config
Configuration file for your GraphQL schema/endpoints (supported by most tools, editors &amp; IDEs)

```json
{
  "schema": {
    "request": {
      "url" : "https://example.com/api/schema.json"
    }
  }
}

```

## Supported by...

### Editors

* [js-graphql-intellij-plugin](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin) - GraphQL language support for IntelliJ IDEA and WebStorm, including Relay.QL tagged templates in JavaScript and TypeScript
* [atom-language-graphql](https://github.com/rmosolgo/language-graphql) - GraphQL support for Atom text editor (_pending_)

### Tools

* [babel-plugin-react-relay](https://github.com/graphcool/babel-plugin-react-relay) - Babel compile step to process your `Relay.QL` queries
* [eslint-plugin-graphql](https://github.com/apollostack/eslint-plugin-graphql) - An ESLint plugin that checks tagged template strings against a GraphQL schema (_pending_)

> Did we forget a tool/editor? Please [add it here](https://github.com/graphcool/graphql-config/compare).

## Format

This repository is mean as a unifying specification of a configuration file format for your GraphQL schema/endpoints which works with most tools, editors and IDEs.

### GraphQL Schema

#### `schema: Object`

Specifies how to load the GraphQL schema that completion, error highlighting, and documentation is based on in the IDE. You can use one of the following options to configure your schema source: `file` or `request`.

#### `schema.file: String`

A relative or absolute path to the JSON from a schema introspection query, e.g. `{ data: ... }`. Changes to this file are usually watched.

```json
"file": "graphql.schema.json"
```

#### `schema.request: Object`

You can also request the schema from a url instead of having it as a JSON file locally. An example would look like this:

```json
"request": {
  "url" : "https://example.com/api/schema.json",
  "method" : "GET",
  "options" : {
    "headers": {
      "Authorization" : "xxxxx"
    }
  }
}
```

#### `schema.request.url: String`

The url to your GraphQL JSON schema file or in case you're using `postIntrospectionQuery: true` you can also specify your normal GraphQL endpoint here.

#### `schema.request.method: String`

The HTTP method to request the specified `url`. Defaults to `GET`.

#### `schema.request.postIntrospectionQuery: Boolean`

In case you don't have a JSON schema endpoint available, you can also use the `postIntrospectionQuery` option to make an on-the-fly introspection query like for example [GraphiQL](https://github.com/graphql/graphiql) does. In order to use this feature you usually have to set the `method` option to `POST`.

```json
"method" : "POST",
"postIntrospectionQuery" : true
```

#### `schema.request.options.headers: Object`

In case you need to set some HTTP headers (e.g. `Authorization`) then this is the place to do so. Here is an example:

```json
"options" : {
  "headers": {
    "Authorization" : "xxxxx"
  }
}
```

### Data Endpoints

#### `endpoints: Array<Object>`

A list of GraphQL endpoints that can be queried from '.graphql' files. This feature currently just works for [js-graphql-intellij-plugin](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin).

### Enviornment variables


## Credits & License

This config file format was originally inspired by [this great project](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin/blob/master/resources/META-INF/graphql.config.json) and is available under the [MIT License](http://opensource.org/licenses/MIT).


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)