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

Install:

```bash
  yarn add graphql-config
  npm install graphql-config
```

Use:

```typescript
import {loadConfig} from 'graphql-config';

async function main() {
  const config = await loadConfig();

  const schema = await config.getDefault().getSchema();
}
```

## Help & Community [![Discord Chat](https://img.shields.io/discord/625400653321076807)](https://discord.gg/xud7bH9)

Join our [Discord chat](https://discord.gg/xud7bH9) if you run into issues or have questions. We love talking to you!
