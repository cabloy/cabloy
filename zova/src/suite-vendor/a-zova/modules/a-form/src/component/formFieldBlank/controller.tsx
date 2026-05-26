import type { IComponentOptions } from 'zova';

import { VNode } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { ControllerForm } from '../form/controller.jsx';

export interface ControllerFormFieldBlankProps<TParentData extends {} = {}, TSubmitMeta = never> {
  slotDefault?: (form: ControllerForm<TParentData, TSubmitMeta>) => VNode | undefined;
}

@Controller()
export class ControllerFormFieldBlank<TParentData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm<TParentData>;

  protected async __init__() {}

  protected render() {
    if (this.$slotDefault) {
      return this.$slotDefault(this.$$form);
    }
  }
}
