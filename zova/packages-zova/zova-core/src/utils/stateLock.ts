import { reactive } from 'vue';

const SymbolWaitPromise = Symbol('SymbolWaitPromise');

let __counter = 0;

export class StateLock {
  private _state: boolean;
  private _resolve?: Function;

  static create() {
    return reactive(new StateLock()) as StateLock;
  }

  protected constructor() {
    this._state = false;
    __counter++;
  }

  get state() {
    return this._state;
  }

  touch() {
    if (this._state === true) return;
    this._state = true;
    __counter--;
    // console.log('-----lock counter: ', __counter);
    if (this._resolve) {
      this._resolve.call(undefined, null);
      this._resolve = undefined;
    }
  }

  async wait() {
    if (!this[SymbolWaitPromise]) {
      this[SymbolWaitPromise] = this._waitInner();
    }
    return this[SymbolWaitPromise];
  }

  private async _waitInner() {
    return new Promise(resolve => {
      // condition check should place in the promise inner
      if (this.state) return resolve(null);
      this._resolve = resolve;
    });
  }
}
