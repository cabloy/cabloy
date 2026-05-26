import type { Constructable, IBeanRecord } from 'vona';
import type {
  IDecoratorAopOptions,
  IUseAopMethodPropMetadata,
  IUseAopMethodPropMetadataInner,
} from 'vona-module-a-aspect';

import {
  appMetadata,
  appResource,
  BeanBase,
  beanFullNameFromOnionName,
  deepExtend,
  ProxyDisable,
} from 'vona';
import { SymbolDecoratorUseAopMethod } from 'vona-module-a-aspect';
import { Service } from 'vona-module-a-bean';

@ProxyDisable()
@Service()
export class ServiceAop extends BeanBase {
  findAopsMatched<T>(A: Constructable<T>): string[] | undefined;
  findAopsMatched<K extends keyof IBeanRecord>(beanFullName: K): string[] | undefined;
  findAopsMatched(beanFullName: string): string[] | undefined;
  findAopsMatched<T>(beanFullName: Constructable<T> | string): string[] | undefined {
    // beanOptions
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) return;
    // loop
    const aopsMatched: string[] = [];
    for (const aop of this.bean.onion.aop.onionsGlobal) {
      const aopOptions = aop.beanOptions.options as unknown as IDecoratorAopOptions;
      // not self
      if (aop.beanOptions.beanFullName === beanOptions.beanFullName) continue;
      // // check if match aop
      // if (beanOptions.scene === 'aop' && !aop.beanOptions.matchAop) continue;
      // check if enabled
      if (this.bean.onion.checkOnionOptionsEnabled(aopOptions, beanOptions.beanFullName)) {
        aopsMatched.push(aop.beanOptions.beanFullName);
      }
    }
    return aopsMatched;
  }

  hasAopMethods<T>(A: Constructable<T>): boolean;
  hasAopMethods<K extends keyof IBeanRecord>(beanFullName: K): boolean;
  hasAopMethods(beanFullName: string): boolean;
  hasAopMethods<T>(beanFullName: Constructable<T> | string): boolean {
    // beanOptions
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) return false;
    const uses = appMetadata.getMetadata(
      SymbolDecoratorUseAopMethod,
      beanOptions.beanClass.prototype,
    );
    return !!uses;
  }

  findAopMethodsMatched<T>(
    A: Constructable<T>,
    prop: string,
  ): IUseAopMethodPropMetadataInner[] | undefined;
  findAopMethodsMatched<K extends keyof IBeanRecord>(
    beanFullName: K,
    prop: string,
  ): IUseAopMethodPropMetadataInner[] | undefined;
  findAopMethodsMatched(
    beanFullName: string,
    prop: string,
  ): IUseAopMethodPropMetadataInner[] | undefined;
  findAopMethodsMatched<T>(
    beanFullName: Constructable<T> | string,
    prop: string,
  ): IUseAopMethodPropMetadataInner[] | undefined {
    // beanOptions
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) return;
    const aopMethodsMatched: IUseAopMethodPropMetadataInner[] = [];
    const uses = appMetadata.getMetadata(
      SymbolDecoratorUseAopMethod,
      beanOptions.beanClass.prototype,
    );
    const aopMethods: IUseAopMethodPropMetadata[] | undefined = uses?.[prop];
    if (aopMethods) {
      for (const aopMethod of aopMethods) {
        const onionSlice = this.bean.onion.aopMethod.getOnionSlice(aopMethod.onionName!);
        const options = deepExtend({}, onionSlice.beanOptions.options, aopMethod.options);
        if (this.bean.onion.checkOnionOptionsEnabled(options)) {
          const beanFullName = beanFullNameFromOnionName(aopMethod.onionName!, 'aopMethod');
          aopMethodsMatched.push({
            beanFullName,
            onionName: aopMethod.onionName,
            options,
          });
        }
      }
    }
    return aopMethodsMatched;
  }
}
