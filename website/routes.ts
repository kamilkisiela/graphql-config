import {GenerateRoutes, IRoutes} from '@guild-docs/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      docs: {
        $name: 'Docs',
        $routes: ['user', 'library', 'recipes'],
        _: {
          user: {
            $name: 'I\'m a user',
            $routes: ['user-introduction', 'user-installation', 'user-usage', 'user-schema', 'user-documents']
          },
          library: {
            $name: 'I\'m a library author',
            $routes: ['author-load-config', 'author-extensions', 'author-loaders', 'api-graphql-config', 'api-graphql-project-config']
          },
          recipes: {
            $name: 'Recipes',
            $routes: ['migration']
          }
        }
      }
    }
  };
  GenerateRoutes({
    Routes,
    folderPattern: 'docs',
    basePath: 'docs',
    basePathLabel: 'Documentation'
  });

  return Routes;
}
