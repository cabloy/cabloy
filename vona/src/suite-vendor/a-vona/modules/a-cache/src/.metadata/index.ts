// eslint-disable
/** bean: begin */
export * from '../bean/bean.cache.ts';
export * from '../bean/bean.cacheMemBase.ts';
export * from '../bean/bean.cacheRedisBase.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-cache' {
  
        export interface BeanCache {
          /** @internal */
          get scope(): ScopeModuleACache;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanCache } from '../bean/bean.cache.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'cache': BeanCache;
  }
}
/** bean: end */
/** broadcast: begin */
export * from '../bean/broadcast.memClear.ts';
export * from '../bean/broadcast.memDel.ts';
export * from '../bean/broadcast.memMultiDel.ts';
export * from '../bean/broadcast.memMultiSet.ts';
export * from '../bean/broadcast.memSet.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-cache:memClear': IDecoratorBroadcastOptions;
'a-cache:memDel': IDecoratorBroadcastOptions;
'a-cache:memMultiDel': IDecoratorBroadcastOptions;
'a-cache:memMultiSet': IDecoratorBroadcastOptions;
'a-cache:memSet': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-cache' {
  
        export interface BroadcastMemClear {
          /** @internal */
          get scope(): ScopeModuleACache;
        }

          export interface BroadcastMemClear {
            get $beanFullName(): 'a-cache.broadcast.memClear';
            get $onionName(): 'a-cache:memClear';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastMemDel {
          /** @internal */
          get scope(): ScopeModuleACache;
        }

          export interface BroadcastMemDel {
            get $beanFullName(): 'a-cache.broadcast.memDel';
            get $onionName(): 'a-cache:memDel';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastMemMultiDel {
          /** @internal */
          get scope(): ScopeModuleACache;
        }

          export interface BroadcastMemMultiDel {
            get $beanFullName(): 'a-cache.broadcast.memMultiDel';
            get $onionName(): 'a-cache:memMultiDel';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastMemMultiSet {
          /** @internal */
          get scope(): ScopeModuleACache;
        }

          export interface BroadcastMemMultiSet {
            get $beanFullName(): 'a-cache.broadcast.memMultiSet';
            get $onionName(): 'a-cache:memMultiSet';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastMemSet {
          /** @internal */
          get scope(): ScopeModuleACache;
        }

          export interface BroadcastMemSet {
            get $beanFullName(): 'a-cache.broadcast.memSet';
            get $onionName(): 'a-cache:memSet';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastMemClear } from '../bean/broadcast.memClear.ts';
import type { BroadcastMemDel } from '../bean/broadcast.memDel.ts';
import type { BroadcastMemMultiDel } from '../bean/broadcast.memMultiDel.ts';
import type { BroadcastMemMultiSet } from '../bean/broadcast.memMultiSet.ts';
import type { BroadcastMemSet } from '../bean/broadcast.memSet.ts';
export interface IModuleBroadcast {
  'memClear': BroadcastMemClear;
'memDel': BroadcastMemDel;
'memMultiDel': BroadcastMemMultiDel;
'memMultiSet': BroadcastMemMultiSet;
'memSet': BroadcastMemSet;
}
/** broadcast: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleACache extends BeanScopeBase {}

export interface ScopeModuleACache {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
broadcast: IModuleBroadcast;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-cache': ScopeModuleACache;
  }

  export interface IBeanScopeContainer {
    cache: ScopeModuleACache;
  }
  
  export interface IBeanScopeConfig {
    'a-cache': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
