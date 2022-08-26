import type { IGraphQLConfig, IGraphQLProject, IGraphQLProjects, IGraphQLProjectLegacy } from '../types.js';

export function isMultipleProjectConfig(config: IGraphQLConfig): config is IGraphQLProjects {
  return typeof (config as IGraphQLProjects).projects === 'object';
}

export function isSingleProjectConfig(config: IGraphQLConfig): config is IGraphQLProject {
  return (config as IGraphQLProject).schema !== undefined;
}

export function isLegacyProjectConfig(config: IGraphQLConfig): config is IGraphQLProjectLegacy {
  return (
    (config as IGraphQLProjectLegacy).schemaPath !== undefined ||
    (config as IGraphQLProjectLegacy).includes !== undefined ||
    (config as IGraphQLProjectLegacy).excludes !== undefined
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
