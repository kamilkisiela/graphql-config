# GraphQL Configuration

There are many ways to configure your application to use GraphQL, and while it is often enough to specify configuration options directly in your application code, maintaining and understanding the hard-coded configuration options may become a challenge as the scale grows. We recommend configuring your application with a `.graphqlrc` file that contains commonly needed GraphQL-related artifacts.

## GraphQL Configuration Format

After inspecting many GraphQL applications for use cases and communicating with many external contributors, we recommend configuring your GraphQL application with a below format:

```
// For the ease of understanding/formatting, we're using a
// Flow-like type to define the configuration format.

type GraphQLConfiguration =
  GraphQLProjectConfiguration & {
    projects?: {
      [projectName: string]: GraphQLProjectConfiguration
    }
  };

type GraphQLProjectConfiguration = {
  // the name of this project. If absent, the key of this
  // project config object will be used as the project name.
  name?: string, 
  schemaPath?: string, // a file with schema IDL

  // For multiple applications with overlapping files,
  // these configuration options may be helpful
  include?: Array<GlobPath>,
  exclude?: Array<GlobPath>,

  // If you'd like to specify any other configurations,
  // we provide a reserved namespace for it
  extensions?: {[name: string]: GraphQLConfigurationExtension}
};

type GraphQLConfigurationExtension = {
  [name: string]: mixed
};
```

## Use Cases

Usually, for a simple GraphQL applications, the only required configuration is a way to fetch a GraphQL schema:
```
{
  "schemaPath": "./schema.graphql"
}
```

For multiple apps with isolated directories, there are mainly two ways to set up the configuration. Each app can either use the `projects` property to specify each application's configuration, or have a separate `.graphqlrc` file for each project root.
```
{
  "projects": {
    "appA": {
      "schemaPath": "./appA/appASchema.graphql"
    },
    "appB": {
      "schemaPath": "./appB/resources/appBSchema.graphql"
    }
  }
}
```

Or each app can have a separate `.graphqlrc` file per each application and/or directories:
```
./appA/.graphqlrc
./appB/.graphqlrc
```

## Default Configuration Properties

> Treat the top-level configuration properties as default values to use if a project configuration scope omits them.

Consider the below GraphQL configuration:
```
{
  {
    "projects": {
      "projectA": {
        "schemaPath": "./resources/schema.graphql",
        "include": "./projectA/graphql/*.graphql"
      },
      "projectB": {
        "schemaPath": "../resources/schema.graphql",
        "include": "./projectB/graphql/*.graphql"
      },
      "projectC": {
        "schemaPath": "./schema-for-projectC.graphql"      }
    }
  }
}
```

Since projectA and projectB share the same schema file, we can push the `schemaPath` property to the top level, and treat it as a default value for a schema path. In this case, the application using this configuration should treat each project config as a more specific scope, and look at the top level scope with default properties as a fallback.
```
{
  "schemaPath": "./resources/schema.graphql",
  {
    "projects": {
      "projectA": {
        "include": "./projectA/graphql/*.graphql"
      },
      "projectB": {
        "include": "./projectB/graphql/*.graphql"
      },
      "projectC": {
        // "schemaPath" in this scope should take precedence
        "schemaPath": "./schema-for-projectC.graphql"
      }
    }
  }
}
```

## `Extensions` as Namespaces

> If your application requires a unique configuration option, use the `extensions` attribute to customize your own configuration option. 

Additionally, we'd like to treat the `extensions` property as a sandbox for improving the overall GraphQL configuration. If there is a configuration option that you think will be useful for general purposes, please let us know! Meanwhile, take advantage of this 'extensions' for testing purposes.

For example, some application may choose to build using Webpack and need to specify Webpack-related configurations in GraphQL configuration. Also, they may need to process additional file types other than `.graphql`. Below suggests one way to configure these options using 'extensions':

```
{
  "schemaPath": "...",
  "extensions": {
    "webpack": {
      // Webpack-specific options here!
    },
    // additional file types that you want to process
    "additionalFileTypes": [ '.js' ]
  }
}
```

