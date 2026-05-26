import { shallowReactive } from 'vue';

import type { IComponentOptions, IControllerData, ISlot, ISlotsDefault } from './type.ts';

import { deepExtend } from '../core/sys/util.ts';
import { cast } from '../types/utils/cast.ts';
import { useModel } from '../vueExtra/useModel.ts';
import { BeanBase } from './beanBase.ts';

export class BeanControllerBase extends BeanBase {
  public $props: unknown;
  public $slots: ISlotsDefault;

  /** @internal */
  public __initControllerData(controllerData: IControllerData) {
    if (this.ctx.disposed) return;
    // slots
    this.$slots = controllerData.context.slots as any;
    // props
    this.__initControllerProps(this.ctx.instance.vnode.props);
    this.app.meta.module._monkeyModuleSync(
      true,
      'controllerDataInit',
      undefined,
      controllerData,
      this,
    );
  }

  /** @internal */
  public __updateControllerData() {
    if (this.ctx.disposed) return;
    // props
    this.__initControllerProps(this.ctx.instance.vnode.props);
    this.app.meta.module._monkeyModuleSync(true, 'controllerDataUpdate', undefined, this);
  }

  public $useModel(name?, options?) {
    if (typeof name === 'object') {
      options = name;
      name = 'modelValue';
    }
    if (!name) name = 'modelValue';
    return useModel.call(this, this.$props as any, name, options);
  }

  public get $slotDefault(): ISlot | undefined {
    return cast(this.$props).slotDefault ?? this.$slots.default;
  }

  private __initControllerProps(propsInput: unknown | undefined) {
    const componentOptions: IComponentOptions | undefined =
      Object.getPrototypeOf(this).constructor.$componentOptions;
    const propsDefault = Object.getPrototypeOf(this).constructor.$propsDefault;
    let props = Object.assign({}, propsInput);
    for (const key in props) {
      if (props[key] === undefined) {
        delete props[key];
      }
    }
    props = componentOptions?.deepExtendDefault
      ? deepExtend({}, propsDefault, props)
      : Object.assign({}, propsDefault, props);
    if (!this.$props) {
      this.$props = process.env.SERVER ? props : shallowReactive(props as any);
    } else {
      // hold the same $props ref
      Object.assign(this.$props as any, props);
      for (const key in this.$props) {
        if (!props || !Object.hasOwnProperty.call(props, key)) {
          delete this.$props[key];
        }
      }
    }
  }
}
