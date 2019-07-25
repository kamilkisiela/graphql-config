import cosmiconfig = require('cosmiconfig')
import TypeScriptLoader from '@endemolshinegroup/cosmiconfig-typescript-loader'

import { validateConfig } from './utils'
import { GraphQLConfig } from './GraphQLConfig'
import { GraphQLConfigData } from './types'
import { ConfigNotFoundError } from './errors'

export async function getGraphQLConfig(rootDir = process.cwd()) {
  const moduleName = 'graphql'
  const explorer = cosmiconfig(moduleName, {
    loaders: {
      '.ts': {
        async: TypeScriptLoader,
      },
      // legacy support for .graphqlconfig
      [`.${moduleName}config`]: (cosmiconfig as any).loadJson,
    },
    searchPlaces: [
      // default searchPlaces
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `${moduleName}.config.js`,
      // legacy support for .graphqlconfig[.y[a]ml]
      `.${moduleName}config`,
      `.${moduleName}config.yml`,
      `.${moduleName}config.yaml`,
    ],
  })
  const result = await explorer.search(rootDir)
  if (!result) {
    throw new ConfigNotFoundError([
      `Config file not available in the provided config directory: ${rootDir}`,
      'Please check the config directory.'
    ].join('\n'))
  }
  const config = result.config as GraphQLConfigData
  validateConfig(config)
  return new GraphQLConfig(config, result.filepath)
}

export async function getGraphQLProjectConfig(
  rootDir?: string,
  projectName: string | undefined = process.env.GRAPHQL_CONFIG_PROJECT
) {
  const config = await getGraphQLConfig(rootDir)
  if (config) {
    return config.getProjectConfig(projectName)
  }
}