# Experimental Configuration Options

Below are what we're experimenting with for additional fields. Before including in the official recommendation, we would like to iterate on a few different codebases first.

## 'Env' Variable

An env property is useful to facilitate the build and deployment if your application needs to introduce a GraphQL-specific environment variable and run build steps with it:

```
// run a development build with a production GraphQL database 
GRAPHQL_ENV=production && NODE_ENV=development && babel-node ./server.js
```

Also, an env property allows an easier adoption of this GraphQL configuration format for non-JavaScript codebases.

The proposed usage for the property is as follows:
```
{
  "schemaPath": "./schema.graphql",
  "extensions": {
    "env": {
      "production": {
        "schemaUrl": "http://your-app.com/graphqlschema"
      },
      "development": {
        "schemaPath": "./dev-schema.graphql"
      }
    }
  }
}
```
GraphQL configurations do not support this property because there isn't a clear example how to utilize this property yet.



## Configuring GraphQL endpoint

For a simple GraphQL endpoints, the only required configuration is an URL:
```
{
  "endpoint": "http://your-app.com/graphql"
}
```

Additional header values could be added if needed:
```
{
  "endpoint": {
    "url": "http://your-app.com/graphql",
    "headers": {
      "Authorization": "bearer ${env: YOUR_APP_TOKEN}"
    }
  }
}
```

**Note**: Don't specify passwords, tokens, etc. inside your `.graphqlrc`. Use [Environment variables](#referencing-environment-variables) for that.

### Referencing Environment Variables

To reference environment variables, use the ${env:SOME_VAR} syntax, for example:
```
{
  "endpoint": {
    "url": "http://your-app.com/graphql",
    "headers": {
      "User-Agent": "Build script",
      "Authorization": "bearer ${env: YOUR_APP_TOKEN}"
    }
  }
}
```

Note: To escape `${` sequence just prefix it with slash like that `\\${some value}`.

### Subscription support

Separate endpoint for subscription can be defined and `connectionParams` can be used to provide additional values:
```
{
  "endpoint": {
    "url": "http://your-app.com/graphql",
    "subscription": {
      "url": "ws://your-app.com:5000/",
      "connectionParams": {
        "Token": "${env: YOUR_APP_TOKEN}"
      }
    }
  }
}
```

### Support for multiple endpoints

In situation where multiple endpoints are supported they can be specified like that:
```
"endpoint": {
  "prod": {
    "url": "https://your-app.com/graphql"
    "subscription": {
      "url": "wss://subscriptions.graph.cool/v1/instagram"
    }
  },
  "dev": {
    "url": "http://localhost:3000/graphql",
    "subscription": {
      "url": "ws://localhost:3001"
    }
  }
}
```

Note: `url` can't be used as a key of this map.

## Configuring a schema defined programmatically

Suppose you have a schema defined using objects from `graphql-js`:
```
// In schema.js,
const queryType = new GraphQLObjectType({ name: 'Query' });
export const schema = new GraphQLSchema({ query: queryType });
```

Because this is a valid GraphQL schema that can be used within applications, we want to provide a way to configure the schema defined in this way:
```
{
  "schemaModule": "./schema.js"
}
```

This is not yet supported in GraphQL configuration because we're not sure what shape the type for the exported module is, nor whether this belongs in a JS-specific sub-configuration.

## Including a set of customized validation rules

Sometimes a GraphQL application wants to either define an additional set of validation rules or specify a list of validation rules to be run at build/runtime. The GraphQL configuration can be a good place to locate where to look for this:
```
// In customRules.js,
export const customRules: Array<(context: ValidationContext) => any> = { ... };

// And in .graphqlrc, specify where the custom rules are:
{
  "customValidationRules": "./customRules.js"
}
{
  "customValidationRules": [ "./customRules.js", "./moreCustomRules.js" ]
}
```

We're not yet officially supporting these rules, because many GraphQL tools don't yet have a way of using additional validation rules.
