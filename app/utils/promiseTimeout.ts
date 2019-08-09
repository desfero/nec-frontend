import { delay } from "redux-saga";

interface IPromiseTimeoutConfig<T> {
  promise: Promise<T>;
  defaultValue: T;
  timeout: number;
}

/**
 * Wait for promise to resolve for specific time or return default value
 */
export function promiseTimeout<T>(options: IPromiseTimeoutConfig<T>): Promise<T> {
  const timeoutPromise = async () => {
    await delay(options.timeout);
    return options.defaultValue;
  };

  return Promise.race([options.promise, timeoutPromise()]);
}
