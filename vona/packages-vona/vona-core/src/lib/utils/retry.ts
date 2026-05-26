import * as Retry from 'retry';

export * as Retry from 'retry';

export type RetryFunction<DATA> = (currentAttempt: number) => Promise<DATA>;
export async function retry<DATA = void>(options: Retry.OperationOptions, fn: RetryFunction<DATA>) {
  return new Promise((resolve, reject) => {
    const operation = Retry.operation(options);
    operation.attempt(currentAttempt => {
      fn(currentAttempt)
        .then(data => resolve(data))
        .catch(err => {
          if (operation.retry(err)) return;
          reject(err);
        });
    });
  });
}
