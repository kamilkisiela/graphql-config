# Change log

## 4.2.0

### Minor Changes

- 0636e9a: feat: support `graphql.config.cjs` config
- 55f078a: feat: update `graphql-tools` packages

### vNEXT

### v4.0.2

- Update range of `@graphql-tools/merge` dependency to include v7 and v8

### v4.0.1

- Updated dependencies of `graphql-tools` to latest, to address issues related to documents loading.

### v4.0.0

‼️ ‼️ ‼️ BREAKING CHANGE ‼️ ‼️ ‼️

Dropped Node 10 support, due to the need to support ESM in this package.

‼️ ‼️ ‼️ BREAKING CHANGE ‼️ ‼️ ‼️

The signature of `Loader` has been changed in `graphql-tools`, to allow more flexibility.

If you are using `graphql-config` with `extensions`, then the `Extension` you are using needs to adjust to the new return value of `Loader` signature that returns `Source[] | null` instead of `Source`. (see: https://github.com/kamilkisiela/graphql-config/issues/716)

Other changes:

- ESM Support
- Update dependencies of `graphql-tools`.

### v3.4.0

> Note: A breaking chnage snuk into that version, please see v4.

- Update dependencies of `graphql-tools`.

### v3.3.0

- Add support for loading the config from package.json [#693](https://github.com/kamilkisiela/graphql-config/pull/693) by [@ionut-botizan](https://github.com/ionut-botizan)

### v3.2.0

- Allow custom options for loadSchema [#593](https://github.com/kamilkisiela/graphql-config/pull/593)

### v3.1.0

- TOML and TypeScript loaders [#595](https://github.com/kamilkisiela/graphql-config/pull/595) by [@acao](https://github.com/acao)
- Add ability to override default loaders [#583](https://github.com/kamilkisiela/graphql-config/pull/583) by [@danielrearden](https://github.com/danielrearden)

### v3.0.2

- Fix missing types [#542](https://github.com/kamilkisiela/graphql-config/issues/542)

### v3.0.1

- use GraphQL Toolkit v0.10.6

### v3.0.0

> Read the [Migration chapter](https://graphql-config.com/migration)

- Support GraphQL v15
- Support CommonJS and ES Modules
- Support environment variables with default values
- Match a file with a GraphQL Project
- JSON Schema
- [New Extensions system](https://graphql-config.com/extensions) with [Loaders](https://graphql-config.com/loaders)
- `includes` and `excludes` becomes `include` and `exlude`
- New field `documents` - defines GraphQL Operations and Fragments
- Broader spectrum of [config file names](https://graphql-config.com/usage#config-search-places)
- Support [custom config name](https://graphql-config.com/load-config#configname)
- Synchonous version
- Support legacy [#437](https://github.com/kamilkisiela/graphql-config/pull/437)
- Extensions capable of modifying GraphQL Schemas [#463](https://github.com/kamilkisiela/graphql-config/pull/463)

### Prior to v3

Changes: https://github.com/kamilkisiela/graphql-config/releases
