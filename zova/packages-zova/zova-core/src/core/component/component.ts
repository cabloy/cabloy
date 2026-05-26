import type { Component, ComponentCustomOptions } from 'vue';

import type { TypeModuleResourceComponents } from '../../types/interface/module.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';

export class AppComponent extends BeanSimple {
  /** @internal */
  public async initialize() {}

  /** @internal */
  public _registerComponents(_moduleName: string, components: TypeModuleResourceComponents) {
    if (!components) return;
    for (const key in components) {
      const component = components[key];
      this._setComponentGlobal(component);
    }
  }

  private _setComponentGlobal(component: Component) {
    // register
    const options = component as ComponentCustomOptions;
    if (component.name && options.meta?.global === true) {
      if (!this.app.vue.component(component.name)) {
        this.app.vue.component(component.name, component);
      }
    }
    return component;
  }
}
