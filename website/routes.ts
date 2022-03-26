import { GenerateRoutes, IRoutes } from '@guild-docs/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      user: {
        $name: "I'm a user",
        $routes: ['user-introduction', 'user-installation', 'user-usage', 'user-schema', 'user-documents'],
      },
      library: {
        $name: "I'm a library author",
        $routes: [
          'author-load-config',
          'author-extensions',
          'author-loaders',
          'api-graphql-config',
          'api-graphql-project-config',
        ],
      },
      recipes: {
        $name: 'Recipes',
        $routes: ['migration'],
      },
    },
  };

  GenerateRoutes({
    Routes,
    folderPattern: 'docs',
  });

  return {
    _: Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.entries(Routes._).map(([key, value]) => [`docs/${key}`, value]),
    ),
  };
}
