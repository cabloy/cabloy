import { throwErrorComponentUnmounted } from '../core/sys/util.ts';
import { cast } from '../types/utils/cast.ts';
import { BeanBase } from './beanBase.ts';
import { BeanControllerIdentifier } from './type.ts';

export const SymbolController = Symbol('SymbolController');

export class BeanControllerLike extends BeanBase {
  protected get [SymbolController](): unknown | undefined {
    if (this.ctx.disposed) {
      throwErrorComponentUnmounted();
    }
    return this.bean._getBeanSyncOnly(BeanControllerIdentifier);
  }

  /** @internal */
  public __get__(prop): unknown {
    const controller = cast(this[SymbolController]);
    return controller?.[prop];
  }

  /** @internal */
  public __set__(prop, value): boolean {
    const controller = cast(this[SymbolController]);
    if (!controller) return false;
    if (prop in controller) {
      controller[prop] = value;
      return true;
    } else {
      return false;
    }
  }
}
