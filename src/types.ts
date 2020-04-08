import {DocumentPointer, SchemaPointer} from '@graphql-toolkit/common';

export type PointerWithConfiguration<T = any> = {[key: string]: T};

export interface IExtensions {
  [name: string]: any;
}

export interface IGraphQLProjects {
  projects: Record<string, IGraphQLProject | IGraphQLProjectLegacy>;
}

export type IGraphQLConfig =
  | IGraphQLProject
  | IGraphQLProjects
  | IGraphQLProjectLegacy;

export interface IGraphQLProjectLegacy {
  schemaPath: string;
  includes?: string[];
  excludes?: string[];
  extensions?: Record<string, any>;
}

export interface IGraphQLProject {
  schema: SchemaPointer;
  documents?: DocumentPointer;
  extensions?: IExtensions;
  include?: string | string[];
  exclude?: string | string[];
}

export interface GraphQLConfigResult {
  config: IGraphQLConfig;
  filepath: string;
}

// Kamil: somehow our build process doesn't emit `types.d.ts` file, this should force it...
export function ɵ() {}
