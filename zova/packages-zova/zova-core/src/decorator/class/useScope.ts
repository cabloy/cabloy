import type { IBeanScopeRecord } from '../../bean/type.ts';
import type { MetadataKey } from '../../core/sys/metadata.ts';
import type { IDecoratorUseScopeOptions } from '../index.ts';

import { appResource } from '../../core/sys/resource.ts';

export function UseScope(options: IDecoratorUseScopeOptions): PropertyDecorator;
export function UseScope<T extends keyof IBeanScopeRecord>(module?: T): PropertyDecorator;
export function UseScope(options?: IDecoratorUseScopeOptions | string): PropertyDecorator {
  return function (target: object, prop: MetadataKey) {
    if (!options) throw new Error('should specify the module name');
    if (typeof options === 'string') {
      options = { module: options } as unknown as IDecoratorUseScopeOptions;
    }
    const beanFullName = `${options.module}.scope.module`;
    // record
    appResource.addUse(target, {
      ...options,
      prop,
      beanFullName,
    });
  };
}
