import {GraphQLSchema, DocumentNode, buildASTSchema} from 'graphql';
import {dirname, isAbsolute, relative, normalize} from 'path';
import {mergeTypeDefs} from '@graphql-toolkit/schema-merging';
import {Source} from '@graphql-toolkit/common';
import minimatch from 'minimatch';
import {ExtensionMissingError} from './errors';
import {GraphQLExtensionsRegistry} from './extension';
import {
  IExtensions,
  IGraphQLProject,
  SchemaPointer,
  DocumentPointer,
} from './types';
import {flatten} from './helpers';

function pick<T, K extends keyof T>(key: K, items: T[]): T[K][] {
  return items.map(item => item[key]);
}

export class GraphQLProjectConfig {
  readonly schema: SchemaPointer;
  readonly documents?: DocumentPointer;
  readonly extensions: IExtensions;
  readonly filepath: string;
  readonly dirpath: string;
  readonly name: string;

  private readonly _extensionsRegistry: GraphQLExtensionsRegistry;

  constructor({
    filepath,
    name,
    config,
    extensionsRegistry,
  }: {
    filepath: string;
    name: string;
    config: IGraphQLProject;
    extensionsRegistry: GraphQLExtensionsRegistry;
  }) {
    this.filepath = filepath;
    this.dirpath = dirname(filepath);
    this.name = name;
    this.extensions = config.extensions || {};
    this.schema = config.schema;
    this.documents = config.documents;

    this._extensionsRegistry = extensionsRegistry;
  }

  hasExtension(name: string): boolean {
    return !!this.extensions[name];
  }

  extension<T = any>(name: string): T {
    const extension = this._extensionsRegistry.get(name);

    if (!extension) {
      throw new ExtensionMissingError(
        `Project ${this.name} is missing ${name} extension`,
      );
    }

    return {
      ...this.extensions[name],
      schema: this.schema,
      documents: this.documents,
    };
  }

  async getSchema(): Promise<GraphQLSchema>;
  async getSchema(out: 'DocumentNode'): Promise<DocumentNode>;
  async getSchema(out: 'GraphQLSchema'): Promise<GraphQLSchema>;
  async getSchema(
    out?: 'GraphQLSchema' | 'DocumentNode',
  ): Promise<GraphQLSchema | DocumentNode> {
    return this.loadSchema(this.schema, out as any);
  }

  async getDocuments(): Promise<Source[]> {
    if (!this.documents) {
      return [];
    }

    return this.loadDocuments(this.documents);
  }

  async loadSchema(pointer: SchemaPointer): Promise<GraphQLSchema>;
  async loadSchema(
    pointer: SchemaPointer,
    out: 'DocumentNode',
  ): Promise<DocumentNode>;
  async loadSchema(
    pointer: SchemaPointer,
    out: 'GraphQLSchema',
  ): Promise<GraphQLSchema>;
  async loadSchema(
    pointer: SchemaPointer,
    out?: 'GraphQLSchema' | 'DocumentNode',
  ): Promise<GraphQLSchema | DocumentNode> {
    let schema: DocumentNode;

    if (Array.isArray(pointer)) {
      const schemas = await Promise.all(
        pointer.map(_pointer =>
          this._extensionsRegistry.loaders.schema.load(_pointer),
        ),
      );

      schema = mergeTypeDefs(pick('document', flatten(schemas)));
    } else {
      schema = mergeTypeDefs(
        pick(
          'document',
          await this._extensionsRegistry.loaders.schema.load(pointer),
        ),
      );
    }

    if (out === 'DocumentNode') {
      return schema;
    }

    return buildASTSchema(schema);
  }

  async loadDocuments(pointer: DocumentPointer): Promise<Source[]> {
    if (!pointer) {
      return [];
    }

    if (Array.isArray(pointer)) {
      return flatten(
        await Promise.all(
          pointer.map(_pointer =>
            this._extensionsRegistry.loaders.documents.load(_pointer),
          ),
        ),
      );
    }

    return this._extensionsRegistry.loaders.documents.load(pointer);
  }

  match(filepath: string): boolean {
    return [this.schema, this.documents].some(pointer =>
      match(filepath, this.dirpath, pointer),
    );
  }
}

// XXX: it works but uses nodejs - expose normalization of file and dir paths in config
function match(
  filepath: string,
  dirpath: string,
  pointer?: SchemaPointer | DocumentPointer,
): boolean {
  if (!pointer) {
    return false;
  }

  if (Array.isArray(pointer)) {
    return pointer.some(p => match(filepath, dirpath, p));
  }

  if (typeof pointer === 'string') {
    const normalizedFilepath = normalize(
      isAbsolute(filepath) ? relative(dirpath, filepath) : filepath,
    );
    return minimatch(normalizedFilepath, normalize(pointer));
  }

  if (typeof pointer === 'object') {
    return match(filepath, dirpath, Object.keys(pointer)[0]);
  }

  return false;
}
