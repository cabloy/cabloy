import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { TypeEventHmrReloadData, TypeEventHmrReloadResult } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

import { clearAllCacheMenus } from '../lib/const.ts';

type TypeEventData = TypeEventHmrReloadData;
type TypeEventResult = TypeEventHmrReloadResult;

@EventListener({ match: 'a-hmr:hmrReload' })
export class EventListenerHmrReload
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    await next();
    const scene = data.beanOptions?.scene;
    if (data.sceneName === '_locale') {
      clearAllCacheMenus(this.app);
      this.bean.ssrHmr.reload();
    } else if (scene && ['ssrSite', 'ssrMenu', 'ssrMenuGroup'].includes(scene)) {
      this.bean.ssrHmr.reload();
    } else if (scene && ['controller'].includes(scene)) {
      await this.bean.hmr.reloadBeansOfScene('ssrSite');
      this.bean.ssrHmr.reload();
    }
  }
}
