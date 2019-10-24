# graphql-config

[![Discord Chat](https://img.shields.io/discord/625400653321076807)](https://discord.gg/xud7bH9)

> The README reflects the new [graphql-config protocol](specification.md).

The easiest way to configure your development environment with your GraphQL schema (supported by most tools, editors & IDEs)

## Supported by...

### Language Services
* [graphql-language-service](https://github.com/graphql/graphql-language-service) - An interface for building GraphQL language services for IDEs (_pending_)

### Editors
* [js-graphql-intellij-plugin 2.0](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin) - GraphQL language support for WebStorm, IntelliJ IDEA and other IDEs based on the IntelliJ Platform.
* [atom-language-graphql](https://github.com/rmosolgo/language-graphql) - GraphQL support for Atom text editor (_pending_)
* [vscode-graphql](https://github.com/stephen/vscode-graphql) - GraphQL support for VSCode text editor

### Tools

* [babel-plugin-react-relay](https://github.com/graphcool/babel-plugin-react-relay) - Babel compile step to process your `Relay.QL` queries (_pending_)
* [babel-plugin-transform-relay-hot](https://github.com/nodkz/babel-plugin-transform-relay-hot) - Wrapper under BabelRelayPlugin with hot reload (_pending_)
* [eslint-plugin-graphql](https://github.com/apollostack/eslint-plugin-graphql) - An ESLint plugin that checks tagged template strings against a GraphQL schema (_pending_)
* [webpack-plugin-graphql-schema-hot](https://github.com/nodkz/webpack-plugin-graphql-schema-hot) - Webpack plugin which tracks changes in your schema and generates its introspection in `json` and `txt` formats (_pending_)

> Did we forget a tool/editor? Please [add it here](https://github.com/kamilkisiela/graphql-config/issues/new).

**[Go to `graphql-config` library docs](#graphql-config-api)**

## Usage

### Possible config files

- `.graphqlrc` _(YAML and JSON)_
- `.graphqlrc.json`
- `.graphqlrc.yaml`
- `.graphqlrc.yml`
- `.graphqlrc.js`
- `graphql.config.js`
- `graphql` property in `package.json`

### Simplest use case

The simplest config specifies only `schema` which is path to the file with introspection
results or corresponding SDL document

```json
{
  "schema": "schema.graphql"
}
```

or

```json
{
  "schema": "schema.json"
}
```

### Specifying includes/excludes files

You can specify which files are included/excluded using the corresponding options:

```json
{
  "schema": "schema.graphql",
  "includes": ["*.graphql"],
  "excludes": ["temp/**"]
}
```

> Note: `excludes` and `includes` fields are globs that should match filename.
> So, just `temp` or `temp/` won't match all files inside the directory.
> That's why the example uses `temp/**`

### Multi-project configuration (advanced)
> TBD

__Refer to [specification use-cases](specification.md#use-cases) for details__

## How it works

This project aims to be provide a unifying configuration file format to configure your GraphQL schema in your development environment.

Additional to the format specification, it provides the [`graphql-config`](#graphql-config-api) library, which is used by [all supported tools and editor plugins](#supported-by). The library reads your provided configuration and passes the actual GraphQL schema along to the tool which called it.


## `graphql-config` API

Here are very basic examples of how to use `graphql-config` library.

You can find **[the detailed documentation here](docs/)**

### loadConfig

```js
import { loadConfig } from 'graphql-config'

const config = loadConfig({
  rootDir: './optionalProjectDir'
})
const schema = config.getProjectForFile(filename).getSchema()
// use schema for your tool/plugin
```

## Help & Community [![Discord Chat](https://img.shields.io/discord/625400653321076807)](https://discord.gg/xud7bH9)

Join our [Discord chat](https://discord.gg/xud7bH9) if you run into issues or have questions. We love talking to you!

