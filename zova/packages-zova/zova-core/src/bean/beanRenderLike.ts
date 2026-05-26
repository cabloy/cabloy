import { cast } from '../types/utils/cast.ts';
import { BeanControllerLike } from './beanControllerLike.ts';
import { BeanStyleIdentifier } from './type.ts';

const SymbolStyle = Symbol('SymbolStyle');

export class BeanRenderLike extends BeanControllerLike {
  private get [SymbolStyle](): unknown | undefined {
    return this.bean._getBeanSyncOnly(BeanStyleIdentifier);
  }

  /** @internal */
  public __get__(prop): unknown {
    const value = super.__get__(prop);
    if (value !== undefined) return value;
    const style = cast(this[SymbolStyle]);
    return style?.[prop];
  }

  /** @internal */
  public __set__(prop, value): boolean {
    const res = super.__set__(prop, value);
    if (res) return res;
    const style = cast(this[SymbolStyle]);
    if (!style) return false;
    if (prop in style) {
      style[prop] = value;
      return true;
    } else {
      return false;
    }
  }
}
