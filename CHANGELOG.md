# Change log

## 4.4.0

### Minor Changes

- [#1189](https://github.com/kamilkisiela/graphql-config/pull/1189) [`ab2ad6d`](https://github.com/kamilkisiela/graphql-config/commit/ab2ad6d558e55d5d9b52609c68d0404026e34f1e) Thanks [@B2o5T](https://github.com/B2o5T)! - add `cosmiconfig-toml-loader` to `peerDependenciesMeta`

- [#1171](https://github.com/kamilkisiela/graphql-config/pull/1171) [`b52dc1b`](https://github.com/kamilkisiela/graphql-config/commit/b52dc1b7ed46c056dea39396ffbb89a400cee7d6) Thanks [@B2o5T](https://github.com/B2o5T)! - move `cosmiconfig-typescript-loader` in `peerDependencyMeta`

## 4.3.6

### Patch Changes

- [#1149](https://github.com/kamilkisiela/graphql-config/pull/1149) [`a12f394`](https://github.com/kamilkisiela/graphql-config/commit/a12f3945b3da70a9c10e0436785f96958202912e) Thanks [@charlypoly](https://github.com/charlypoly)! - conflict with codegen also using TypeScriptLoader(), causing a double ts-node register.

## 4.3.5

### Patch Changes

- [#1126](https://github.com/kamilkisiela/graphql-config/pull/1126) [`cc781c4`](https://github.com/kamilkisiela/graphql-config/commit/cc781c4cf3bd056a75081108e1b13efd1b3d29ed) Thanks [@n1ru4l](https://github.com/n1ru4l)! - dependencies updates:

  - Updated dependency [`cosmiconfig-typescript-loader@^4.0.0` ↗︎](https://www.npmjs.com/package/cosmiconfig-typescript-loader/v/null) (from `^3.1.0`, in `dependencies`)

## 4.3.4

### Patch Changes

- [#1103](https://github.com/kamilkisiela/graphql-config/pull/1103) [`2c568f1`](https://github.com/kamilkisiela/graphql-config/commit/2c568f1ee2d45bc46613b86b12fcfab82b1393aa) Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Added dependency [`tslib@^2.4.0` ↗︎](https://www.npmjs.com/package/tslib/v/null) (to `dependencies`)

* [#1103](https://github.com/kamilkisiela/graphql-config/pull/1103) [`2c568f1`](https://github.com/kamilkisiela/graphql-config/commit/2c568f1ee2d45bc46613b86b12fcfab82b1393aa) Thanks [@renovate](https://github.com/apps/renovate)! - Proper ESM/CJS support on Node.js

## 4.3.3

### Patch Changes

- cd7747e: bump `cosmiconfig-typescript-loader` to resolve errors with esm loading

## 4.3.2

### Patch Changes

- f74d648: fix: change to maintained version of `cosmiconfig-typescript-loader`

## 4.3.1

### Patch Changes

- 44eec8d: Add workaround for default import of typescript config loader to fix ESM support

## 4.3.0

### Minor Changes

- aaccd04: feat: improve types to fix JSON schema when schema is passed like object with headers

### Patch Changes

- 18d07fd: fix: rollback `GraphQLConfig.projects` to empty object instead `Object.create(null)`

## 4.2.0

### Minor Changes

- 0636e9a: feat: support `graphql.config.cjs` config
- 55f078a: feat: update `graphql-tools` packages

### Patch Changes

- fix: update `minimatch` dependency

Thanks to @bfanger for his first contribution 0636e9a

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
