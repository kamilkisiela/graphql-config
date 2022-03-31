export type PointerWithConfiguration<T = any> = { [key: string]: T };

/**
 * Configuration of each used extension
 */
export type IExtensions = Record<string, any>;

/**
 * Multiple named projects
 */
export interface IGraphQLProjects {
  projects: Record<string, IGraphQLProject | IGraphQLProjectLegacy>;
}

/**
 * Structure of GraphQL Config
 */
export type IGraphQLConfig = IGraphQLProject | IGraphQLProjects | IGraphQLProjectLegacy;

/**
 * Legacy structure of GraphQL Config v2
 */
export interface IGraphQLProjectLegacy {
  schemaPath: string;
  includes?: string[];
  excludes?: string[];
  extensions?: Record<string, any>;
}

export declare type WithList<T> = T | T[];
export declare type ElementOf<TList> = TList extends Array<infer TElement> ? TElement : never;
export declare type SchemaPointer = WithList<string> | Record<string, { headers: Record<string, string> }>[];
export declare type SchemaPointerSingle = ElementOf<SchemaPointer>;
export declare type DocumentGlobPathPointer = string;
export declare type DocumentPointer = WithList<DocumentGlobPathPointer>;

/**
 * GraphQL Project
 */
export interface IGraphQLProject {
  schema: SchemaPointer;
  documents?: DocumentPointer;
  extensions?: IExtensions;
  include?: WithList<string>;
  exclude?: WithList<string>;
}

export interface GraphQLConfigResult {
  config: IGraphQLConfig;
  filepath: string;
}
