import {Source, Loader} from '@graphql-toolkit/common';
import {
  UnnormalizedTypeDefPointer,
  LoadTypedefsOptions,
  loadDocuments,
  loadDocumentsSync,
  loadSchema,
  loadSchemaSync,
  loadTypedefs,
  loadTypedefsSync,
} from '@graphql-toolkit/core';
import {GraphQLSchema} from 'graphql';

type Pointer = UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[];
type Options = Partial<LoadTypedefsOptions>;

export class LoadersRegistry {
  private _loaders: Loader[] = [];
  private readonly cwd: string;

  constructor({cwd}: {cwd: string}) {
    this.cwd = cwd;
  }

  register(loader: Loader): void {
    if (!this._loaders.some(l => l.loaderId() === loader.loaderId())) {
      this._loaders.push(loader);
    }
  }

  async loadTypeDefs(pointer: Pointer, options?: Options): Promise<Source[]> {
    return loadTypedefs(pointer, {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    });
  }

  loadTypeDefsSync(pointer: Pointer, options?: Options): Source[] {
    return loadTypedefsSync(pointer, this.createOptions(options));
  }

  async loadDocuments(pointer: Pointer, options?: Options): Promise<Source[]> {
    return loadDocuments(pointer, this.createOptions(options));
  }

  loadDocumentsSync(pointer: Pointer, options?: Options): Source[] {
    return loadDocumentsSync(pointer, this.createOptions(options));
  }

  async loadSchema(
    pointer: Pointer,
    options?: Options,
  ): Promise<GraphQLSchema> {
    return loadSchema(pointer, this.createOptions(options));
  }

  loadSchemaSync(pointer: Pointer, options?: Options): GraphQLSchema {
    return loadSchemaSync(pointer, this.createOptions(options));
  }

  private createOptions<T extends object>(options?: T) {
    return {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    };
  }
}
