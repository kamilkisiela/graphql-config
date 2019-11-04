# GraphQL Config

![GraphQL Config](https://i.imgur.com/hw5tXw2.gif "GraphQL Config")

The easiest way to configure your development environment with your GraphQL schema (supported by most tools, editors & IDEs).

- website: https://graphql-config.com

## GraphQL Config file

```yaml
schema: ./schema.json
documents: ./src/components/**/*.jsx
```

## Usage

**Install:**

```bash
  yarn add graphql-config
  npm install graphql-config
```

**Use:**

Very basic outline in TypeScript:

```typescript
import {loadConfig} from 'graphql-config';

async function main() {
  const config = await loadConfig({...});

  const schema = await config.getDefault().getSchema();
}
```

The `...` expression in the `loadConfig` function is a placeholder for a `LoadConfigOptions` object; leaving this space empty will pass defaults. 

Here is a more robust, working example using a `generate` extension from the [GraphQL CLI Backend Template](https://github.com/ardatan/graphql-cli-backend-template):

```typescript  
const config = await loadConfig({
    extensions: [() => ({ name: 'generate'})]
});

const generateConfig = await config!.getDefault().extension('generate');

...
  
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
```  

## Help & Community [![Discord Chat](https://img.shields.io/discord/625400653321076807)](https://discord.gg/xud7bH9)

Join our [Discord chat](https://discord.gg/xud7bH9) if you run into issues or have questions. We love talking to you!
