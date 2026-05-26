import { isClass } from '@cabloy/utils';
import { parseLastWord, skipLastWord, skipPrefix, splitWords } from '@cabloy/word-utils';

import type { IBeanRecord } from '../../bean/type.ts';
import type {
  Constructable,
  IBeanSceneRecord,
  IDecoratorBeanInfoOptions,
  IDecoratorBeanOptionsBase,
  IDecoratorUseOptionsBase,
} from '../../decorator/index.js';
import type { MetadataKey } from './metadata.ts';

import { registerMappedClassMetadataKey } from '../../mappedClass/utils.ts';
import { cast } from '../../types/utils/cast.ts';
import { appMetadata } from './metadata.ts';
import { getSys } from './sysFake.ts';
import { deepExtend } from './util.ts';

export const DecoratorBeanFullName = Symbol('Decorator#BeanFullName');
export const SymbolDecoratorBeanInfo = Symbol('SymbolDecoratorBeanInfo');
export const SymbolDecoratorProxyDisable = Symbol('SymbolDecoratorProxyDisable');
export const SymbolDecoratorPreload = Symbol('SymbolDecoratorPreload');
export const SymbolDecoratorVirtual = Symbol('SymbolDecoratorVirtual');
export const SymbolDecoratorUse = Symbol('SymbolDecoratorUse');

export type IAppResourceRecord = Record<string, IDecoratorBeanOptionsBase>;

export class AppResource {
  beans: Record<string, IDecoratorBeanOptionsBase> = {};
  scenes: Record<string, Record<string, IAppResourceRecord>> = {};

  /** @internal */
  public dispose() {
    // just need override state rather than clearing state
    // this.beans = {};
    // this.scenes = {};
  }

  addUse(target: object, options: IDecoratorUseOptionsBase) {
    registerMappedClassMetadataKey(target, SymbolDecoratorUse);
    const uses = appMetadata.getOwnMetadataMap(true, SymbolDecoratorUse, target);
    uses[options.prop] = options;
    if (process.env.DEV) {
      if (typeof options.prop === 'string' && !options.prop.startsWith('$$')) {
        console.error(`inject prop name should start with $$: ${options.prop}`);
      }
    }
  }

  getUses(target: object): Record<MetadataKey, IDecoratorUseOptionsBase> | undefined {
    return appMetadata.getMetadata(SymbolDecoratorUse, target);
  }

  addBean<T>(beanOptions: Partial<IDecoratorBeanOptionsBase<T>>) {
    const { beanClass, options, optionsPrimitive } = beanOptions;
    // virtual
    const virtual = appMetadata.getOwnMetadata<boolean>(SymbolDecoratorVirtual, beanClass!);
    // name
    const { scene, name } = this._parseSceneAndBeanName(
      beanClass!,
      beanOptions.scene,
      beanOptions.name,
    );
    // beanInfo
    const beanInfo = appMetadata.getOwnMetadata<IDecoratorBeanInfoOptions>(
      SymbolDecoratorBeanInfo,
      beanClass!,
    );
    // module
    const module = beanInfo?.module;
    if (!module) throw new Error(`module name not parsed for bean: ${scene}.${name}`);
    // beanFullName
    const beanFullName = `${module}.${scene}.${name}`;
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
      module,
      scene: scene as keyof IBeanSceneRecord,
      name,
      beanFullName,
      moduleBelong,
      options: options2,
    } as IDecoratorBeanOptionsBase<T>;
    // record
    this.beans[beanFullName] = beanOptions2;
    if (!this.scenes[scene!]) this.scenes[scene!] = {};
    if (!this.scenes[scene!][module]) this.scenes[scene!][module] = {};
    this.scenes[scene!][module][beanFullName] = beanOptions2;
    // set metadata
    appMetadata.defineMetadata(DecoratorBeanFullName, beanFullName, beanOptions2.beanClass);
    // ok
    return beanOptions2;
  }

  getBeanFullName<T>(A: Constructable<T> | undefined): string | undefined;
  getBeanFullName<K extends keyof IBeanRecord>(beanFullName: K | undefined): K | undefined;
  getBeanFullName(beanFullName: string | undefined): string | undefined;
  getBeanFullName(beanFullName) {
    if (!beanFullName) return beanFullName;
    if (typeof beanFullName === 'function' && isClass(beanFullName)) {
      return appMetadata.getOwnMetadata(DecoratorBeanFullName, beanFullName);
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

  _parseSceneAndBeanName<T>(
    beanClass: Constructable<T>,
    scene?: string,
    name?: string,
  ): { scene: string; name: string } {
    if (scene && name) {
      return { scene, name };
    }
    // bean class name
    // let beanClassName = this._fixClassName(beanClass.name);
    let beanClassName = beanClass.name;
    // skip prefix: Bean
    if (beanClassName.toLowerCase().startsWith('bean')) {
      beanClassName = beanClassName.substring('bean'.length);
    }
    // name
    if (!name) {
      if (scene) {
        name = skipPrefix(beanClassName, scene, true)!;
      } else {
        name = parseLastWord(beanClassName, true)!;
      }
    }
    // scene
    if (!scene) {
      scene = skipLastWord(beanClassName, name, true)!;
      scene = splitWords(scene, true, '.')!;
    }
    // ok
    return { scene, name };
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

  _getModuleBelong<T>(A: Constructable<T>): string | undefined;
  _getModuleBelong<K extends keyof IBeanRecord>(beanFullName: K): string | undefined;
  _getModuleBelong(beanFullName: string): string | undefined;
  _getModuleBelong<T>(beanFullName: Constructable<T> | string): string | undefined {
    const beanOptions = this.getBean(beanFullName as any);
    return beanOptions?.moduleBelong;
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
    const sys = getSys();
    const optionsConfig = cast(sys.config).onions[scene]?.[name];
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
