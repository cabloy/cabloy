import { Aspect } from 'vona-module-a-aspect';

import type { IAopMethodOptionsCachingClear } from '../bean/aopMethod.cachingClear.ts';
import type { IAopMethodOptionsCachingDel } from '../bean/aopMethod.cachingDel.ts';
import type { IAopMethodOptionsCachingGet } from '../bean/aopMethod.cachingGet.ts';
import type { IAopMethodOptionsCachingSet } from '../bean/aopMethod.cachingSet.ts';

function Get(options?: Partial<IAopMethodOptionsCachingGet>): MethodDecorator {
  return Aspect.aopMethod('a-caching:cachingGet', options);
}

function Set(options?: Partial<IAopMethodOptionsCachingSet>): MethodDecorator {
  return Aspect.aopMethod('a-caching:cachingSet', options);
}

function Del(options?: Partial<IAopMethodOptionsCachingDel>): MethodDecorator {
  return Aspect.aopMethod('a-caching:cachingDel', options);
}

function Clear(options?: Partial<IAopMethodOptionsCachingClear>): MethodDecorator {
  return Aspect.aopMethod('a-caching:cachingClear', options);
}

export const Caching = {
  get: Get,
  set: Set,
  del: Del,
  clear: Clear,
};
