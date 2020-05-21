import {Source, Loader} from '@graphql-tools/utils';
import {
  loadSchema,
  loadSchemaSync,
  loadTypedefs,
  loadTypedefsSync,
  loadDocuments,
  loadDocumentsSync,
  UnnormalizedTypeDefPointer,
  LoadTypedefsOptions,
  OPERATION_KINDS,
} from '@graphql-tools/load';
import {mergeTypeDefs} from '@graphql-tools/merge';
import {GraphQLSchema, DocumentNode, buildASTSchema, print} from 'graphql';
import {MiddlewareFn, useMiddleware} from './helpers/utils';

type Pointer = UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[];
type Options = Partial<LoadTypedefsOptions>;
export type SchemaOutput = 'GraphQLSchema' | 'DocumentNode' | 'string';

export class LoadersRegistry {
  private _loaders: Loader[] = [];
  private _middlewares: MiddlewareFn<DocumentNode>[] = [];
  private readonly cwd: string;

  constructor({cwd}: {cwd: string}) {
    this.cwd = cwd;
  }

  register(loader: Loader): void {
    if (!this._loaders.some((l) => l.loaderId() === loader.loaderId())) {
      this._loaders.push(loader);
    }
  }

  use(middleware: MiddlewareFn<DocumentNode>): void {
    this._middlewares.push(middleware);
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

  async loadSchema(pointer: Pointer): Promise<GraphQLSchema>;
  async loadSchema(pointer: Pointer, out: 'string'): Promise<GraphQLSchema>;
  async loadSchema(
    pointer: Pointer,
    out: 'DocumentNode',
  ): Promise<DocumentNode>;
  async loadSchema(
    pointer: Pointer,
    out: 'GraphQLSchema',
  ): Promise<GraphQLSchema>;
  async loadSchema(
    pointer: Pointer,
    out?: SchemaOutput,
  ): Promise<GraphQLSchema | DocumentNode | string> {
    out = out || ('GraphQLSchema' as const);
    const options = this.createOptions({});

    if (out === 'GraphQLSchema' && !this._middlewares.length) {
      return loadSchema(pointer, options);
    }

    const schemaDoc = this.transformSchemaSources(
      await loadTypedefs(pointer, {
        filterKinds: OPERATION_KINDS,
        ...options,
      }),
    );

    // TODO: TS screams about `out` not being compatible with SchemaOutput
    return this.castSchema(schemaDoc, out as any);
  }

  loadSchemaSync(pointer: Pointer): GraphQLSchema;
  loadSchemaSync(pointer: Pointer, out: 'string'): GraphQLSchema;
  loadSchemaSync(pointer: Pointer, out: 'DocumentNode'): DocumentNode;
  loadSchemaSync(pointer: Pointer, out: 'GraphQLSchema'): GraphQLSchema;
  loadSchemaSync(
    pointer: Pointer,
    out?: 'GraphQLSchema' | 'DocumentNode' | 'string',
  ): GraphQLSchema | DocumentNode | string {
    out = out || ('GraphQLSchema' as const);
    const options = this.createOptions({});

    if (out === 'GraphQLSchema' && !this._middlewares.length) {
      return loadSchemaSync(pointer, options);
    }

    const schemaDoc = this.transformSchemaSources(
      loadTypedefsSync(pointer, {
        filterKinds: OPERATION_KINDS,
        ...options,
      }),
    );

    return this.castSchema(schemaDoc, out as any);
  }

  private createOptions<T extends object>(options?: T) {
    return {
      loaders: this._loaders,
      cwd: this.cwd,
      ...options,
    };
  }

  private transformSchemaSources(sources: Source[]) {
    const documents: DocumentNode[] = sources.map((source) => source.document);
    const document = mergeTypeDefs(documents);

    return useMiddleware(this._middlewares)(document);
  }

  private castSchema(doc: DocumentNode, out: 'string'): string;
  private castSchema(doc: DocumentNode, out: 'DocumentNode'): DocumentNode;
  private castSchema(doc: DocumentNode, out: 'GraphQLSchema'): GraphQLSchema;
  private castSchema(
    doc: DocumentNode,
    out: SchemaOutput,
  ): string | DocumentNode | GraphQLSchema {
    if (out === 'DocumentNode') {
      return doc;
    }

    if (out === 'GraphQLSchema') {
      return buildASTSchema(doc);
    }

    return print(doc);
  }
}
