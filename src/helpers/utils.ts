import {
  IGraphQLConfig,
  IGraphQLProject,
  IGraphQLProjects,
  IGraphQLProjectLegacy,
} from '../types';

export function flatten<T>(arr: T[]): T extends (infer A)[] ? A[] : T[] {
  return Array.prototype.concat(...arr) as any;
}

export function isMultipleProjectConfig(
  config: IGraphQLConfig,
): config is IGraphQLProjects {
  return typeof (config as IGraphQLProjects).projects === 'object';
}

export function isSingleProjectConfig(
  config: IGraphQLConfig,
): config is IGraphQLProject {
  return typeof (config as IGraphQLProject).schema !== 'undefined';
}

export function isLegacyProjectConfig(
  config: IGraphQLConfig,
): config is IGraphQLProjectLegacy {
  return (
    typeof (config as IGraphQLProjectLegacy).schemaPath !== 'undefined' ||
    typeof (config as IGraphQLProjectLegacy).includes !== 'undefined' ||
    typeof (config as IGraphQLProjectLegacy).excludes !== 'undefined'
  );
}

export type MiddlewareFn<T> = (input: T) => T;

export function useMiddleware<T>(fns: Array<MiddlewareFn<T>>) {
  return (input: T) => {
    if (fns.length) {
      return fns.reduce((obj, cb) => cb(obj), input);
    }

    return input;
  };
}
