/** bean merge: bean.instance */

import type { TypeRecordValues } from '../../types/utils/type.ts';
import type { IBeanSceneRecord } from '../decorator/interface/beanOptions.ts';
import type { TypeErrorsInternal } from './resource/error/errorInternal.ts';

export interface IBeanRecordGlobal {}
export interface IBeanRecordGeneral {}
export type TypeBeanRecordGeneralSelector<SCENE extends keyof IBeanSceneRecord> = {
  [K in keyof IBeanRecordGeneral as K extends `${string}.${SCENE}.${string}`
    ? K
    : never]: IBeanRecordGeneral[K];
};
export type TypeBeanRecordGeneralSelectorKeys<SCENE extends keyof IBeanSceneRecord> =
  keyof TypeBeanRecordGeneralSelector<SCENE>;

export type IBeanRecord = IBeanRecordGlobal & IBeanRecordGeneral;
export type TypeBeanRecordKeys = keyof IBeanRecord;

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
