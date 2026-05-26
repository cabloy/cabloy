import { BeanSimple } from '../../bean/beanSimple.ts';
import { StateLock } from '../../utils/stateLock.ts';

let __id: number = 0;

export class CtxState extends BeanSimple {
  private _id: number;
  private _inited: StateLock;

  protected __init__() {
    this._id = ++__id;
    this._inited = StateLock.create();
  }

  get id() {
    return this._id;
  }

  get inited() {
    return this._inited;
  }
}
