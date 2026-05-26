import { isClass } from '@cabloy/utils';
import { toLowerCaseFirstChar } from '@cabloy/word-utils';

import type { IBeanRecord } from '../bean/type.ts';
import type {
  Constructable,
  IDecoratorBeanOptionsBase,
  IDecoratorUseOptionsBase,
} from '../decorator/index.ts';
import type { MetadataKey } from './metadata.ts';

import { cast } from '../../types/utils/cast.ts';
import { BeanSimple } from '../bean/beanSimple.ts';
import { useApp } from '../framework/useApp.ts';
import { registerMappedClassMetadataKey } from '../mappedClass/utils.ts';
import { deepExtend } from '../utils/util.ts';
import { appMetadata } from './metadata.ts';

export const SymbolDecoratorBeanFullName = Symbol('SymbolDecoratorBeanFullName');
export const SymbolDecoratorBeanInfo = Symbol('SymbolDecoratorBeanInfo');
export const SymbolDecoratorProxyDisable = Symbol('SymbolDecoratorProxyDisable');
export const SymbolDecoratorGlobal = Symbol('SymbolDecoratorGlobal');
export const SymbolDecoratorVirtual = Symbol('SymbolDecoratorVirtual');
export const SymbolDecoratorUse = Symbol('SymbolDecoratorUse');

export type IAppResourceRecord = Record<string, IDecoratorBeanOptionsBase>;

export class AppResource extends BeanSimple {
  beans: IAppResourceRecord = {};
  scenes: Record<string, Record<string, IAppResourceRecord>> = {};

  addUse(target: object, options: IDecoratorUseOptionsBase) {
    registerMappedClassMetadataKey(target, SymbolDecoratorUse);
    const uses = appMetadata.getOwnMetadataMap(true, SymbolDecoratorUse, target);
    uses[options.prop] = options;
  }

  getUses(target: object): Record<MetadataKey, IDecoratorUseOptionsBase> | undefined {
    return appMetadata.getMetadata(SymbolDecoratorUse, target);
  }

  addBean(beanOptions: Partial<IDecoratorBeanOptionsBase>) {
    let { module, scene, name, beanClass, options, optionsPrimitive } = beanOptions;
    // virtual
    const virtual = appMetadata.getOwnMetadata<boolean>(SymbolDecoratorVirtual, beanClass!);
    // name
    name = this._parseBeanName(beanClass!, scene, name);
    // module
    if (!module) {
      throw new Error(`module name not parsed for bean: ${scene}.${name}`);
    }
    // beanFullName
    const beanFullName = scene && scene !== ('bean' as any) ? `${module}.${scene}.${name}` : name;
    // moduleBelong
    const moduleBelong = this._parseModuleBelong(module, beanClass, virtual);
    // options
    const options2 = this._prepareOnionOptions(
      options,
      optionsPrimitive,
      scene,
      `${module}:${name}`,
    );
    // beanOptions2
    const beanOptions2 = {
      ...beanOptions,
      beanFullName,
      name,
      moduleBelong,
      options: options2,
    } as IDecoratorBeanOptionsBase;
    // record
    this.beans[beanFullName] = beanOptions2;
    if (!this.scenes[scene!]) this.scenes[scene!] = {};
    if (!this.scenes[scene!][module]) this.scenes[scene!][module] = {};
    this.scenes[scene!][module][beanFullName] = beanOptions2;
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorBeanFullName, beanFullName, beanOptions2.beanClass);
    // ok
    return beanOptions2;
  }

  getBeanFullName<T>(A: Constructable<T> | undefined): string | undefined;
  getBeanFullName<K extends keyof IBeanRecord>(beanFullName: K | undefined): K | undefined;
  getBeanFullName(beanFullName: string | undefined): string | undefined;
  getBeanFullName(beanFullName) {
    if (!beanFullName) return beanFullName;
    if (typeof beanFullName === 'function' && isClass(beanFullName)) {
      return appMetadata.getOwnMetadata(SymbolDecoratorBeanFullName, beanFullName);
    }
    return beanFullName;
  }

  getBean<T>(A: Constructable<T>): IDecoratorBeanOptionsBase<T> | undefined;
  getBean<K extends keyof IBeanRecord>(
    beanFullName: K,
  ): IDecoratorBeanOptionsBase<IBeanRecord[K]> | undefined;
  getBean<T>(beanFullName: string): IDecoratorBeanOptionsBase<T> | undefined;
  getBean<T>(beanFullName): IDecoratorBeanOptionsBase<T> | undefined {
    const fullName = this.getBeanFullName(beanFullName);
    if (!fullName) return null!;
    return this.beans[fullName] as IDecoratorBeanOptionsBase<T>;
  }

  _parseBeanName<T>(beanClass: Constructable<T>, scene?: string, name?: string) {
    // name
    if (name) return name;
    // scene
    if (!scene) scene = 'bean';
    scene = scene.replace(/\./g, '');
    // bean class name
    const beanClassName = beanClass.name;
    if (beanClassName.toLocaleUpperCase().startsWith(scene.toLocaleUpperCase())) {
      name = beanClassName.substring(scene.length);
    } else {
      name = beanClassName;
    }
    // lowerCase
    name = toLowerCaseFirstChar(name);
    return name;
  }

  _parseModuleBelong(module, beanClass, virtual) {
    if (!virtual) return module;
    // check parent
    let moduleBelong;
    let parent = Object.getPrototypeOf(beanClass);
    while (parent) {
      const beanOptions = this.getBean(parent);
      if (beanOptions && beanOptions.moduleBelong) {
        moduleBelong = beanOptions.moduleBelong;
        break;
      }
      parent = Object.getPrototypeOf(parent);
    }
    return moduleBelong;
  }

  _getModuleBelong<T>(A: Constructable<T>): string;
  _getModuleBelong<K extends keyof IBeanRecord>(beanFullName: K): string;
  _getModuleBelong(beanFullName: string): string;
  _getModuleBelong<T>(beanFullName: Constructable<T> | string): string {
    const beanOptions = this.getBean(beanFullName as any);
    if (!beanOptions || !beanOptions.moduleBelong)
      throw new Error(`not found module belong: ${beanFullName}`);
    return beanOptions.moduleBelong;
  }

  _getModuleName<T>(A: Constructable<T>): string | undefined;
  _getModuleName<K extends keyof IBeanRecord>(beanFullName: K): string | undefined;
  _getModuleName(beanFullName: string): string | undefined;
  _getModuleName<T>(beanFullName: Constructable<T> | string): string | undefined {
    const beanOptions = this.getBean(beanFullName as any);
    return beanOptions?.module;
  }

  _prepareOnionOptions(
    options: unknown,
    optionsPrimitive: boolean | undefined,
    scene: any,
    name: string,
  ) {
    const app = useApp();
    if (!app?.config && scene !== 'scope') {
      throw new Error('Should not import vona module in config');
    }
    const optionsConfig = cast(app?.config)?.onions?.[scene]?.[name];
    if (optionsPrimitive) {
      return optionsConfig === undefined ? options : optionsConfig;
    } else {
      return deepExtend({}, options, optionsConfig);
    }
  }

  // _fixClassName(className: string) {
  //   while (className.endsWith('2')) {
  //     className = className.substring(0, className.length - 1);
  //   }
  //   return className;
  // }
}

export const appResource = new AppResource();
