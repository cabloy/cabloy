// eslint-disable
/** bean: begin */
export * from '../bean/bean.worker.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-worker' {
  
        export interface BeanWorker {
          /** @internal */
          get scope(): ScopeModuleAWorker;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanWorker } from '../bean/bean.worker.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'worker': BeanWorker;
  }
}
/** bean: end */
/** broadcast: begin */
export * from '../bean/broadcast.exitAll.ts';
export * from '../bean/broadcast.reloadAll.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-worker:exitAll': IDecoratorBroadcastOptions;
'a-worker:reloadAll': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-worker' {
  
        export interface BroadcastExitAll {
          /** @internal */
          get scope(): ScopeModuleAWorker;
        }

          export interface BroadcastExitAll {
            get $beanFullName(): 'a-worker.broadcast.exitAll';
            get $onionName(): 'a-worker:exitAll';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastReloadAll {
          /** @internal */
          get scope(): ScopeModuleAWorker;
        }

          export interface BroadcastReloadAll {
            get $beanFullName(): 'a-worker.broadcast.reloadAll';
            get $onionName(): 'a-worker:reloadAll';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastExitAll } from '../bean/broadcast.exitAll.ts';
import type { BroadcastReloadAll } from '../bean/broadcast.reloadAll.ts';
export interface IModuleBroadcast {
  'exitAll': BroadcastExitAll;
'reloadAll': BroadcastReloadAll;
}
/** broadcast: end */
/** cacheRedis: begin */
export * from '../bean/cacheRedis.workerAlive.ts';

import { type IDecoratorCacheRedisOptions } from 'vona-module-a-cache';
declare module 'vona-module-a-cache' {
  
    export interface ICacheRedisRecord {
      'a-worker:workerAlive': IDecoratorCacheRedisOptions;
    }

  
}
declare module 'vona-module-a-worker' {
  
        export interface CacheRedisWorkerAlive {
          /** @internal */
          get scope(): ScopeModuleAWorker;
        }

          export interface CacheRedisWorkerAlive {
            get $beanFullName(): 'a-worker.cacheRedis.workerAlive';
            get $onionName(): 'a-worker:workerAlive';
            get $onionOptions(): IDecoratorCacheRedisOptions;
          } 
}
/** cacheRedis: end */
/** cacheRedis: begin */
import type { CacheRedisWorkerAlive } from '../bean/cacheRedis.workerAlive.ts';
export interface IModuleCacheRedis {
  'workerAlive': CacheRedisWorkerAlive;
}
/** cacheRedis: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAWorker extends BeanScopeBase {}

export interface ScopeModuleAWorker {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
broadcast: IModuleBroadcast;
cacheRedis: IModuleCacheRedis;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-worker': ScopeModuleAWorker;
  }

  export interface IBeanScopeContainer {
    worker: ScopeModuleAWorker;
  }
  
  export interface IBeanScopeConfig {
    'a-worker': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
