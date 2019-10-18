import {DocumentNode} from 'graphql';
import flatten from 'lodash/flatten';
import {LoadersMissingError, LoaderNoResultError} from './errors';
import {
  SchemaPointerSingle,
  DocumentPointerSingle,
  PointerWithConfiguration,
} from './types';

export class Source {
  document: DocumentNode;
  location?: string;
  constructor({
    document,
    location,
  }: {
    document: DocumentNode;
    location?: string;
  }) {
    this.document = document;
    this.location = location;
  }
}

function isGlob(pointer: any): pointer is string {
  return typeof pointer === 'string' && pointer.includes('*');
}

function isPointerWithConfiguration(
  pointer: any,
): pointer is PointerWithConfiguration {
  const isObject = typeof pointer === 'object';
  const hasOneKey = Object.keys(pointer).length === 1;
  const key = Object.keys(pointer)[0];
  const hasConfiguration = typeof pointer[key] === 'object';

  return isObject && hasOneKey && hasConfiguration;
}

function isSourceArray(sources: any): sources is Source[] {
  return Array.isArray(sources);
}

export type Loader<TPointer, TOptions = any> = (
  pointer: TPointer,
  options?: TOptions,
) => Promise<Source | void>;

export type SchemaLoader = Loader<SchemaPointerSingle>;
export type DocumentLoader = Loader<DocumentPointerSingle>;
export type UniversalLoader = Loader<
  SchemaPointerSingle | DocumentPointerSingle
>;

export class LoadersRegistry<TPointer> {
  private _loaders: Loader<TPointer>[] = [];

  register(loader: Loader<TPointer>): void {
    this._loaders.push(loader);
  }

  async load(pointer: TPointer, options?: any): Promise<Source[]> {
    if (!options) {
      options = {};
    }

    if (isGlob(pointer)) {
      const {default: globby} = await import('globby');
      const filepaths = await globby(pointer);
      const results = await Promise.all(
        filepaths.map(filepath => this.load(filepath as any, options)),
      );

      return flatten(results.filter(isSourceArray));
    }

    if (isPointerWithConfiguration(pointer)) {
      const key = Object.keys(pointer)[0];
      return this.load(key as any, (pointer as PointerWithConfiguration)[key]);
    }

    if (this._loaders.length === 0) {
      throw new LoadersMissingError(`Loaders are missing`);
    }

    for (const load of this._loaders) {
      const result = await load(pointer, options);

      if (result) {
        return [result];
      }
    }

    throw new LoaderNoResultError(
      `None of provided loaders could resolve: ${pointer}`,
    );
  }
}
