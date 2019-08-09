export const promisify = <T>(fn: Function) =>
  function(...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fn(...args, (err: any, result: T) => {
        if (err !== null) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };
