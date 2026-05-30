import type { Next, NextSync } from 'vona';
import type {
  IAopMethodExecute,
  IAopMethodGet,
  IAopMethodSet,
  IDecoratorAopMethodOptions,
} from 'vona-module-a-aspect';

import { BeanAopMethodBase } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

export interface IAopMethodOptionsTest extends IDecoratorAopMethodOptions {
  wrapper: string;
}

@AopMethod<IAopMethodOptionsTest>({ wrapper: '' })
export class AopMethodTest
  extends BeanAopMethodBase
  implements IAopMethodGet, IAopMethodSet, IAopMethodExecute
{
  get(options: IAopMethodOptionsTest, next: NextSync, _receiver: any, _prop: string): string {
    const res = next();
    return this._wrapper(options.wrapper, res);
  }

  set(
    options: IAopMethodOptionsTest,
    value: string,
    next: NextSync,
    _receiver: any,
    _prop: string,
  ): boolean {
    return next(this._unwrapper(options.wrapper, value));
  }

  execute(
    options: IAopMethodOptionsTest,
    _args: [],
    next: Next | NextSync,
    _receiver: any,
    _prop: string,
  ): Promise<string> | string {
    const res = next();
    if (res?.then) {
      return res.then(res => {
        return this._wrapper(options.wrapper, res);
      });
    }
    return this._wrapper(options.wrapper, res);
  }

  _wrapper(wrapper: string, data: string) {
    return `${wrapper}${data}${wrapper}`;
  }

  _unwrapper(wrapper: string, data: string) {
    let index = data.indexOf(wrapper);
    if (index === 0) data = data.substring(wrapper.length);
    index = data.lastIndexOf(wrapper);
    if (index === data.length - wrapper.length) data = data.substring(0, index);
    return data;
  }
}
