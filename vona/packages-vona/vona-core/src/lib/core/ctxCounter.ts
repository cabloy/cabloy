import { sleep } from '@cabloy/utils';

export class CtxCounter {
  private _ctxCounter: number = 0;

  get current() {
    return this._ctxCounter;
  }

  increment() {
    return ++this._ctxCounter;
  }

  decrement() {
    return --this._ctxCounter;
  }

  async awaitUntilZero() {
    while (true) {
      if (this.current === 0) break;
      await sleep(200);
    }
  }
}
