import {Source, Loader} from '@graphql-toolkit/common';

import {
  loadDocuments,
  UnnormalizedTypeDefPointer,
  LoadTypedefsOptions,
  loadSchema,
  loadTypedefs,
} from '@graphql-toolkit/core';
import {GraphQLSchema} from 'graphql';

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

  async loadTypeDefs(
    pointer: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[],
    options?: Partial<LoadTypedefsOptions>,
  ): Promise<Source[]> {
    return loadTypedefs(pointer, {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    });
  }

  async loadDocuments(
    pointer: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[],
    options?: Partial<LoadTypedefsOptions>,
  ): Promise<Source[]> {
    return loadDocuments(pointer, {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    });
  }

  async loadSchema(
    pointer: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[],
    options?: Partial<LoadTypedefsOptions>,
  ): Promise<GraphQLSchema> {
    return loadSchema(pointer, {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    });
  }
}
