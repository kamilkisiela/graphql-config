import {GraphQLExtensionDeclaration} from '../extension';

export interface Endpoint {
  url: string;
  headers?: {
    [name: string]: string | string[];
  };
  introspect?: boolean;
  subscription?: {
    url: string;
    connectionParams?: {[name: string]: string | undefined};
  };
}

export interface Endpoints {
  [key: string]: Endpoint;
}

export const EndpointsExtension: GraphQLExtensionDeclaration = () => {
  return {
    name: 'endpoints',
  };
};
