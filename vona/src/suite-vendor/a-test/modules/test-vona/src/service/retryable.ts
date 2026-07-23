import { BeanBase } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

const RetryOptions = {
  retries: 2,
  factor: 1,
  minTimeout: 0,
  maxTimeout: 0,
  randomize: false,
  errorCodes: ['RETRYABLE'],
};

@Service()
export class ServiceRetryable extends BeanBase {
  private _attempts = new Map<string, number>();

  @Core.retryable(RetryOptions)
  async core(key: string, failures: number, errorCode = 'RETRYABLE') {
    return await this._run(key, failures, errorCode);
  }

  @Aspect.aopMethod('a-retryable:retryable', RetryOptions)
  async direct(key: string, failures: number, errorCode = 'RETRYABLE') {
    return await this._run(key, failures, errorCode);
  }

  @Core.retryable({
    ...RetryOptions,
    enable: false,
  })
  async disabled(key: string, failures: number, errorCode = 'RETRYABLE') {
    return await this._run(key, failures, errorCode);
  }

  @Core.transaction()
  @Core.retryable(RetryOptions)
  async transaction(tableName: string, key: string, failures: number) {
    const attempt = this._nextAttempt(key);
    await this.bean.model.insert(tableName as any, { name: `${key}-${attempt}` });
    if (attempt <= failures) this._throw('RETRYABLE');
    return attempt;
  }

  attempts(key: string) {
    return this._attempts.get(key) ?? 0;
  }

  private async _run(key: string, failures: number, errorCode: string) {
    const attempt = this._nextAttempt(key);
    if (attempt <= failures) this._throw(errorCode);
    return attempt;
  }

  private _nextAttempt(key: string) {
    const attempt = this.attempts(key) + 1;
    this._attempts.set(key, attempt);
    return attempt;
  }

  private _throw(code: string): never {
    throw Object.assign(new Error(code), { code });
  }
}
