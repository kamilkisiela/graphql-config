type WithList<T> = T | T[];
type ElementOf<TList> = TList extends Array<infer TElement> ? TElement : never;
export type PointerWithConfiguration<T = any> = {[key: string]: T};

// Schema pointers
export type SchemaUrlPointer =
  | string
  | {[url: string]: {headers?: {[headerName: string]: string}}};
export type SchemaLocalPathPointer = string | PointerWithConfiguration;
export type SchemaGlobPathPointer = string | PointerWithConfiguration;
export type SchemaPointer = WithList<
  SchemaUrlPointer | SchemaLocalPathPointer | SchemaGlobPathPointer
>;
export type SchemaPointerSingle = ElementOf<SchemaPointer>;

// Document pointers
export type DocumentGlobPathPointer = string | PointerWithConfiguration;
export type DocumentPointer = WithList<DocumentGlobPathPointer>;
export type DocumentPointerSingle = ElementOf<DocumentPointer>;

export interface IExtensions {
  [name: string]: any;
}

export interface IGraphQLProjects {
  projects: Record<string, IGraphQLProject>;
}

export type IGraphQLConfig = IGraphQLProject | IGraphQLProjects;

export interface IGraphQLProject {
  schema: SchemaPointer;
  documents?: DocumentPointer;
  extensions?: IExtensions;
}

export interface GraphQLCofigResult {
  config: IGraphQLConfig;
  filepath: string;
}
