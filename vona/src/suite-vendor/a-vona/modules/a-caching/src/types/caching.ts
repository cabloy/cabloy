import type { BeanBase } from 'vona';
import type { ISummerCacheRecord, TSummerCacheActionOptions } from 'vona-module-a-summer';

export type TypeCachingActionIntention = 'get' | 'set' | 'del' | 'create';
export interface ICachingActionKeyInfo {
  result?: any;
  args: any[];
  prop: string;
  receiver: BeanBase;
  intention: TypeCachingActionIntention;
}

export interface ICachingActionValueInfo {
  result: any;
  args: any[];
  prop: string;
  receiver: BeanBase;
  intention: TypeCachingActionIntention;
}

export type TypeCacheKeyFn = (
  info: ICachingActionKeyInfo,
  options: TypeCachingActionOptions,
) => any;
export type TypeCacheValueFn = (
  info: ICachingActionValueInfo,
  options: TypeCachingActionOptions,
) => any;

export type TypeCachingActionOptions = Pick<
  TSummerCacheActionOptions<unknown, unknown>,
  'mode' | 'ignoreNull' | 'ttl' | 'updateAgeOnGet' | 'broadcastOnSet'
> & {
  cacheName: keyof ISummerCacheRecord;
  cacheKey?: any;
  cacheKeyFn?: TypeCacheKeyFn | string;
};

export type TypeCachingActionClearOptions = Omit<
  TypeCachingActionOptions,
  'cacheKey' | 'cacheKeyFn'
>;
