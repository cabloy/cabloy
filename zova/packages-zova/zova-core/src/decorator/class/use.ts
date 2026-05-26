import { evaluateExpressions, isNilOrEmptyString } from '@cabloy/utils';
import { toRef } from 'vue';

import type { IBeanRecord } from '../../bean/type.ts';
import type { MetadataKey } from '../../core/sys/metadata.ts';
import type {
  Constructable,
  IDecoratorUseOptions,
  IDecoratorUseOptionsBase,
  IInjectSelectorInfo,
  IUsePrepareArgResult,
  TypeDecoratorUseOptionsInitArg,
} from '../index.js';

import { appMetadata } from '../../core/sys/metadata.ts';
import { appResource } from '../../core/sys/resource.ts';

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
    // beanClass
    const beanClass = appMetadata.getDesignType(target, prop) as Constructable;
    // record
    appResource.addUse(target, {
      ...options,
      prop,
      beanClass,
      descriptor,
    });
    // chech beanClass
    if (process.env.CLIENT && process.env.DEV) {
      const moduleSource = appResource._getModuleName(beanClass);
      if (moduleSource) {
        window.setTimeout(() => {
          const moduleTarget = appResource._getModuleName(target.constructor as any);
          if (moduleSource !== moduleTarget) {
            console.error(
              `inject class should be imported by type, such as: import type { ${beanClass.name} } from 'zova-module-xxx-xxx'`,
            );
          }
        }, 0);
      }
    }
  };
}

export function usePrepareArg(
  arg: (() => any) | any,
  withSelector?: boolean,
  markReactive?: boolean,
): any {
  return {
    withSelector,
    markReactive,
    args: [arg],
  };
}

export function usePrepareArgs(
  args: Array<(() => any) | any>,
  withSelector?: boolean,
  markReactive?: boolean,
): any {
  return {
    withSelector,
    markReactive,
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
      sys: beanInstance.sys,
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
  const markReactive = res.markReactive ?? true;
  const args = res.args.map((arg, index) => {
    return typeof arg === 'function'
      ? markReactive && (!withSelector || index > 0)
        ? toRef(arg)
        : arg()
      : arg;
  });
  return { withSelector, args };
}

function __prepareInjectSelectorInfo_init(
  beanInstance,
  useOptions: IDecoratorUseOptionsBase,
): IInjectSelectorInfo | undefined {
  const init = useOptions.init;
  if (!init) return;
  const withSelector = init.withSelector ?? false;
  const markReactive = init.markReactive ?? true;
  const _args = init.args ?? [init.arg];
  if (!_args) return;
  const args = _args.map((arg, index) =>
    __prepareInjectSelectorInfo_init_arg(
      beanInstance,
      arg,
      markReactive && (!withSelector || index > 0),
    ),
  );
  return { withSelector, args };
}

function __prepareInjectSelectorInfo_init_arg(
  beanInstance,
  arg: TypeDecoratorUseOptionsInitArg,
  reactive: boolean,
): any {
  const context = {
    self: beanInstance,
    sys: beanInstance.sys,
    app: beanInstance.app,
    ctx: beanInstance.ctx,
  };
  if (reactive && evaluateExpressions(arg, context, undefined, true)) {
    return toRef(() => evaluateExpressions(arg, context));
  }
  return evaluateExpressions(arg, context);
}
