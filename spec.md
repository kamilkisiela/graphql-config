# GraphQL Configuration

There are many ways to configure your application to use GraphQL, and while it is often enough to specify configuration options directly in your application code, maintaining and understanding the hard-coded configuration options may become a challenge as the scale grows. We recommend configuring your application with a `.graphqlconfig` file that contains commonly needed GraphQL-related artifacts.

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
  schemaPath?: string, // a file with schema IDL

  // For multiple applications with overlapping files,
  // these configuration options may be helpful
  includeDirs?: Array<DirPath>,
  excludeDirs?: Array<DirPath>,

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

For multiple apps with isolated directories, there are mainly two ways to set up the configuration. Each app can either use the `projects` property to specify each application's configuration, or have a separate `.graphqlconfig` file for each project root.
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

Or each can app have a separate `.graphqlconfig` file per each application and/or directories:
```
./appA/.graphqlconfig
./appB/.graphqlconfig
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
        "includeDirs": "./projectA/graphql"
      },
      "projectB": {
        "schemaPath": "../resources/schema.graphql",
        "includeDirs": "./projectB/graphql"
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
        "includeDirs": "./projectA/graphql"
      },
      "projectB": {
        "includeDirs": "./projectB/graphql"
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

An `env` property is useful to facilitate the build and deployment if your application needs to introduce a GraphQL-specific environment variable and run build steps with it:
```
// run a development build with a production GraphQL database 
GRAPHQL_ENV=production && NODE_ENV=development && babel-node ./server.js
```
Also, an `env` property allows an easier adoption of this GraphQL configuration format for non-JavaScript codebases.

The proposed usage for the property is as follows:
```
{
  "schemaPath": "./schema.graphql",
  "env": {
    "production": {
      "schemaPath": "./prod-schema.graphql"
    },
    "development": {
      "schemaPath": "./dev-schema.graphql"
    }
  }
}
```
GraphQL configurations do not support this property because there isn't a clear example how to utilize this property yet.

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

// And in .graphqlconfig, specify where the custom rules are:
{
  "customValidationRules": "./customRules.js"
}
{
  "customValidationRules": [ "./customRules.js", "./moreCustomRules.js" ]
}
```

We're not yet officially supporting these rules, because many GraphQL tools don't yet have a way of using additional validation rules.
