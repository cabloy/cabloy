import type { IDecoratorBeanOptionsBase } from '../decorator/interface/beanOptions.ts';

import { appResource } from '../core/sys/resource.ts';
import { StateLock } from '../utils/stateLock.ts';
import { BeanSimple } from './beanSimple.ts';

export const SymbolBeanFullName = Symbol('SymbolBeanFullName');
export const SymbolBeanInstanceKey = Symbol('SymbolBeanInstanceKey');
export const SymbolModuleBelong = Symbol('SymbolModuleBelong');
export const SymbolModuleName = Symbol('SymbolModuleName');
export const SymbolInited = Symbol('SymbolInited');
const SymbolDebugCounter = Symbol('SymbolDebugCounter');

let __debugCounter = 0;

export class BeanBaseSimple extends BeanSimple {
  private [SymbolBeanFullName]: string;
  private [SymbolBeanInstanceKey]: string;
  // @ts-ignore: ignore
  private [SymbolInited]: StateLock;

  constructor() {
    super();
    this[SymbolInited] = StateLock.create();
    if (process.env.DEV) {
      this[SymbolDebugCounter] = ++__debugCounter;
    }
  }

  protected get [SymbolModuleBelong]() {
    const moduleBelong = appResource._getModuleBelong(this[SymbolBeanFullName]);
    if (!moduleBelong) throw new Error(`not found module belong: ${this[SymbolBeanFullName]}`);
    return moduleBelong;
  }

  protected get [SymbolModuleName]() {
    const moduleName = appResource._getModuleName(this[SymbolBeanFullName]);
    if (!moduleName) throw new Error(`not found module name: ${this[SymbolBeanFullName]}`);
    return moduleName;
  }

  public get $beanFullName() {
    return this[SymbolBeanFullName];
  }

  public get $beanInstanceKey() {
    return this[SymbolBeanInstanceKey];
  }

  protected get $beanOptions(): IDecoratorBeanOptionsBase {
    return appResource.getBean(this[SymbolBeanFullName] || (this.constructor as any))!;
  }

  public get $onionName() {
    const parts = this.$beanFullName.split('.');
    return `${parts[0]}:${parts[2]}`;
  }

  public get $onionOptions(): unknown | undefined {
    return this.$beanOptions.options;
  }
}
