import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase, disposeInstance } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

import { ServiceEventListener } from '../service/eventListener.ts';

@Hmr()
export class HmrEventListener extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    const events = this.bean.onion.event.onionsNormal;
    for (const onionName in events) {
      const beanEventListener = this.bean._getBeanSelector(ServiceEventListener, onionName);
      await disposeInstance(beanEventListener);
    }
  }
}
