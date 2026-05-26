import { evaluateExpressions } from '@cabloy/utils';
import { isNil } from '@cabloy/utils';
import { cast } from 'vona';
import { getKeyHash } from 'vona-module-a-cache';

import type { IAopMethodOptionsCachingSet } from '../bean/aopMethod.cachingSet.ts';
import type {
  ICachingActionKeyInfo,
  ICachingActionValueInfo,
  TypeCachingActionOptions,
} from '../types/caching.ts';

export function combineCachingKey(info: ICachingActionKeyInfo, options: TypeCachingActionOptions) {
  const { result, args, prop, receiver, intention } = info;
  // cacheKeyFn
  if (options.cacheKeyFn) {
    if (typeof options.cacheKeyFn === 'string') {
      if (!receiver[options.cacheKeyFn]) {
        throw new Error(
          `cacheKeyFn not found: ${cast(receiver).$beanFullName}#${options.cacheKeyFn}`,
        );
      }
      return _hashKey(receiver[options.cacheKeyFn](info, options));
    }
    return _hashKey(options.cacheKeyFn.call(receiver, info, options));
  }
  // cacheKey
  if (options.cacheKey) {
    return _hashKey(
      evaluateExpressions(options.cacheKey, {
        args,
        prop,
        intention,
        options,
        self: { ...receiver },
      }),
    );
  }
  // default: only use first arg
  let argsPick: any[];
  if (intention === 'create') {
    argsPick = [result?.id];
  } else if (intention === 'set') {
    argsPick = args.slice(0, args.length - 1);
  } else {
    argsPick = args;
  }
  const argFirst = argsPick.length === 1 ? argsPick[0] : argsPick;
  return _hashKey(argFirst);
}

export function combineCachingValue(
  info: ICachingActionValueInfo,
  options: IAopMethodOptionsCachingSet,
) {
  const { result, args, prop, receiver, intention } = info;
  // cacheValueFn
  if (!isNil(options.cacheValueFn)) {
    if (typeof options.cacheValueFn === 'string') {
      if (!receiver[options.cacheValueFn]) {
        throw new Error(
          `cacheValueFn not found: ${cast(receiver).$beanFullName}#${options.cacheValueFn}`,
        );
      }
      return receiver[options.cacheValueFn](info, options);
    }
    return options.cacheValueFn.call(receiver, info, options);
  }
  // cacheValue
  if (!isNil(options.cacheValue)) {
    return evaluateExpressions(options.cacheValue, {
      result,
      args,
      prop,
      intention,
      options,
      self: { ...receiver },
    });
  }
  // default
  if (intention === 'set') {
    return args[args.length - 1];
  } else {
    return result;
  }
}

export function isCachingKeyValid(key: any) {
  return !isNil(key);
  // return !isNil(key) && key !== false && key !== '';
}

function _hashKey(arg: any) {
  return isCachingKeyValid(arg) ? getKeyHash(arg) : arg;
}
