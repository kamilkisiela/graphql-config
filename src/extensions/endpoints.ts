import type { GraphQLExtensionDeclaration } from '../extension.js';
import type { WithList } from '../types.js';

export interface Endpoint {
  url: string;
  headers?: Record<string, WithList<string>>;
  introspect?: boolean;
  subscription?: {
    url: string;
    // TODO: remove undefined in v5
    connectionParams?: Record<string, string | undefined>;
  };
}

export type Endpoints = Record<string, Endpoint>;

export const EndpointsExtension: GraphQLExtensionDeclaration = () => {
  return {
    name: 'endpoints',
  };
};
