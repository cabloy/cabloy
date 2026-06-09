import { withCurrentInstanceScope } from '@cabloy/vue-runtime-core';
import { pauseTracking, resetTracking } from '@vue/reactivity';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { throwErrorComponentUnmounted } from '../sys/util.ts';

export class CtxUtil extends BeanSimple {
  instanceScope(fn, tracking?: boolean) {
    if (this.ctx.disposed) {
      throwErrorComponentUnmounted();
    }
    const instance = this.ctx.instance as any;
    const result = withCurrentInstanceScope(instance, () => {
      if (!tracking) {
        pauseTracking();
      }
      try {
        const result = fn();
        return result;
      } finally {
        if (!tracking) {
          resetTracking();
        }
      }
    });
    return result;
  }
}
