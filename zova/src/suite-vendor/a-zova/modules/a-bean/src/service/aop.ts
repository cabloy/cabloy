import type { BeanAopMethodBase, Constructable, IBeanRecord } from 'zova';

import { appMetadata, appResource, BeanBase, ProxyDisable, Use } from 'zova';

import type { IAopRecord, IDecoratorAopOptions } from '../types/aop.js';
import type { IOnionItem, IOnionSlice } from '../types/onion.js';

import { SysOnion } from '../bean/sys.onion.js';
import { Service } from '../lib/bean.js';
import {
  IAopMethodRecord,
  IDecoratorAopMethodOptions,
  IUseAopMethodPropMetadata,
  SymbolDecoratorUseAopMethod,
} from '../types/aopMethod.js';

type AopMethodsMatchedAll = Record<string, IUseAopMethodPropMetadata[]>;

@ProxyDisable()
@Service()
export class ServiceAop extends BeanBase {
  @Use()
  $$sysOnion: SysOnion;

  async findAopsMatched<T>(
    A: Constructable<T>,
  ): Promise<IOnionSlice<IDecoratorAopOptions, keyof IAopRecord>[] | undefined>;
  async findAopsMatched<K extends keyof IBeanRecord>(
    beanFullName: K,
  ): Promise<IOnionSlice<IDecoratorAopOptions, keyof IAopRecord>[] | undefined>;
  async findAopsMatched(
    beanFullName: string,
  ): Promise<IOnionSlice<IDecoratorAopOptions, keyof IAopRecord>[] | undefined>;
  async findAopsMatched<T>(
    beanFullName: Constructable<T> | string,
  ): Promise<IOnionSlice<IDecoratorAopOptions, keyof IAopRecord>[] | undefined> {
    if (process.env.DEV && this.bean.containerType !== 'sys') {
      throw new Error('should in sys container');
    }
    // beanOptions
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) return;
    // loadOnions
    return await this.$$sysOnion.aop.loadOnionsFromPackage(beanOptions.beanFullName);
  }

  async findAopMethodsMatched<T>(A: Constructable<T>): Promise<AopMethodsMatchedAll | undefined>;
  async findAopMethodsMatched<K extends keyof IBeanRecord>(
    beanFullName: K,
  ): Promise<AopMethodsMatchedAll | undefined>;
  async findAopMethodsMatched(beanFullName: string): Promise<AopMethodsMatchedAll | undefined>;
  async findAopMethodsMatched<T>(
    beanFullName: Constructable<T> | string,
  ): Promise<AopMethodsMatchedAll | undefined> {
    if (process.env.DEV && this.bean.containerType !== 'sys') {
      throw new Error('should in sys container');
    }
    // beanOptions
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) return;
    const aopMethodsMatchedAll: AopMethodsMatchedAll = {};
    const uses = appMetadata.getMetadata<Record<string, IUseAopMethodPropMetadata[]>>(
      SymbolDecoratorUseAopMethod,
      beanOptions.beanClass.prototype,
    );
    for (const prop in uses) {
      const onionItems: IOnionItem<IDecoratorAopMethodOptions, keyof IAopMethodRecord>[] = [];
      const aopMethods: IUseAopMethodPropMetadata[] = uses[prop];
      for (const aopMethod of aopMethods) {
        onionItems.push({
          name: aopMethod.onionName as never,
          options: aopMethod.options,
        });
      }
      // load onions
      const onionSlices = await this.$$sysOnion.aopMethod.loadOnions<BeanAopMethodBase>(onionItems);
      // aopMethodsMatched
      const aopMethodsMatched: IUseAopMethodPropMetadata[] = [];
      for (const onionSlice of onionSlices) {
        const beanInstance = await this.sys.bean._getBean(onionSlice.beanFullName as any, true);
        aopMethodsMatched.push({
          onionName: onionSlice.name as any,
          beanInstance,
          options: onionSlice.options as any,
        });
      }
      aopMethodsMatchedAll[prop] = aopMethodsMatched;
    }
    return Object.keys(aopMethodsMatchedAll).length === 0 ? undefined : aopMethodsMatchedAll;
  }
}
