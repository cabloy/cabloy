import { evaluateExpressions } from '@cabloy/utils';
import { isNilOrEmptyString } from '@cabloy/utils';

import type { IBeanRecord } from '../../bean/type.ts';
import type { MetadataKey } from '../../core/metadata.ts';
import type {
  Constructable,
  IDecoratorUseOptions,
  IDecoratorUseOptionsBase,
  IInjectSelectorInfo,
  IUsePrepareArgResult,
} from '../index.ts';

import { appMetadata } from '../../core/metadata.ts';
import { appResource } from '../../core/resource.ts';

export function Use(options?: IDecoratorUseOptions): PropertyDecorator & MethodDecorator;
export function Use<T extends keyof IBeanRecord>(
  beanFullName?: T,
): PropertyDecorator & MethodDecorator;
export function Use(options?: IDecoratorUseOptions | string): PropertyDecorator & MethodDecorator {
  return function (target: object, prop: MetadataKey, descriptor?: PropertyDescriptor) {
    if (!options) options = {};
    if (typeof options === 'string') {
      options = { beanFullName: options } as unknown as IDecoratorUseOptions;
    }
    // beanClass maybe has no specific class type
    const beanClass = appMetadata.getDesignType(target, prop) as Constructable;
    // beanFullName
    let beanFullName: string | undefined = options.beanFullName;
    if (!beanFullName) {
      beanFullName = appResource.getBeanFullName(beanClass);
      if (!beanFullName) {
        throw new Error(
          `@Use not found valid beanFullName for: ${target.constructor.name}.${String(prop)}`,
        );
      }
    }
    // record
    appResource.addUse(target, {
      ...options,
      prop,
      beanFullName,
      descriptor,
    });
  };
}

export function usePrepareArg(arg: () => any, withSelector?: boolean): any {
  return {
    withSelector,
    args: [arg],
  };
}

export function usePrepareArgs(args: Array<(() => any) | any>, withSelector?: boolean): any {
  return {
    withSelector,
    args,
  };
}

export function __prepareInjectSelectorInfo(
  beanInstance,
  useOptions: IDecoratorUseOptionsBase,
): IInjectSelectorInfo {
  let selectorInfo = __prepareInjectSelectorInfo_descriptor(beanInstance, useOptions);
  if (!selectorInfo) {
    selectorInfo = __prepareInjectSelectorInfo_init(beanInstance, useOptions);
  }
  if (!selectorInfo && !isNilOrEmptyString(useOptions.selector)) {
    const selector = evaluateExpressions(useOptions.selector, {
      self: beanInstance,
      app: beanInstance.app,
      ctx: beanInstance.ctx,
    });
    return { withSelector: true, args: [selector] };
  }
  return selectorInfo ?? { withSelector: false, args: [] };
}

function __prepareInjectSelectorInfo_descriptor(
  beanInstance,
  useOptions: IDecoratorUseOptionsBase,
): IInjectSelectorInfo | undefined {
  const fnGet = useOptions.descriptor?.get;
  if (!fnGet) return;
  const res: IUsePrepareArgResult = fnGet.call(beanInstance);
  if (!res) return;
  const withSelector = res.withSelector ?? false;
  const args = res.args.map(arg => (typeof arg === 'function' ? arg() : arg));
  return { withSelector, args };
}

function __prepareInjectSelectorInfo_init(
  beanInstance,
  useOptions: IDecoratorUseOptionsBase,
): IInjectSelectorInfo | undefined {
  const init = useOptions.init;
  if (!init) return;
  const withSelector = init.withSelector ?? false;
  const _args = init.args ?? [init.arg];
  if (!_args) return;
  const context = { self: { ...beanInstance } };
  const args = _args.map(arg => evaluateExpressions(arg, context));
  return { withSelector, args };
}
