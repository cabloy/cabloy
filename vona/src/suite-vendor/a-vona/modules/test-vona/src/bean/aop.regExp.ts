import type { AopAction, AopActionGetter, AopActionSetter } from 'vona-module-a-aspect';

import { BeanAopBase } from 'vona';
import { Aop } from 'vona-module-a-aspect';

import type { BeanTestCtx } from './bean.testCtx.ts';

@Aop({ match: [/^test-vona\.service\.test\w+$/, 'testCtx'], meta: { mode: ['test', 'dev'] } })
export class AopRegExp extends BeanAopBase {
  protected __get_name__: AopActionGetter<BeanTestCtx, 'name'> = function (next, _receiver) {
    const value = next();
    return `${value}:regexpaop`;
  };

  protected __set_name__: AopActionSetter<BeanTestCtx, 'name'> = function (value, next, _receiver) {
    const parts = value.split(':');
    const index = parts.indexOf('regexpaop');
    if (index > -1) {
      parts.splice(index, 1);
    }
    value = parts.join(':');
    return next(value);
  };

  actionSync: AopAction<BeanTestCtx, 'actionSync', string> = (_args, next, _receiver) => {
    const result = next();
    return `${result}:regexpaop`;
  };

  actionAsync: AopAction<BeanTestCtx, 'actionAsync', string> = async (_args, next, _receiver) => {
    const result = await next();
    return `${result}:regexpaop`;
  };
}
