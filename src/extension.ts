import {GraphQLFileLoader} from '@graphql-toolkit/graphql-file-loader';
import {UrlLoader} from '@graphql-toolkit/url-loader';
import {JsonFileLoader} from '@graphql-toolkit/json-file-loader';
import {LoadersRegistry} from './loaders';

export type GraphQLExtensionDeclaration = (
  api: ExtensionAPI,
) => GraphQLConfigExtension;

export interface ExtensionAPI {
  logger: any;
  loaders: {
    schema: Pick<LoadersRegistry, 'register'>;
    documents: Pick<LoadersRegistry, 'register'>;
  };
}

export interface GraphQLConfigExtension {
  name: string;
}

export class GraphQLExtensionsRegistry {
  private readonly _extensions: {
    [name: string]: GraphQLConfigExtension;
  } = {};

  readonly loaders: {
    schema: LoadersRegistry;
    documents: LoadersRegistry;
  };

  constructor({cwd}: {cwd: string}) {
    this.loaders = {
      schema: new LoadersRegistry({cwd}),
      documents: new LoadersRegistry({cwd}),
    };

    // schema
    this.loaders.schema.register(new GraphQLFileLoader());
    this.loaders.schema.register(new UrlLoader());
    this.loaders.schema.register(new JsonFileLoader());
    // documents
    this.loaders.documents.register(new GraphQLFileLoader());
  }

  register(extensionFn: GraphQLExtensionDeclaration): void {
    const extension = extensionFn({
      logger: {},
      loaders: this.loaders,
    });
    this._extensions[extension.name] = extension;
  }

  has(extensionName: string) {
    return !!this._extensions[extensionName];
  }

  get(extensionName: string) {
    return this._extensions[extensionName];
  }

  names(): string[] {
    return Object.keys(this._extensions);
  }

  forEach(cb: (extension: GraphQLConfigExtension) => void) {
    for (const extensionName in this._extensions) {
      cb(this._extensions[extensionName]);
    }
  }
}
