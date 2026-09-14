import type { IComponentOptions } from 'zova';

import { h } from 'vue';
import { BeanControllerBase, cast } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZRouterViewStack } from 'zova-module-a-routerstack';

import type { IModalRoutedDialogItem } from '../../types/appModal.js';

export interface ControllerRoutedDialogProps {
  item: IModalRoutedDialogItem;
}

@Controller()
export class ControllerRoutedDialog extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private $$modelStack: object | undefined;

  protected async __init__() {
    const item = (this.$props as ControllerRoutedDialogProps).item as IModalRoutedDialogItem;
    const router = item.state.router;
    if (!router) return;
    const scene = `routedDialog:${item.id}`;
    this.bean._setBean('a-router.bean.router', router);
    this.$$modelStack = await this.bean._getBeanSelector(
      'a-routerstack.model.stack',
      true,
      scene,
      scene,
      {},
    );
  }

  protected render() {
    const item = (this.$props as ControllerRoutedDialogProps).item as IModalRoutedDialogItem;
    if (item.state.status === 'error') {
      return <div class="text-error whitespace-pre-wrap">{String(item.state.error)}</div>;
    }
    if (!this.$$modelStack) return <div class="loading loading-spinner"></div>;
    const router = item.state.router;
    if (!router) return <div class="text-error">Router unavailable</div>;
    const vnode = h(ZRouterViewStack);
    cast(vnode).zovaHostProviders = {
      'a-router.bean.router': router,
      '$$modelStack': this.$$modelStack,
    };
    return vnode;
  }
}
