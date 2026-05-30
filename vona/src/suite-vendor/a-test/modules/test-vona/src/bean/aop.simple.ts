import type {
  AopAction,
  AopActionDispose,
  AopActionGet,
  AopActionGetter,
  AopActionInit,
  AopActionSet,
  AopActionSetter,
} from 'vona-module-a-aspect';
import type { BeanTestCtx } from 'vona-module-test-vona';

import { BeanAopBase } from 'vona';
import { Aop } from 'vona-module-a-aspect';

declare module 'vona-module-test-vona' {
  export interface BeanTestCtx {
    magic: string;
  }
}

class AopSimpleBase extends BeanAopBase {
  actionSync: AopAction<BeanTestCtx, 'actionSync', string> = (_args, next, _receiver) => {
    const result = next();
    return `${result}:simpleaop`;
  };
}

@Aop({ match: 'testCtx', dependencies: 'test-vona:regExp', meta: { mode: ['test', 'dev'] } })
export class AopSimple extends AopSimpleBase {
  protected __get__: AopActionGet<BeanTestCtx> = (prop, next, _receiver) => {
    const value = next();
    if (prop === 'magic') {
      return 'magic:simpleaop';
    }
    // if (prop === 'name') {
    //   return `${value}:simpleaop`;
    // }
    return value;
  };

  protected __set__: AopActionSet<BeanTestCtx> = (_prop, value, next, _receiver) => {
    // if (prop === 'name') {
    //   const parts = value.split(':');
    //   const index = parts.indexOf('simpleaop');
    //   if (index > -1) {
    //     parts.splice(index, 1);
    //   }
    //   value = parts.join(':');
    // }
    return next(value);
  };

  protected __get_name__: AopActionGetter<BeanTestCtx, 'name'> = function (next, _receiver) {
    const value = next();
    return `${value}:simpleaop`;
  };

  protected __set_name__: AopActionSetter<BeanTestCtx, 'name'> = function (value, next, _receiver) {
    const parts = value.split(':');
    const index = parts.indexOf('simpleaop');
    if (index > -1) {
      parts.splice(index, 1);
    }
    value = parts.join(':');
    return next(value);
  };

  protected __init__: AopActionInit<BeanTestCtx> = (_args, next, _receiver) => {
    next();
  };

  protected __dispose__: AopActionDispose<BeanTestCtx> = async (_args, next, _receiver) => {
    await next();
  };

  actionAsync: AopAction<BeanTestCtx, 'actionAsync', string> = async (_args, next, _receiver) => {
    const result = await next(_args);
    return `${result}:simpleaop`;
  };
}
