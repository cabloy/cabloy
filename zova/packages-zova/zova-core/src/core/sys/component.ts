import type { Component } from 'vue';

import { markRaw } from 'vue';

import type { IZovaComponentRecord } from '../../bean/resource/component/type.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { createZovaComponentAsync } from '../../components/createZovaComponentAsync.ts';

const SymbolZovaComponents = Symbol('SymbolZovaComponents');

export class SysComponent extends BeanSimple {
  private [SymbolZovaComponents]: Record<string, any> = {};

  /** @internal */
  public async initialize() {}

  /** @internal */
  public dispose() {}

  public createAsyncComponent(module: string, name?: string) {
    return () => {
      return this.use(module, name);
    };
    // should not use defineAsyncComponent
    // return defineAsyncComponent(() => {
    //   return this.use(componentName);
    // });
  }

  public getZovaComponent<K extends keyof IZovaComponentRecord>(
    componentName: K,
  ): IZovaComponentRecord[K];
  public getZovaComponent(module: string, name: string);
  public getZovaComponent(module: string, name?: string) {
    const componentName = module.includes(':') ? module : `${module}:${name}`;
    if (!this[SymbolZovaComponents][componentName]) {
      this[SymbolZovaComponents][componentName] = markRaw(createZovaComponentAsync(componentName));
    }
    return this[SymbolZovaComponents][componentName];
  }

  public async use(module: string, name?: string): Promise<Component> {
    if (module.includes(':')) {
      const parts = module.split(':');
      module = parts[0];
      name = parts[1];
    }
    const _module = await this.sys.meta.module.use(module);
    return _module.resource.components[name!];
  }
}
