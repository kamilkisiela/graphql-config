type PromiseOf<T extends (...args: any[]) => any> = T extends (...args: any[]) => Promise<infer R> ? R : ReturnType<T>;

export function runTests<
  TSync extends (...args: any[]) => TResult,
  TAsync extends (...args: any[]) => Promise<TResult>,
  TResult = ReturnType<TSync>,
>({ sync: executeSync, async: executeAsync }: { sync: TSync; async: TAsync }) {
  return (
    testRunner: (
      executeFn: (...args: Parameters<TSync | TAsync>) => Promise<PromiseOf<TSync | TAsync>>,
      mode: 'sync' | 'async',
    ) => void,
  ) => {
    // sync
    describe('sync', () => {
      testRunner((...args: Parameters<TSync>) => {
        return new Promise<PromiseOf<TAsync>>((resolve, reject) => {
          try {
            const result: any = executeSync(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }, 'sync');
    });
    // async
    describe('async', () => {
      testRunner(executeAsync as any, 'async');
    });
  };
}
