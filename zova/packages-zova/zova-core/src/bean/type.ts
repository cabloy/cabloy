import type { defineOptions, Ref, VNode } from 'vue';

import type { IBeanSceneRecord } from '../decorator/interface/beanOptions.ts';
import type { RequiredSome } from '../types/utils/requiredSome.ts';
import type { TypeRecordValues } from '../types/utils/type.ts';
import type { TypeErrorsInternal } from './resource/error/errorInternal.ts';

export interface IBeanRecordGeneral {}
export interface IBeanRecordLocal {}

export type IBeanRecord = IBeanRecordGeneral & IBeanRecordLocal;
export type TypeBeanRecordKeys = keyof IBeanRecord;

export type TypeBeanRecordGeneralSelector<SCENE extends keyof IBeanSceneRecord> = {
  [K in keyof IBeanRecordGeneral as K extends `${string}.${SCENE}.${string}`
    ? K
    : never]: IBeanRecordGeneral[K];
};
export type TypeBeanRecordGeneralSelectorKeys<SCENE extends keyof IBeanSceneRecord> =
  keyof TypeBeanRecordGeneralSelector<SCENE>;

export type TypeBeanRecordGeneralSelectorSpecificName<
  SCENE extends keyof IBeanSceneRecord,
  NAME extends string,
> = {
  [K in keyof IBeanRecordGeneral as K extends `${string}.${SCENE}.${NAME}`
    ? K
    : never]: IBeanRecordGeneral[K];
};

export type TypeBeanRecordGeneralSelectorSpecificNameKeys<
  SCENE extends keyof IBeanSceneRecord,
  NAME extends string,
> = keyof TypeBeanRecordGeneralSelectorSpecificName<SCENE, NAME>;

export interface IBeanScopeRecord {}
export type TypeBeanScopeRecordKeys = keyof IBeanScopeRecord;

export interface IBeanScopeConfig {}
export type TypeBeanScopeConfigKeys = keyof IBeanScopeConfig;

export interface IBeanScopeLocale {}
export type TypeBeanScopeLocaleKeys = keyof IBeanScopeLocale;

export interface IBeanScopeErrors {}
export type TypeBeanScopeErrorsKeys = keyof IBeanScopeErrors;

export type TypeScopesErrorsHelper<
  ModuleName extends keyof IBeanScopeErrors,
  Errors extends IBeanScopeErrors[ModuleName],
> = {
  // @ts-ignore: ignore
  [K in keyof Errors as `${ModuleName}:${Errors[K]}`]: K;
};
export type TypeScopesErrorCodes = TypeRecordValues<{
  [ModuleName in keyof IBeanScopeErrors]: keyof TypeScopesErrorsHelper<
    ModuleName,
    IBeanScopeErrors[ModuleName]
  >;
}>;
export type TypeAllErrorCodes = TypeScopesErrorCodes | keyof TypeErrorsInternal;

export interface IControllerDataContext {
  slots?: object;
}

export interface IControllerData {
  context: IControllerDataContext;
}

export const BeanControllerIdentifier = '$$c';
export const BeanRenderIdentifier = '$$r';
export const BeanStyleIdentifier = '$$s';
export const SymbolControllerRefDisable = Symbol('SymbolControllerRefDisable');

export function $getBeanName<K extends keyof IBeanRecord>(beanFullName: K): K {
  return beanFullName;
}

export type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> &
  [ModelRef<T, M, G, S>, Record<M, true | undefined>];

export interface DefineModelOptions<T = any, G = T, S = T> {
  get?: (v: T) => G;
  set?: (v: S) => any;
}

export type IComponentOptions = Parameters<typeof defineOptions>[0] & {
  deepExtendDefault?: boolean;
};

export type IEmit = () => void;
export type ISlot = (...args: any[]) => VNode;

export interface ISlotsDefault {
  default?: ISlot;
}

export type TypePropValueFromModel<T> = T extends 'vModel'
  ? 'modelValue'
  : T extends `vModel:${string}_${string}`
    ? never
    : T extends `vModel:${infer ARG}`
      ? ARG
      : never;
export type TypePropUpdateFromModel<T> = T extends 'vModel'
  ? 'onUpdate:modelValue'
  : T extends `vModel:${string}_${string}`
    ? never
    : T extends `vModel:${infer ARG}`
      ? `onUpdate:${ARG}`
      : never;
// @ts-ignore ignore
export type TypeControllerInnerProps<PROPS, PROPSDEFAULT> = RequiredSome<PROPS, PROPSDEFAULT>;
