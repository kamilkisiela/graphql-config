import {DocumentPointer, SchemaPointer} from '@graphql-toolkit/common';
export {DocumentPointer, SchemaPointer, Source} from '@graphql-toolkit/common';

export type PointerWithConfiguration<T = any> = {[key: string]: T};

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
